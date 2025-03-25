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
  recipeName: string;
  ingredients: string[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  };
  description: string;
  instructions: string;
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
          recipeName: "Banana Almond Oatmeal Bowl",
          ingredients: [
            "1 cup Oatmeal",
            "1 medium Banana",
            "2 tbsp Almonds",
            "1 tbsp Honey",
          ],
          macros: {
            protein: 12,
            carbs: 45,
            fats: 8,
            calories: 300,
          },
          description:
            "A hearty and nutritious breakfast bowl with natural sweetness",
          instructions:
            "1. Cook oatmeal according to package instructions\n2. Slice banana\n3. Top with almonds and honey\n4. Stir well and serve hot",
        },
        {
          name: "Lunch",
          recipeName: "Grilled Chicken Rice Bowl",
          ingredients: [
            "6 oz Grilled Chicken Breast",
            "1 cup Brown Rice",
            "1 cup Broccoli",
            "1 tbsp Olive Oil",
          ],
          macros: {
            protein: 35,
            carbs: 55,
            fats: 15,
            calories: 500,
          },
          description: "A balanced lunch with lean protein and whole grains",
          instructions:
            "1. Season chicken with salt and pepper\n2. Grill chicken until cooked through\n3. Cook brown rice according to package instructions\n4. Steam broccoli until tender\n5. Drizzle with olive oil and serve",
        },
        {
          name: "Dinner",
          recipeName: "Baked Salmon with Sweet Potato",
          ingredients: [
            "6 oz Salmon",
            "1 medium Sweet Potato",
            "1 cup Asparagus",
            "1 tbsp Butter",
          ],
          macros: {
            protein: 40,
            carbs: 40,
            fats: 20,
            calories: 550,
          },
          description: "A healthy dinner rich in omega-3 fatty acids",
          instructions:
            "1. Preheat oven to 400°F\n2. Season salmon with salt and pepper\n3. Bake salmon for 12-15 minutes\n4. Microwave sweet potato until tender\n5. Steam asparagus until crisp-tender\n6. Top sweet potato with butter and serve",
        },
      ],
    },
    {
      day: "Tuesday",
      meals: [
        {
          name: "Breakfast",
          recipeName: "Greek Yogurt Berry Parfait",
          ingredients: [
            "1 cup Greek Yogurt",
            "1/2 cup Granola",
            "1/2 cup Blueberries",
            "1 tbsp Chia Seeds",
          ],
          macros: {
            protein: 20,
            carbs: 40,
            fats: 10,
            calories: 350,
          },
          description: "A protein-rich breakfast parfait with fresh berries",
          instructions:
            "1. Layer half of the Greek yogurt in a glass\n2. Add a layer of granola\n3. Add blueberries\n4. Top with remaining yogurt\n5. Sprinkle chia seeds on top",
        },
        {
          name: "Lunch",
          recipeName: "Turkey Avocado Wrap",
          ingredients: [
            "4 oz Turkey Breast",
            "1 whole wheat wrap",
            "2 cups Mixed Greens",
            "1/4 Avocado",
            "1 medium Tomato",
          ],
          macros: {
            protein: 30,
            carbs: 45,
            fats: 12,
            calories: 450,
          },
          description: "A fresh and satisfying wrap with lean protein",
          instructions:
            "1. Slice turkey breast thinly\n2. Chop tomato and avocado\n3. Lay wrap flat and add mixed greens\n4. Add turkey, tomato, and avocado\n5. Roll wrap tightly and serve",
        },
        {
          name: "Dinner",
          recipeName: "Beef Stir-Fry Bowl",
          ingredients: [
            "6 oz Beef Strips",
            "1 cup Brown Rice",
            "2 cups Mixed Vegetables",
            "2 tbsp Sesame Oil",
          ],
          macros: {
            protein: 35,
            carbs: 50,
            fats: 18,
            calories: 520,
          },
          description: "A quick and healthy stir-fry dinner",
          instructions:
            "1. Cook brown rice according to package instructions\n2. Heat sesame oil in a wok\n3. Stir-fry beef until browned\n4. Add mixed vegetables and stir-fry until tender\n5. Serve over brown rice",
        },
      ],
    },
    {
      day: "Wednesday",
      meals: [
        {
          name: "Breakfast",
          recipeName: "Green Protein Smoothie Bowl",
          ingredients: [
            "1 scoop Protein Powder",
            "1 cup Spinach",
            "1 medium Banana",
            "2 tbsp Peanut Butter",
            "1 cup Almond Milk",
          ],
          macros: {
            protein: 25,
            carbs: 35,
            fats: 12,
            calories: 380,
          },
          description: "A nutrient-packed protein smoothie",
          instructions:
            "1. Blend spinach and almond milk until smooth\n2. Add banana and peanut butter\n3. Add protein powder\n4. Blend until creamy and serve",
        },
        {
          name: "Lunch",
          recipeName: "Tuna Salad Sandwich",
          ingredients: [
            "1 can Tuna",
            "2 slices Whole Grain Bread",
            "2 cups Mixed Greens",
            "2 tbsp Olive Oil",
          ],
          macros: {
            protein: 30,
            carbs: 40,
            fats: 15,
            calories: 450,
          },
          description: "A classic tuna salad sandwich with fresh greens",
          instructions:
            "1. Drain tuna and mix with olive oil\n2. Toast bread\n3. Layer mixed greens on bread\n4. Add tuna mixture\n5. Close sandwich and serve",
        },
        {
          name: "Dinner",
          recipeName: "Pork Tenderloin with Quinoa",
          ingredients: [
            "6 oz Pork Tenderloin",
            "1 cup Quinoa",
            "2 cups Roasted Vegetables",
            "2 tbsp Olive Oil",
          ],
          macros: {
            protein: 40,
            carbs: 45,
            fats: 16,
            calories: 530,
          },
          description:
            "A lean protein dinner with quinoa and roasted vegetables",
          instructions:
            "1. Season pork tenderloin with salt and pepper\n2. Roast in oven at 400°F for 25-30 minutes\n3. Cook quinoa according to package instructions\n4. Roast vegetables with olive oil\n5. Slice pork and serve with quinoa and vegetables",
        },
      ],
    },
    {
      day: "Thursday",
      meals: [
        {
          name: "Breakfast",
          recipeName: "Cottage Cheese Bowl",
          ingredients: [
            "1 cup Cottage Cheese",
            "1 medium Peach",
            "2 tbsp Walnuts",
            "1 tbsp Honey",
          ],
          macros: {
            protein: 24,
            carbs: 35,
            fats: 10,
            calories: 360,
          },
          description: "A creamy breakfast bowl with fresh fruit",
          instructions:
            "1. Slice peach\n2. Chop walnuts\n3. Layer cottage cheese in a bowl\n4. Top with peach, walnuts, and honey\n5. Serve immediately",
        },
        {
          name: "Lunch",
          recipeName: "Tofu Stir-Fry Bowl",
          ingredients: [
            "4 oz Tofu",
            "1 cup Brown Rice",
            "2 cups Stir-Fry Vegetables",
            "2 tbsp Soy Sauce",
          ],
          macros: {
            protein: 18,
            carbs: 45,
            fats: 8,
            calories: 340,
          },
          description: "A vegetarian stir-fry with plant-based protein",
          instructions:
            "1. Press and cube tofu\n2. Cook brown rice\n3. Stir-fry vegetables\n4. Add tofu and soy sauce\n5. Combine and serve",
        },
        {
          name: "Dinner",
          recipeName: "Lemon Herb Cod",
          ingredients: [
            "6 oz Cod",
            "1 cup Quinoa",
            "2 cups Green Beans",
            "2 tbsp Lemon Herb Sauce",
          ],
          macros: {
            protein: 30,
            carbs: 42,
            fats: 14,
            calories: 440,
          },
          description: "A light and healthy fish dinner",
          instructions:
            "1. Season cod with herbs\n2. Bake at 375°F for 15-20 minutes\n3. Cook quinoa\n4. Steam green beans\n5. Prepare sauce and serve",
        },
      ],
    },
    {
      day: "Friday",
      meals: [
        {
          name: "Breakfast",
          recipeName: "Green Protein Smoothie Bowl",
          ingredients: [
            "1 scoop Protein Powder",
            "1 cup Spinach",
            "1 medium Banana",
            "2 tbsp Peanut Butter",
            "1 cup Almond Milk",
          ],
          macros: {
            protein: 25,
            carbs: 35,
            fats: 12,
            calories: 380,
          },
          description: "A nutrient-packed protein smoothie",
          instructions:
            "1. Blend spinach and almond milk until smooth\n2. Add banana and peanut butter\n3. Add protein powder\n4. Blend until creamy and serve",
        },
        {
          name: "Lunch",
          recipeName: "Tuna Salad Sandwich",
          ingredients: [
            "1 can Tuna",
            "2 slices Whole Grain Bread",
            "2 cups Mixed Greens",
            "2 tbsp Olive Oil",
          ],
          macros: {
            protein: 30,
            carbs: 40,
            fats: 15,
            calories: 450,
          },
          description: "A classic tuna salad sandwich with fresh greens",
          instructions:
            "1. Drain tuna and mix with olive oil\n2. Toast bread\n3. Layer mixed greens on bread\n4. Add tuna mixture\n5. Close sandwich and serve",
        },
        {
          name: "Dinner",
          recipeName: "Pork Tenderloin with Quinoa",
          ingredients: [
            "6 oz Pork Tenderloin",
            "1 cup Quinoa",
            "2 cups Roasted Vegetables",
            "2 tbsp Olive Oil",
          ],
          macros: {
            protein: 40,
            carbs: 45,
            fats: 16,
            calories: 530,
          },
          description:
            "A lean protein dinner with quinoa and roasted vegetables",
          instructions:
            "1. Season pork tenderloin with salt and pepper\n2. Roast in oven at 400°F for 25-30 minutes\n3. Cook quinoa according to package instructions\n4. Roast vegetables with olive oil\n5. Slice pork and serve with quinoa and vegetables",
        },
      ],
    },
    {
      day: "Saturday",
      meals: [
        {
          name: "Breakfast",
          recipeName: "Apple Cinnamon Oatmeal",
          ingredients: [
            "2 whole Eggs",
            "1 cup Oatmeal",
            "1 medium Apple",
            "1 tbsp Cinnamon",
          ],
          macros: {
            protein: 16,
            carbs: 40,
            fats: 8,
            calories: 320,
          },
          description: "A warm and comforting breakfast bowl",
          instructions:
            "1. Cook oatmeal\n2. Boil eggs\n3. Slice apple\n4. Sprinkle cinnamon\n5. Combine and serve",
        },
        {
          name: "Lunch",
          recipeName: "Mediterranean Turkey Wrap",
          ingredients: [
            "4 oz Turkey Breast",
            "1 whole wheat wrap",
            "2 cups Mixed Greens",
            "2 tbsp Hummus",
          ],
          macros: {
            protein: 26,
            carbs: 38,
            fats: 10,
            calories: 360,
          },
          description: "A protein-rich wrap with Mediterranean flavors",
          instructions:
            "1. Slice turkey breast\n2. Spread hummus on wrap\n3. Add mixed greens\n4. Add turkey\n5. Roll and serve",
        },
        {
          name: "Dinner",
          recipeName: "Grilled Lamb Chops",
          ingredients: [
            "6 oz Lamb Chops",
            "1 cup Brown Rice",
            "2 cups Roasted Vegetables",
            "2 tbsp Mint Sauce",
          ],
          macros: {
            protein: 34,
            carbs: 45,
            fats: 18,
            calories: 500,
          },
          description: "A flavorful dinner with lean lamb",
          instructions:
            "1. Season lamb chops\n2. Grill to medium-rare\n3. Cook brown rice\n4. Roast vegetables\n5. Prepare mint sauce and serve",
        },
      ],
    },
    {
      day: "Sunday",
      meals: [
        {
          name: "Breakfast",
          recipeName: "Berry Yogurt Parfait",
          ingredients: [
            "1 cup Greek Yogurt",
            "1/2 cup Granola",
            "1/2 cup Mixed Berries",
            "1 tbsp Honey",
          ],
          macros: {
            protein: 20,
            carbs: 38,
            fats: 8,
            calories: 340,
          },
          description: "A refreshing breakfast parfait",
          instructions:
            "1. Layer yogurt in a glass\n2. Add granola layer\n3. Add mixed berries\n4. Drizzle honey\n5. Serve immediately",
        },
        {
          name: "Lunch",
          recipeName: "Teriyaki Chicken Bowl",
          ingredients: [
            "4 oz Chicken Breast",
            "1 cup Brown Rice",
            "2 cups Mixed Vegetables",
            "2 tbsp Teriyaki Sauce",
          ],
          macros: {
            protein: 28,
            carbs: 42,
            fats: 10,
            calories: 400,
          },
          description: "An Asian-inspired lunch bowl",
          instructions:
            "1. Cook brown rice\n2. Grill chicken breast\n3. Steam mixed vegetables\n4. Prepare teriyaki sauce\n5. Combine and serve",
        },
        {
          name: "Dinner",
          recipeName: "Dill Salmon with Wild Rice",
          ingredients: [
            "6 oz Salmon",
            "1 cup Wild Rice",
            "2 cups Asparagus",
            "2 tbsp Dill Sauce",
          ],
          macros: {
            protein: 36,
            carbs: 40,
            fats: 16,
            calories: 460,
          },
          description: "A healthy dinner with omega-3 rich salmon",
          instructions:
            "1. Season salmon\n2. Bake at 400°F for 12-15 minutes\n3. Cook wild rice\n4. Steam asparagus\n5. Prepare dill sauce and serve",
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
