import os
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Nutritionix config
NUTRITIONIX_API_URL = "https://trackapi.nutritionix.com/v2"
NUTRITIONIX_APP_ID = os.environ.get("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.environ.get("NUTRITIONIX_API_KEY")

# Spoonacular config
SPOONACULAR_API_URL = "https://api.spoonacular.com"
SPOONACULAR_API_KEY = os.environ.get("SPOONACULAR_API_KEY")


class NutritionQuery(BaseModel):
    query: str


@app.post("/api/nutrition")
async def get_nutrition(body: NutritionQuery):
    if not NUTRITIONIX_APP_ID or not NUTRITIONIX_API_KEY:
        raise HTTPException(status_code=500, detail="Nutritionix API credentials not configured")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{NUTRITIONIX_API_URL}/natural/nutrients",
                json={"query": body.query},
                headers={
                    "x-app-id": NUTRITIONIX_APP_ID,
                    "x-app-key": NUTRITIONIX_API_KEY,
                    "Content-Type": "application/json",
                },
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Nutritionix API error")
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Failed to reach Nutritionix API")


@app.get("/api/recipes/search")
async def search_recipes(
    query: Optional[str] = Query(None, description="Search query (e.g. 'chicken pasta')"),
    diet: Optional[str] = Query(None, description="Diet filter (e.g. 'vegetarian', 'keto', 'paleo')"),
    cuisine: Optional[str] = Query(None, description="Cuisine type (e.g. 'italian', 'mexican')"),
    minProtein: Optional[int] = Query(None, description="Minimum protein in grams"),
    maxProtein: Optional[int] = Query(None, description="Maximum protein in grams"),
    minCarbs: Optional[int] = Query(None, description="Minimum carbs in grams"),
    maxCarbs: Optional[int] = Query(None, description="Maximum carbs in grams"),
    minFat: Optional[int] = Query(None, description="Minimum fat in grams"),
    maxFat: Optional[int] = Query(None, description="Maximum fat in grams"),
    minCalories: Optional[int] = Query(None, description="Minimum calories"),
    maxCalories: Optional[int] = Query(None, description="Maximum calories"),
    number: int = Query(10, description="Number of results (max 100)"),
    offset: int = Query(0, description="Pagination offset"),
):
    if not SPOONACULAR_API_KEY:
        raise HTTPException(status_code=500, detail="Spoonacular API key not configured")

    params: dict = {
        "apiKey": SPOONACULAR_API_KEY,
        "number": min(number, 100),
        "offset": offset,
        "addRecipeNutrition": True,
    }
    if query:
        params["query"] = query
    if diet:
        params["diet"] = diet
    if cuisine:
        params["cuisine"] = cuisine
    if minProtein is not None:
        params["minProtein"] = minProtein
    if maxProtein is not None:
        params["maxProtein"] = maxProtein
    if minCarbs is not None:
        params["minCarbs"] = minCarbs
    if maxCarbs is not None:
        params["maxCarbs"] = maxCarbs
    if minFat is not None:
        params["minFat"] = minFat
    if maxFat is not None:
        params["maxFat"] = maxFat
    if minCalories is not None:
        params["minCalories"] = minCalories
    if maxCalories is not None:
        params["maxCalories"] = maxCalories

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{SPOONACULAR_API_URL}/recipes/complexSearch",
                params=params,
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Spoonacular API error")
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Failed to reach Spoonacular API")


@app.get("/api/recipes/{recipe_id}")
async def get_recipe(recipe_id: int):
    if not SPOONACULAR_API_KEY:
        raise HTTPException(status_code=500, detail="Spoonacular API key not configured")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{SPOONACULAR_API_URL}/recipes/{recipe_id}/information",
                params={
                    "apiKey": SPOONACULAR_API_KEY,
                    "includeNutrition": True,
                },
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Spoonacular API error")
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Failed to reach Spoonacular API")
