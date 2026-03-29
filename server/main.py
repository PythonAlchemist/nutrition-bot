import os

from dotenv import load_dotenv

load_dotenv()

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

NUTRITIONIX_API_URL = "https://trackapi.nutritionix.com/v2"
APP_ID = os.environ.get("NUTRITIONIX_APP_ID")
API_KEY = os.environ.get("NUTRITIONIX_API_KEY")


class NutritionQuery(BaseModel):
    query: str


@app.post("/api/nutrition")
async def get_nutrition(body: NutritionQuery):
    if not APP_ID or not API_KEY:
        raise HTTPException(status_code=500, detail="Nutritionix API credentials not configured")

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{NUTRITIONIX_API_URL}/natural/nutrients",
                json={"query": body.query},
                headers={
                    "x-app-id": APP_ID,
                    "x-app-key": API_KEY,
                    "Content-Type": "application/json",
                },
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail="Nutritionix API error")
        except httpx.RequestError:
            raise HTTPException(status_code=502, detail="Failed to reach Nutritionix API")
