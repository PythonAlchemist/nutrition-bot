import os
from unittest.mock import patch

import httpx
import respx
from fastapi.testclient import TestClient

os.environ["NUTRITIONIX_APP_ID"] = "test_app_id"
os.environ["NUTRITIONIX_API_KEY"] = "test_api_key"
os.environ["SPOONACULAR_API_KEY"] = "test_spoonacular_key"

from main import app

client = TestClient(app)

NUTRITIONIX_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients"
SPOONACULAR_SEARCH_URL = "https://api.spoonacular.com/recipes/complexSearch"
SPOONACULAR_RECIPE_URL = "https://api.spoonacular.com/recipes/123/information"

SAMPLE_NUTRITIONIX_RESPONSE = {
    "foods": [
        {
            "food_name": "banana",
            "nf_calories": 105,
            "nf_protein": 1.3,
            "nf_total_carbohydrate": 27,
            "nf_total_fat": 0.4,
        }
    ]
}

SAMPLE_SEARCH_RESPONSE = {
    "results": [
        {
            "id": 123,
            "title": "Grilled Chicken Salad",
            "image": "https://example.com/img.jpg",
            "nutrition": {
                "nutrients": [
                    {"name": "Calories", "amount": 350, "unit": "kcal"},
                    {"name": "Protein", "amount": 30, "unit": "g"},
                ]
            },
        }
    ],
    "offset": 0,
    "number": 10,
    "totalResults": 1,
}

SAMPLE_RECIPE_DETAIL = {
    "id": 123,
    "title": "Grilled Chicken Salad",
    "servings": 2,
    "readyInMinutes": 30,
    "instructions": "1. Grill chicken. 2. Toss salad.",
    "extendedIngredients": [
        {"id": 1, "name": "chicken breast", "amount": 200, "unit": "g", "original": "200g chicken breast"}
    ],
    "nutrition": {
        "nutrients": [
            {"name": "Calories", "amount": 350, "unit": "kcal"},
        ]
    },
}


# ---- Nutritionix endpoint tests ----

def test_nutrition_missing_query_returns_422():
    response = client.post("/api/nutrition", json={})
    assert response.status_code == 422


def test_nutrition_empty_body_returns_422():
    response = client.post("/api/nutrition")
    assert response.status_code == 422


@patch("main.NUTRITIONIX_APP_ID", None)
@patch("main.NUTRITIONIX_API_KEY", None)
def test_nutrition_missing_credentials_returns_500():
    response = client.post("/api/nutrition", json={"query": "banana"})
    assert response.status_code == 500
    assert "credentials" in response.json()["detail"].lower()


@respx.mock
def test_nutrition_successful_lookup():
    respx.post(NUTRITIONIX_URL).mock(
        return_value=httpx.Response(200, json=SAMPLE_NUTRITIONIX_RESPONSE)
    )

    response = client.post("/api/nutrition", json={"query": "1 banana"})
    assert response.status_code == 200
    data = response.json()
    assert "foods" in data
    assert data["foods"][0]["nf_calories"] == 105


@respx.mock
def test_nutrition_404_returns_404():
    respx.post(NUTRITIONIX_URL).mock(
        return_value=httpx.Response(404, json={"message": "not found"})
    )

    response = client.post("/api/nutrition", json={"query": "unknown food"})
    assert response.status_code == 404


@respx.mock
def test_nutrition_401_returns_401():
    respx.post(NUTRITIONIX_URL).mock(
        return_value=httpx.Response(401, json={"message": "unauthorized"})
    )

    response = client.post("/api/nutrition", json={"query": "banana"})
    assert response.status_code == 401


@respx.mock
def test_nutrition_network_error_returns_502():
    respx.post(NUTRITIONIX_URL).mock(side_effect=httpx.ConnectError("Connection failed"))

    response = client.post("/api/nutrition", json={"query": "banana"})
    assert response.status_code == 502
    assert "Failed to reach" in response.json()["detail"]


# ---- Recipe search endpoint tests ----

@patch("main.SPOONACULAR_API_KEY", None)
def test_recipe_search_missing_key_returns_500():
    response = client.get("/api/recipes/search", params={"query": "chicken"})
    assert response.status_code == 500
    assert "Spoonacular" in response.json()["detail"]


@respx.mock
def test_recipe_search_successful():
    respx.get(SPOONACULAR_SEARCH_URL).mock(
        return_value=httpx.Response(200, json=SAMPLE_SEARCH_RESPONSE)
    )

    response = client.get("/api/recipes/search", params={"query": "chicken salad"})
    assert response.status_code == 200
    data = response.json()
    assert data["totalResults"] == 1
    assert data["results"][0]["title"] == "Grilled Chicken Salad"


@respx.mock
def test_recipe_search_with_macro_filters():
    respx.get(SPOONACULAR_SEARCH_URL).mock(
        return_value=httpx.Response(200, json=SAMPLE_SEARCH_RESPONSE)
    )

    response = client.get("/api/recipes/search", params={
        "query": "chicken",
        "minProtein": 20,
        "maxCarbs": 50,
        "diet": "keto",
    })
    assert response.status_code == 200
    # Verify the upstream request included our params
    request = respx.calls[0].request
    assert "minProtein=20" in str(request.url)
    assert "maxCarbs=50" in str(request.url)
    assert "diet=keto" in str(request.url)


@respx.mock
def test_recipe_search_caps_number_at_100():
    respx.get(SPOONACULAR_SEARCH_URL).mock(
        return_value=httpx.Response(200, json=SAMPLE_SEARCH_RESPONSE)
    )

    response = client.get("/api/recipes/search", params={"number": 999})
    assert response.status_code == 200
    request = respx.calls[0].request
    assert "number=100" in str(request.url)


@respx.mock
def test_recipe_search_network_error():
    respx.get(SPOONACULAR_SEARCH_URL).mock(side_effect=httpx.ConnectError("timeout"))

    response = client.get("/api/recipes/search", params={"query": "pasta"})
    assert response.status_code == 502
    assert "Failed to reach Spoonacular" in response.json()["detail"]


@respx.mock
def test_recipe_search_upstream_error():
    respx.get(SPOONACULAR_SEARCH_URL).mock(
        return_value=httpx.Response(402, json={"message": "quota exceeded"})
    )

    response = client.get("/api/recipes/search", params={"query": "pasta"})
    assert response.status_code == 402


# ---- Recipe detail endpoint tests ----

@patch("main.SPOONACULAR_API_KEY", None)
def test_recipe_detail_missing_key_returns_500():
    response = client.get("/api/recipes/123")
    assert response.status_code == 500


@respx.mock
def test_recipe_detail_successful():
    respx.get(SPOONACULAR_RECIPE_URL).mock(
        return_value=httpx.Response(200, json=SAMPLE_RECIPE_DETAIL)
    )

    response = client.get("/api/recipes/123")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Grilled Chicken Salad"
    assert data["servings"] == 2
    assert len(data["extendedIngredients"]) == 1


@respx.mock
def test_recipe_detail_not_found():
    respx.get("https://api.spoonacular.com/recipes/999/information").mock(
        return_value=httpx.Response(404, json={"message": "not found"})
    )

    response = client.get("/api/recipes/999")
    assert response.status_code == 404


@respx.mock
def test_recipe_detail_network_error():
    respx.get(SPOONACULAR_RECIPE_URL).mock(side_effect=httpx.ConnectError("timeout"))

    response = client.get("/api/recipes/123")
    assert response.status_code == 502
    assert "Failed to reach Spoonacular" in response.json()["detail"]
