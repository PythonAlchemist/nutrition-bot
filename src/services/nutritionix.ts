import axios from "axios";

const NUTRITIONIX_APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const NUTRITIONIX_API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;

const nutritionixApi = axios.create({
  baseURL: "https://trackapi.nutritionix.com/v2",
  headers: {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "Content-Type": "application/json",
  },
});

interface NutritionixResponse {
  foods: Array<{
    food_name: string;
    serving_qty: number;
    serving_unit: string;
    nf_calories: number;
    nf_protein: number;
    nf_total_carbohydrate: number;
    nf_total_fat: number;
  }>;
}

export const getNutritionInfo = async (
  ingredients: string[]
): Promise<NutritionixResponse> => {
  try {
    const response = await nutritionixApi.post("/natural/nutrients", {
      query: ingredients.join(", "),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nutrition info:", error);
    throw error;
  }
};
