import axios from "axios";

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  saturatedFat: number;
  transFat: number;
  cholesterol: number;
  sodium: number;
  fiber: number;
  sugar: number;
  vitaminD: number;
  calcium: number;
  iron: number;
  potassium: number;
}

// In-memory cache to avoid duplicate API calls for the same ingredient
const cache = new Map<string, NutritionInfo>();

// Stubbed nutrition data as fallback when API is unavailable
const stubbedNutritionData: { [key: string]: NutritionInfo } = {
  Oatmeal: {
    calories: 150, protein: 5, carbs: 27, fats: 3,
    saturatedFat: 0.5, transFat: 0, cholesterol: 0, sodium: 0,
    fiber: 4, sugar: 1, vitaminD: 0, calcium: 20, iron: 2, potassium: 150,
  },
  Banana: {
    calories: 105, protein: 1.3, carbs: 27, fats: 0.4,
    saturatedFat: 0.1, transFat: 0, cholesterol: 0, sodium: 1,
    fiber: 3.1, sugar: 14, vitaminD: 0, calcium: 5, iron: 0.3, potassium: 422,
  },
  Almonds: {
    calories: 164, protein: 6, carbs: 6, fats: 14,
    saturatedFat: 1, transFat: 0, cholesterol: 0, sodium: 0,
    fiber: 3.5, sugar: 1.2, vitaminD: 0, calcium: 76, iron: 1, potassium: 208,
  },
  Honey: {
    calories: 64, protein: 0.1, carbs: 17, fats: 0,
    saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 0,
    fiber: 0, sugar: 17, vitaminD: 0, calcium: 1, iron: 0.1, potassium: 11,
  },
  "Grilled Chicken Breast": {
    calories: 165, protein: 31, carbs: 0, fats: 3.6,
    saturatedFat: 1, transFat: 0, cholesterol: 85, sodium: 74,
    fiber: 0, sugar: 0, vitaminD: 0.1, calcium: 15, iron: 1, potassium: 256,
  },
  "Brown Rice": {
    calories: 216, protein: 5, carbs: 45, fats: 1.8,
    saturatedFat: 0.4, transFat: 0, cholesterol: 0, sodium: 10,
    fiber: 3.5, sugar: 0.7, vitaminD: 0, calcium: 20, iron: 0.8, potassium: 84,
  },
  Broccoli: {
    calories: 55, protein: 3.7, carbs: 11.2, fats: 0.6,
    saturatedFat: 0.1, transFat: 0, cholesterol: 0, sodium: 64,
    fiber: 5.2, sugar: 2.2, vitaminD: 0, calcium: 47, iron: 0.7, potassium: 316,
  },
  "Olive Oil": {
    calories: 119, protein: 0, carbs: 0, fats: 14,
    saturatedFat: 1.9, transFat: 0, cholesterol: 0, sodium: 0,
    fiber: 0, sugar: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0,
  },
  Salmon: {
    calories: 208, protein: 22, carbs: 0, fats: 13,
    saturatedFat: 2.5, transFat: 0, cholesterol: 55, sodium: 59,
    fiber: 0, sugar: 0, vitaminD: 11, calcium: 9, iron: 0.3, potassium: 363,
  },
  "Sweet Potato": {
    calories: 103, protein: 2, carbs: 23.6, fats: 0.2,
    saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 41,
    fiber: 3.8, sugar: 7.4, vitaminD: 0, calcium: 43, iron: 0.7, potassium: 438,
  },
  Asparagus: {
    calories: 20, protein: 2.2, carbs: 3.9, fats: 0.2,
    saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 13,
    fiber: 2.1, sugar: 1.9, vitaminD: 0, calcium: 24, iron: 2.1, potassium: 202,
  },
  Butter: {
    calories: 102, protein: 0.1, carbs: 0, fats: 11.5,
    saturatedFat: 7.3, transFat: 0.5, cholesterol: 31, sodium: 2,
    fiber: 0, sugar: 0, vitaminD: 0.1, calcium: 3, iron: 0, potassium: 3,
  },
};

// Calls the FastAPI proxy server (proxied by Vite in dev via /api -> localhost:3001)
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

function mapNutritionixResponse(food: Record<string, unknown>): NutritionInfo {
  return {
    calories: (food.nf_calories as number) ?? 0,
    protein: (food.nf_protein as number) ?? 0,
    carbs: (food.nf_total_carbohydrate as number) ?? 0,
    fats: (food.nf_total_fat as number) ?? 0,
    saturatedFat: (food.nf_saturated_fat as number) ?? 0,
    transFat: (food.nf_trans_fatty_acid as number) ?? 0,
    cholesterol: (food.nf_cholesterol as number) ?? 0,
    sodium: (food.nf_sodium as number) ?? 0,
    fiber: (food.nf_dietary_fiber as number) ?? 0,
    sugar: (food.nf_sugars as number) ?? 0,
    vitaminD: (food.nf_vitamin_d_mcg as number) ?? 0,
    calcium: (food.nf_calcium_mg as number) ?? 0,
    iron: (food.nf_iron_mg as number) ?? 0,
    potassium: (food.nf_potassium as number) ?? 0,
  };
}

export const fetchNutritionInfo = async (
  ingredient: string
): Promise<NutritionInfo> => {
  // Check cache first
  const cached = cache.get(ingredient);
  if (cached) return cached;

  try {
    const response = await apiClient.post("/nutrition", {
      query: ingredient,
    });

    const foods = response.data?.foods;
    if (!foods || foods.length === 0) {
      throw new Error(`No nutrition data found for "${ingredient}"`);
    }

    // If multiple foods are returned (e.g. "1 cup rice and beans"),
    // sum their nutrition values
    const result = foods.reduce(
      (total: NutritionInfo, food: Record<string, unknown>) => {
        const mapped = mapNutritionixResponse(food);
        return {
          calories: total.calories + mapped.calories,
          protein: total.protein + mapped.protein,
          carbs: total.carbs + mapped.carbs,
          fats: total.fats + mapped.fats,
          saturatedFat: total.saturatedFat + mapped.saturatedFat,
          transFat: total.transFat + mapped.transFat,
          cholesterol: total.cholesterol + mapped.cholesterol,
          sodium: total.sodium + mapped.sodium,
          fiber: total.fiber + mapped.fiber,
          sugar: total.sugar + mapped.sugar,
          vitaminD: total.vitaminD + mapped.vitaminD,
          calcium: total.calcium + mapped.calcium,
          iron: total.iron + mapped.iron,
          potassium: total.potassium + mapped.potassium,
        };
      },
      {
        calories: 0, protein: 0, carbs: 0, fats: 0,
        saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 0,
        fiber: 0, sugar: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0,
      } as NutritionInfo
    );

    cache.set(ingredient, result);
    return result;
  } catch (error) {
    console.warn(`Nutritionix API failed for "${ingredient}", using fallback:`, error);

    // Fall back to stubbed data if available, otherwise return zeros
    const fallback = stubbedNutritionData[ingredient] ?? {
      calories: 0, protein: 0, carbs: 0, fats: 0,
      saturatedFat: 0, transFat: 0, cholesterol: 0, sodium: 0,
      fiber: 0, sugar: 0, vitaminD: 0, calcium: 0, iron: 0, potassium: 0,
    };

    cache.set(ingredient, fallback);
    return fallback;
  }
};
