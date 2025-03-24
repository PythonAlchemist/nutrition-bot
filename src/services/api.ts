import axios from "axios";

interface MacroInput {
  protein: number;
  carbs: number;
  fats: number;
  preferences: string;
}

interface Meal {
  name: string;
  ingredients: string[];
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Mock data for development
const mockMealPlan: DayPlan[] = [
  {
    day: "Monday",
    meals: [
      {
        name: "Breakfast Bowl",
        ingredients: [
          "1 cup oats",
          "1 banana",
          "1 tbsp honey",
          "1 cup almond milk",
          "1 tbsp chia seeds",
        ],
        instructions: [
          "Cook oats with almond milk",
          "Top with sliced banana",
          "Drizzle honey and sprinkle chia seeds",
        ],
        macros: {
          calories: 450,
          protein: 12,
          carbs: 65,
          fats: 15,
        },
      },
      {
        name: "Grilled Chicken Salad",
        ingredients: [
          "200g chicken breast",
          "Mixed greens",
          "Cherry tomatoes",
          "Cucumber",
          "Olive oil",
          "Balsamic vinegar",
        ],
        instructions: [
          "Grill chicken breast",
          "Chop vegetables",
          "Mix with greens",
          "Dress with olive oil and balsamic",
        ],
        macros: {
          calories: 550,
          protein: 45,
          carbs: 25,
          fats: 35,
        },
      },
    ],
  },
  {
    day: "Tuesday",
    meals: [
      {
        name: "Protein Smoothie",
        ingredients: [
          "1 scoop protein powder",
          "1 banana",
          "1 cup spinach",
          "1 cup almond milk",
          "1 tbsp peanut butter",
        ],
        instructions: ["Blend all ingredients", "Serve immediately"],
        macros: {
          calories: 400,
          protein: 35,
          carbs: 45,
          fats: 15,
        },
      },
    ],
  },
];

export const generateMealPlan = async (
  input: MacroInput
): Promise<DayPlan[]> => {
  // For development, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMealPlan);
    }, 1000); // Simulate API delay
  });
};
