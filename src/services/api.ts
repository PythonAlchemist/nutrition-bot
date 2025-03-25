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
        name: "Greek Yogurt Breakfast Bowl",
        ingredients: [
          "2 cups Greek yogurt",
          "1 cup mixed berries",
          "1/4 cup honey granola",
          "1 tbsp honey",
          "1 tbsp chia seeds",
        ],
        instructions: [
          "Layer Greek yogurt in a bowl",
          "Top with mixed berries",
          "Sprinkle granola and chia seeds",
          "Drizzle with honey",
        ],
        macros: {
          calories: 450,
          protein: 28,
          carbs: 65,
          fats: 12,
        },
      },
      {
        name: "Grilled Chicken Quinoa Bowl",
        ingredients: [
          "6 oz chicken breast",
          "1 cup cooked quinoa",
          "2 cups mixed vegetables",
          "1 tbsp olive oil",
          "Herbs and spices",
        ],
        instructions: [
          "Grill seasoned chicken breast",
          "Cook quinoa according to package",
          "Sauté vegetables in olive oil",
          "Combine in bowl and season",
        ],
        macros: {
          calories: 850,
          protein: 52,
          carbs: 85,
          fats: 28,
        },
      },
      {
        name: "Salmon with Sweet Potato",
        ingredients: [
          "6 oz salmon fillet",
          "1 large sweet potato",
          "2 cups broccoli",
          "2 tbsp olive oil",
          "Lemon and herbs",
        ],
        instructions: [
          "Bake salmon with lemon and herbs",
          "Roast sweet potato wedges",
          "Steam broccoli",
          "Serve with olive oil drizzle",
        ],
        macros: {
          calories: 700,
          protein: 45,
          carbs: 55,
          fats: 35,
        },
      },
    ],
  },
  {
    day: "Tuesday",
    meals: [
      {
        name: "Protein Smoothie Bowl",
        ingredients: [
          "2 scoops vanilla protein powder",
          "1 banana",
          "1 cup almond milk",
          "1/2 cup oats",
          "1 tbsp peanut butter",
        ],
        instructions: [
          "Blend protein, banana, and almond milk",
          "Add oats and blend until smooth",
          "Top with sliced banana and peanut butter",
        ],
        macros: {
          calories: 480,
          protein: 35,
          carbs: 55,
          fats: 14,
        },
      },
      {
        name: "Turkey Avocado Wrap",
        ingredients: [
          "2 whole wheat wraps",
          "6 oz turkey breast",
          "1 avocado",
          "Mixed greens",
          "2 tbsp hummus",
        ],
        instructions: [
          "Spread hummus on wraps",
          "Layer turkey, avocado, and greens",
          "Roll up and slice",
        ],
        macros: {
          calories: 720,
          protein: 48,
          carbs: 65,
          fats: 32,
        },
      },
      {
        name: "Stir-Fried Tofu with Rice",
        ingredients: [
          "8 oz firm tofu",
          "1 cup brown rice",
          "2 cups mixed vegetables",
          "2 tbsp soy sauce",
          "1 tbsp sesame oil",
        ],
        instructions: [
          "Press and cube tofu",
          "Cook rice according to package",
          "Stir-fry vegetables and tofu",
          "Combine with sauce",
        ],
        macros: {
          calories: 800,
          protein: 35,
          carbs: 95,
          fats: 28,
        },
      },
    ],
  },
  {
    day: "Wednesday",
    meals: [
      {
        name: "Overnight Oats",
        ingredients: [
          "1 cup rolled oats",
          "1 scoop protein powder",
          "1 cup milk",
          "1 apple, diced",
          "2 tbsp almonds",
        ],
        instructions: [
          "Mix oats, protein powder, and milk",
          "Refrigerate overnight",
          "Top with apple and almonds",
        ],
        macros: {
          calories: 460,
          protein: 32,
          carbs: 58,
          fats: 15,
        },
      },
      {
        name: "Mediterranean Bowl",
        ingredients: [
          "1 cup chickpeas",
          "2 cups quinoa",
          "1 cup cherry tomatoes",
          "1/2 cup feta cheese",
          "2 tbsp olive oil",
        ],
        instructions: [
          "Cook quinoa",
          "Combine with chickpeas and vegetables",
          "Top with feta and olive oil",
        ],
        macros: {
          calories: 750,
          protein: 38,
          carbs: 88,
          fats: 30,
        },
      },
      {
        name: "Lean Beef Stir-Fry",
        ingredients: [
          "6 oz lean beef strips",
          "2 cups mixed vegetables",
          "1 cup brown rice",
          "2 tbsp teriyaki sauce",
          "1 tbsp sesame oil",
        ],
        instructions: [
          "Cook rice",
          "Stir-fry beef and vegetables",
          "Add sauce and combine",
        ],
        macros: {
          calories: 790,
          protein: 45,
          carbs: 85,
          fats: 32,
        },
      },
    ],
  },
  {
    day: "Thursday",
    meals: [
      {
        name: "Protein Pancakes",
        ingredients: [
          "1 cup protein pancake mix",
          "1 banana",
          "2 eggs",
          "1/4 cup maple syrup",
          "1 tbsp butter",
        ],
        instructions: [
          "Mix pancake batter",
          "Cook on griddle",
          "Top with banana and syrup",
        ],
        macros: {
          calories: 520,
          protein: 35,
          carbs: 68,
          fats: 16,
        },
      },
      {
        name: "Tuna Salad Sandwich",
        ingredients: [
          "2 cans tuna",
          "2 slices whole grain bread",
          "1 avocado",
          "Mixed greens",
          "1 tbsp mayo",
        ],
        instructions: [
          "Mix tuna with mayo",
          "Toast bread",
          "Assemble sandwich with avocado and greens",
        ],
        macros: {
          calories: 680,
          protein: 48,
          carbs: 45,
          fats: 38,
        },
      },
      {
        name: "Chicken Pasta",
        ingredients: [
          "6 oz chicken breast",
          "2 cups whole wheat pasta",
          "1 cup marinara sauce",
          "1/4 cup parmesan",
          "1 tbsp olive oil",
        ],
        instructions: [
          "Cook pasta",
          "Grill chicken",
          "Combine with sauce and cheese",
        ],
        macros: {
          calories: 800,
          protein: 52,
          carbs: 92,
          fats: 25,
        },
      },
    ],
  },
  {
    day: "Friday",
    meals: [
      {
        name: "Egg White Omelette",
        ingredients: [
          "6 egg whites",
          "1 cup spinach",
          "1/4 cup cheese",
          "2 slices toast",
          "1 tbsp butter",
        ],
        instructions: [
          "Whisk egg whites",
          "Cook with spinach and cheese",
          "Serve with toast",
        ],
        macros: {
          calories: 420,
          protein: 38,
          carbs: 35,
          fats: 18,
        },
      },
      {
        name: "Shrimp Rice Bowl",
        ingredients: [
          "8 oz shrimp",
          "1.5 cups brown rice",
          "2 cups vegetables",
          "2 tbsp soy sauce",
          "1 tbsp oil",
        ],
        instructions: [
          "Cook rice",
          "Sauté shrimp and vegetables",
          "Combine with sauce",
        ],
        macros: {
          calories: 680,
          protein: 45,
          carbs: 82,
          fats: 22,
        },
      },
      {
        name: "Turkey Meatballs",
        ingredients: [
          "8 oz ground turkey",
          "1 cup quinoa",
          "2 cups vegetables",
          "1/4 cup marinara",
          "2 tbsp olive oil",
        ],
        instructions: [
          "Form and cook meatballs",
          "Prepare quinoa",
          "Serve with sauce and vegetables",
        ],
        macros: {
          calories: 900,
          protein: 58,
          carbs: 75,
          fats: 42,
        },
      },
    ],
  },
  {
    day: "Saturday",
    meals: [
      {
        name: "Breakfast Burrito",
        ingredients: [
          "3 eggs",
          "1 whole wheat tortilla",
          "1/4 cup cheese",
          "1/2 avocado",
          "Salsa",
        ],
        instructions: [
          "Scramble eggs",
          "Warm tortilla",
          "Assemble with toppings",
        ],
        macros: {
          calories: 550,
          protein: 32,
          carbs: 42,
          fats: 32,
        },
      },
      {
        name: "Chicken Caesar Wrap",
        ingredients: [
          "6 oz chicken breast",
          "2 large tortillas",
          "2 cups romaine",
          "2 tbsp caesar dressing",
          "1/4 cup parmesan",
        ],
        instructions: [
          "Grill chicken",
          "Assemble wraps",
          "Add dressing and cheese",
        ],
        macros: {
          calories: 720,
          protein: 55,
          carbs: 65,
          fats: 28,
        },
      },
      {
        name: "Baked Cod",
        ingredients: [
          "8 oz cod fillet",
          "2 cups vegetables",
          "1 cup quinoa",
          "2 tbsp olive oil",
          "Lemon and herbs",
        ],
        instructions: [
          "Bake cod with seasonings",
          "Cook quinoa",
          "Roast vegetables",
        ],
        macros: {
          calories: 730,
          protein: 48,
          carbs: 72,
          fats: 28,
        },
      },
    ],
  },
  {
    day: "Sunday",
    meals: [
      {
        name: "Cottage Cheese Bowl",
        ingredients: [
          "2 cups cottage cheese",
          "1 cup mixed berries",
          "2 tbsp honey",
          "1/4 cup granola",
          "1 tbsp nuts",
        ],
        instructions: [
          "Layer cottage cheese",
          "Top with berries and granola",
          "Drizzle honey",
        ],
        macros: {
          calories: 480,
          protein: 42,
          carbs: 52,
          fats: 15,
        },
      },
      {
        name: "Black Bean Bowl",
        ingredients: [
          "2 cups black beans",
          "1 cup rice",
          "1 avocado",
          "Salsa",
          "2 tbsp olive oil",
        ],
        instructions: ["Cook rice", "Heat beans", "Assemble with toppings"],
        macros: {
          calories: 750,
          protein: 32,
          carbs: 95,
          fats: 28,
        },
      },
      {
        name: "Pork Tenderloin",
        ingredients: [
          "6 oz pork tenderloin",
          "1 sweet potato",
          "2 cups green beans",
          "2 tbsp olive oil",
          "Herbs and spices",
        ],
        instructions: [
          "Roast pork with seasonings",
          "Bake sweet potato",
          "Steam green beans",
        ],
        macros: {
          calories: 770,
          protein: 48,
          carbs: 65,
          fats: 35,
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
