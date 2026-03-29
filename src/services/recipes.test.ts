import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

const mockGet = vi.fn();
vi.spyOn(axios, "create").mockReturnValue({
  get: mockGet,
} as unknown as ReturnType<typeof axios.create>);

const { searchRecipes, getRecipeDetail, extractMacros } = await import(
  "./recipes"
);

beforeEach(() => {
  mockGet.mockReset();
});

const SAMPLE_SEARCH_RESPONSE = {
  results: [
    {
      id: 123,
      title: "Grilled Chicken Salad",
      image: "https://example.com/img.jpg",
      imageType: "jpg",
      nutrition: {
        nutrients: [
          { name: "Calories", amount: 350, unit: "kcal" },
          { name: "Protein", amount: 30, unit: "g" },
          { name: "Carbohydrates", amount: 20, unit: "g" },
          { name: "Fat", amount: 15, unit: "g" },
        ],
      },
    },
  ],
  offset: 0,
  number: 10,
  totalResults: 1,
};

const SAMPLE_RECIPE_DETAIL = {
  id: 123,
  title: "Grilled Chicken Salad",
  image: "https://example.com/img.jpg",
  servings: 2,
  readyInMinutes: 30,
  sourceUrl: "https://example.com/recipe",
  summary: "A healthy salad",
  instructions: "1. Grill chicken. 2. Toss salad.",
  extendedIngredients: [
    {
      id: 1,
      name: "chicken breast",
      amount: 200,
      unit: "g",
      original: "200g chicken breast",
    },
  ],
  nutrition: {
    nutrients: [{ name: "Calories", amount: 350, unit: "kcal" }],
  },
  diets: ["gluten free"],
  cuisines: ["American"],
};

describe("searchRecipes", () => {
  it("calls the search endpoint with params", async () => {
    mockGet.mockResolvedValueOnce({ data: SAMPLE_SEARCH_RESPONSE });

    const result = await searchRecipes({ query: "chicken", diet: "keto" });

    expect(mockGet).toHaveBeenCalledWith("/recipes/search", {
      params: { query: "chicken", diet: "keto" },
    });
    expect(result.totalResults).toBe(1);
    expect(result.results[0].title).toBe("Grilled Chicken Salad");
  });

  it("passes macro filter params", async () => {
    mockGet.mockResolvedValueOnce({ data: SAMPLE_SEARCH_RESPONSE });

    await searchRecipes({
      minProtein: 20,
      maxCarbs: 50,
      minCalories: 200,
      maxCalories: 600,
    });

    expect(mockGet).toHaveBeenCalledWith("/recipes/search", {
      params: {
        minProtein: 20,
        maxCarbs: 50,
        minCalories: 200,
        maxCalories: 600,
      },
    });
  });
});

describe("getRecipeDetail", () => {
  it("fetches recipe by id", async () => {
    mockGet.mockResolvedValueOnce({ data: SAMPLE_RECIPE_DETAIL });

    const result = await getRecipeDetail(123);

    expect(mockGet).toHaveBeenCalledWith("/recipes/123");
    expect(result.title).toBe("Grilled Chicken Salad");
    expect(result.extendedIngredients).toHaveLength(1);
    expect(result.servings).toBe(2);
  });
});

describe("extractMacros", () => {
  it("extracts macros from nutrient array", () => {
    const nutrients = [
      { name: "Calories", amount: 350, unit: "kcal" },
      { name: "Protein", amount: 30, unit: "g" },
      { name: "Carbohydrates", amount: 20, unit: "g" },
      { name: "Fat", amount: 15, unit: "g" },
    ];

    const macros = extractMacros(nutrients);

    expect(macros.calories).toBe(350);
    expect(macros.protein).toBe(30);
    expect(macros.carbs).toBe(20);
    expect(macros.fats).toBe(15);
  });

  it("returns 0 for missing nutrients", () => {
    const macros = extractMacros([
      { name: "Calories", amount: 100, unit: "kcal" },
    ]);

    expect(macros.calories).toBe(100);
    expect(macros.protein).toBe(0);
    expect(macros.carbs).toBe(0);
    expect(macros.fats).toBe(0);
  });

  it("handles empty array", () => {
    const macros = extractMacros([]);

    expect(macros.calories).toBe(0);
    expect(macros.protein).toBe(0);
  });
});
