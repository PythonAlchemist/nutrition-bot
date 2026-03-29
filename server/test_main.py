import os
from unittest.mock import patch

import httpx
import respx
from fastapi.testclient import TestClient

os.environ["NUTRITIONIX_APP_ID"] = "test_app_id"
os.environ["NUTRITIONIX_API_KEY"] = "test_api_key"

from main import app

client = TestClient(app)

NUTRITIONIX_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients"

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


def test_missing_query_returns_422():
    response = client.post("/api/nutrition", json={})
    assert response.status_code == 422


def test_empty_body_returns_422():
    response = client.post("/api/nutrition")
    assert response.status_code == 422


@patch("main.APP_ID", None)
@patch("main.API_KEY", None)
def test_missing_credentials_returns_500():
    response = client.post("/api/nutrition", json={"query": "banana"})
    assert response.status_code == 500
    assert "credentials" in response.json()["detail"].lower()


@respx.mock
def test_successful_nutrition_lookup():
    respx.post(NUTRITIONIX_URL).mock(
        return_value=httpx.Response(200, json=SAMPLE_NUTRITIONIX_RESPONSE)
    )

    response = client.post("/api/nutrition", json={"query": "1 banana"})
    assert response.status_code == 200
    data = response.json()
    assert "foods" in data
    assert data["foods"][0]["nf_calories"] == 105


@respx.mock
def test_nutritionix_404_returns_404():
    respx.post(NUTRITIONIX_URL).mock(
        return_value=httpx.Response(404, json={"message": "not found"})
    )

    response = client.post("/api/nutrition", json={"query": "unknown food"})
    assert response.status_code == 404


@respx.mock
def test_nutritionix_401_returns_401():
    respx.post(NUTRITIONIX_URL).mock(
        return_value=httpx.Response(401, json={"message": "unauthorized"})
    )

    response = client.post("/api/nutrition", json={"query": "banana"})
    assert response.status_code == 401


@respx.mock
def test_network_error_returns_502():
    respx.post(NUTRITIONIX_URL).mock(side_effect=httpx.ConnectError("Connection failed"))

    response = client.post("/api/nutrition", json={"query": "banana"})
    assert response.status_code == 502
    assert "Failed to reach" in response.json()["detail"]
