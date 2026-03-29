import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface RecipeNutrient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeSummary {
  id: number;
  title: string;
  image: string;
  imageType: string;
  nutrition?: {
    nutrients: RecipeNutrient[];
  };
}

export interface RecipeSearchResponse {
  results: RecipeSummary[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface RecipeIngredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  original: string;
}

export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  sourceUrl: string;
  summary: string;
  instructions: string;
  extendedIngredients: RecipeIngredient[];
  nutrition?: {
    nutrients: RecipeNutrient[];
  };
  diets: string[];
  cuisines: string[];
}

export interface RecipeSearchParams {
  query?: string;
  diet?: string;
  cuisine?: string;
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
  minCalories?: number;
  maxCalories?: number;
  number?: number;
  offset?: number;
}

export const searchRecipes = async (
  params: RecipeSearchParams
): Promise<RecipeSearchResponse> => {
  const response = await apiClient.get("/recipes/search", { params });
  return response.data;
};

export const getRecipeDetail = async (
  recipeId: number
): Promise<RecipeDetail> => {
  const response = await apiClient.get(`/recipes/${recipeId}`);
  return response.data;
};

/** Extract macro values from a Spoonacular nutrient array */
export function extractMacros(nutrients: RecipeNutrient[]): {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
} {
  const find = (name: string) =>
    nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase())
      ?.amount ?? 0;

  return {
    calories: find("Calories"),
    protein: find("Protein"),
    carbs: find("Carbohydrates"),
    fats: find("Fat"),
  };
}
