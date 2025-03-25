import axios from "axios";

const NUTRITION_API_URL =
  import.meta.env.VITE_NUTRITION_API_URL ||
  "https://trackapi.nutritionix.com/v2";

const APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const APP_KEY = import.meta.env.VITE_NUTRITIONIX_APP_KEY;

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

// Stubbed nutrition data for testing
const stubbedNutritionData: { [key: string]: NutritionInfo } = {
  Oatmeal: {
    calories: 150,
    protein: 5,
    carbs: 27,
    fats: 3,
    saturatedFat: 0.5,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    fiber: 4,
    sugar: 1,
    vitaminD: 0,
    calcium: 20,
    iron: 2,
    potassium: 150,
  },
  Banana: {
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fats: 0.4,
    saturatedFat: 0.1,
    transFat: 0,
    cholesterol: 0,
    sodium: 1,
    fiber: 3.1,
    sugar: 14,
    vitaminD: 0,
    calcium: 5,
    iron: 0.3,
    potassium: 422,
  },
  Almonds: {
    calories: 164,
    protein: 6,
    carbs: 6,
    fats: 14,
    saturatedFat: 1,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    fiber: 3.5,
    sugar: 1.2,
    vitaminD: 0,
    calcium: 76,
    iron: 1,
    potassium: 208,
  },
  Honey: {
    calories: 64,
    protein: 0.1,
    carbs: 17,
    fats: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    fiber: 0,
    sugar: 17,
    vitaminD: 0,
    calcium: 1,
    iron: 0.1,
    potassium: 11,
  },
  "Grilled Chicken Breast": {
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    saturatedFat: 1,
    transFat: 0,
    cholesterol: 85,
    sodium: 74,
    fiber: 0,
    sugar: 0,
    vitaminD: 0.1,
    calcium: 15,
    iron: 1,
    potassium: 256,
  },
  "Brown Rice": {
    calories: 216,
    protein: 5,
    carbs: 45,
    fats: 1.8,
    saturatedFat: 0.4,
    transFat: 0,
    cholesterol: 0,
    sodium: 10,
    fiber: 3.5,
    sugar: 0.7,
    vitaminD: 0,
    calcium: 20,
    iron: 0.8,
    potassium: 84,
  },
  Broccoli: {
    calories: 55,
    protein: 3.7,
    carbs: 11.2,
    fats: 0.6,
    saturatedFat: 0.1,
    transFat: 0,
    cholesterol: 0,
    sodium: 64,
    fiber: 5.2,
    sugar: 2.2,
    vitaminD: 0,
    calcium: 47,
    iron: 0.7,
    potassium: 316,
  },
  "Olive Oil": {
    calories: 119,
    protein: 0,
    carbs: 0,
    fats: 14,
    saturatedFat: 1.9,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    fiber: 0,
    sugar: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
  },
  Salmon: {
    calories: 208,
    protein: 22,
    carbs: 0,
    fats: 13,
    saturatedFat: 2.5,
    transFat: 0,
    cholesterol: 55,
    sodium: 59,
    fiber: 0,
    sugar: 0,
    vitaminD: 11,
    calcium: 9,
    iron: 0.3,
    potassium: 363,
  },
  "Sweet Potato": {
    calories: 103,
    protein: 2,
    carbs: 23.6,
    fats: 0.2,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 41,
    fiber: 3.8,
    sugar: 7.4,
    vitaminD: 0,
    calcium: 43,
    iron: 0.7,
    potassium: 438,
  },
  Asparagus: {
    calories: 20,
    protein: 2.2,
    carbs: 3.9,
    fats: 0.2,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 13,
    fiber: 2.1,
    sugar: 1.9,
    vitaminD: 0,
    calcium: 24,
    iron: 2.1,
    potassium: 202,
  },
  Butter: {
    calories: 102,
    protein: 0.1,
    carbs: 0,
    fats: 11.5,
    saturatedFat: 7.3,
    transFat: 0.5,
    cholesterol: 31,
    sodium: 2,
    fiber: 0,
    sugar: 0,
    vitaminD: 0.1,
    calcium: 3,
    iron: 0,
    potassium: 3,
  },
};

export const fetchNutritionInfo = async (
  ingredient: string
): Promise<NutritionInfo> => {
  try {
    // Return stubbed data for testing
    return (
      stubbedNutritionData[ingredient] || {
        calories: Math.floor(Math.random() * 200) + 100,
        protein: Math.floor(Math.random() * 20) + 5,
        carbs: Math.floor(Math.random() * 30) + 10,
        fats: Math.floor(Math.random() * 10) + 2,
        saturatedFat: Math.floor(Math.random() * 5) + 1,
        transFat: Math.floor(Math.random() * 2),
        cholesterol: Math.floor(Math.random() * 50) + 10,
        sodium: Math.floor(Math.random() * 200) + 50,
        fiber: Math.floor(Math.random() * 5) + 1,
        sugar: Math.floor(Math.random() * 10) + 2,
        vitaminD: Math.floor(Math.random() * 10) + 1,
        calcium: Math.floor(Math.random() * 100) + 20,
        iron: Math.floor(Math.random() * 5) + 1,
        potassium: Math.floor(Math.random() * 300) + 100,
      }
    );
  } catch (error) {
    console.error(`Error fetching nutrition for ${ingredient}:`, error);
    // Return mock data as fallback
    return {
      calories: Math.floor(Math.random() * 200) + 100,
      protein: Math.floor(Math.random() * 20) + 5,
      carbs: Math.floor(Math.random() * 30) + 10,
      fats: Math.floor(Math.random() * 10) + 2,
      saturatedFat: Math.floor(Math.random() * 5) + 1,
      transFat: Math.floor(Math.random() * 2),
      cholesterol: Math.floor(Math.random() * 50) + 10,
      sodium: Math.floor(Math.random() * 200) + 50,
      fiber: Math.floor(Math.random() * 5) + 1,
      sugar: Math.floor(Math.random() * 10) + 2,
      vitaminD: Math.floor(Math.random() * 10) + 1,
      calcium: Math.floor(Math.random() * 100) + 20,
      iron: Math.floor(Math.random() * 5) + 1,
      potassium: Math.floor(Math.random() * 300) + 100,
    };
  }
};
