import axios from "axios";

const OLLAMA_API_URL =
  import.meta.env.VITE_OLLAMA_API_URL || "http://localhost:11434";

interface Response {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface MacroInput {
  protein: number;
  carbs: number;
  fats: number;
  days: number;
}

interface Meal {
  name: string;
  ingredients: string[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

interface MealPlanResponse {
  days: DayPlan[];
}

// Stubbed response for testing
const stubbedResponse: MealPlanResponse = {
  days: [
    {
      day: "Monday",
      meals: [
        {
          name: "Breakfast",
          ingredients: ["Oatmeal", "Banana", "Almonds", "Honey"],
          macros: {
            protein: 12,
            carbs: 45,
            fats: 8,
            calories: 300,
          },
        },
        {
          name: "Lunch",
          ingredients: [
            "Grilled Chicken Breast",
            "Brown Rice",
            "Broccoli",
            "Olive Oil",
          ],
          macros: {
            protein: 35,
            carbs: 55,
            fats: 15,
            calories: 500,
          },
        },
        {
          name: "Dinner",
          ingredients: ["Salmon", "Sweet Potato", "Asparagus", "Butter"],
          macros: {
            protein: 40,
            carbs: 40,
            fats: 20,
            calories: 550,
          },
        },
      ],
    },
    {
      day: "Tuesday",
      meals: [
        {
          name: "Breakfast",
          ingredients: ["Greek Yogurt", "Granola", "Blueberries", "Chia Seeds"],
          macros: {
            protein: 20,
            carbs: 40,
            fats: 10,
            calories: 350,
          },
        },
        {
          name: "Lunch",
          ingredients: ["Turkey Wrap", "Mixed Greens", "Avocado", "Tomato"],
          macros: {
            protein: 30,
            carbs: 45,
            fats: 12,
            calories: 450,
          },
        },
        {
          name: "Dinner",
          ingredients: [
            "Beef Stir Fry",
            "Brown Rice",
            "Mixed Vegetables",
            "Sesame Oil",
          ],
          macros: {
            protein: 35,
            carbs: 50,
            fats: 18,
            calories: 520,
          },
        },
      ],
    },
    {
      day: "Wednesday",
      meals: [
        {
          name: "Breakfast",
          ingredients: [
            "Protein Smoothie",
            "Spinach",
            "Banana",
            "Peanut Butter",
          ],
          macros: {
            protein: 25,
            carbs: 35,
            fats: 12,
            calories: 380,
          },
        },
        {
          name: "Lunch",
          ingredients: [
            "Tuna Salad",
            "Whole Grain Bread",
            "Mixed Greens",
            "Olive Oil",
          ],
          macros: {
            protein: 30,
            carbs: 40,
            fats: 15,
            calories: 450,
          },
        },
        {
          name: "Dinner",
          ingredients: [
            "Pork Tenderloin",
            "Quinoa",
            "Roasted Vegetables",
            "Olive Oil",
          ],
          macros: {
            protein: 40,
            carbs: 45,
            fats: 16,
            calories: 530,
          },
        },
      ],
    },
    {
      day: "Thursday",
      meals: [
        {
          name: "Breakfast",
          ingredients: ["Eggs", "Whole Grain Toast", "Avocado", "Spinach"],
          macros: {
            protein: 22,
            carbs: 30,
            fats: 14,
            calories: 340,
          },
        },
        {
          name: "Lunch",
          ingredients: [
            "Grilled Shrimp",
            "Couscous",
            "Mixed Vegetables",
            "Lemon Butter Sauce",
          ],
          macros: {
            protein: 28,
            carbs: 42,
            fats: 12,
            calories: 420,
          },
        },
        {
          name: "Dinner",
          ingredients: [
            "Baked Cod",
            "Wild Rice",
            "Steamed Broccoli",
            "Olive Oil",
          ],
          macros: {
            protein: 32,
            carbs: 38,
            fats: 14,
            calories: 460,
          },
        },
      ],
    },
    {
      day: "Friday",
      meals: [
        {
          name: "Breakfast",
          ingredients: [
            "Protein Pancakes",
            "Maple Syrup",
            "Mixed Berries",
            "Greek Yogurt",
          ],
          macros: {
            protein: 24,
            carbs: 48,
            fats: 8,
            calories: 360,
          },
        },
        {
          name: "Lunch",
          ingredients: [
            "Grilled Chicken Caesar Salad",
            "Whole Grain Croutons",
            "Parmesan Cheese",
            "Caesar Dressing",
          ],
          macros: {
            protein: 34,
            carbs: 32,
            fats: 16,
            calories: 440,
          },
        },
        {
          name: "Dinner",
          ingredients: [
            "Grilled Steak",
            "Mashed Sweet Potato",
            "Green Beans",
            "Garlic Butter",
          ],
          macros: {
            protein: 42,
            carbs: 36,
            fats: 22,
            calories: 540,
          },
        },
      ],
    },
    {
      day: "Saturday",
      meals: [
        {
          name: "Breakfast",
          ingredients: [
            "Breakfast Burrito",
            "Black Beans",
            "Salsa",
            "Sour Cream",
          ],
          macros: {
            protein: 26,
            carbs: 42,
            fats: 16,
            calories: 400,
          },
        },
        {
          name: "Lunch",
          ingredients: [
            "Mediterranean Bowl",
            "Quinoa",
            "Feta Cheese",
            "Olive Oil",
          ],
          macros: {
            protein: 20,
            carbs: 46,
            fats: 18,
            calories: 440,
          },
        },
        {
          name: "Dinner",
          ingredients: [
            "Grilled Lamb Chops",
            "Roasted Potatoes",
            "Asparagus",
            "Mint Sauce",
          ],
          macros: {
            protein: 36,
            carbs: 34,
            fats: 24,
            calories: 520,
          },
        },
      ],
    },
    {
      day: "Sunday",
      meals: [
        {
          name: "Breakfast",
          ingredients: ["French Toast", "Bacon", "Maple Syrup", "Fresh Fruit"],
          macros: {
            protein: 18,
            carbs: 52,
            fats: 14,
            calories: 380,
          },
        },
        {
          name: "Lunch",
          ingredients: [
            "Grilled Chicken Pasta",
            "Whole Grain Pasta",
            "Pesto Sauce",
            "Pine Nuts",
          ],
          macros: {
            protein: 32,
            carbs: 58,
            fats: 16,
            calories: 480,
          },
        },
        {
          name: "Dinner",
          ingredients: [
            "Baked Chicken",
            "Brown Rice",
            "Steamed Vegetables",
            "Teriyaki Sauce",
          ],
          macros: {
            protein: 38,
            carbs: 44,
            fats: 12,
            calories: 460,
          },
        },
      ],
    },
  ],
};

export const generateMealPlan = async (
  input: MacroInput
): Promise<MealPlanResponse> => {
  try {
    // Return stubbed response for testing
    return stubbedResponse;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};
