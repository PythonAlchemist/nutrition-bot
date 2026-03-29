import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

// Capture the mock post function when axios.create is called
const mockPost = vi.fn();
vi.spyOn(axios, "create").mockReturnValue({
  post: mockPost,
} as unknown as ReturnType<typeof axios.create>);

// Import after spy is set up — the module calls axios.create() at import time
const { fetchNutritionInfo } = await import("./nutrition");

const SAMPLE_API_RESPONSE = {
  data: {
    foods: [
      {
        food_name: "banana",
        nf_calories: 105,
        nf_protein: 1.3,
        nf_total_carbohydrate: 27,
        nf_total_fat: 0.4,
        nf_saturated_fat: 0.1,
        nf_trans_fatty_acid: 0,
        nf_cholesterol: 0,
        nf_sodium: 1,
        nf_dietary_fiber: 3.1,
        nf_sugars: 14,
        nf_vitamin_d_mcg: 0,
        nf_calcium_mg: 5,
        nf_iron_mg: 0.3,
        nf_potassium: 422,
      },
    ],
  },
};

beforeEach(() => {
  mockPost.mockReset();
});

describe("fetchNutritionInfo", () => {
  it("returns mapped nutrition data from API response", async () => {
    mockPost.mockResolvedValueOnce(SAMPLE_API_RESPONSE);

    const result = await fetchNutritionInfo("1 medium banana");

    expect(mockPost).toHaveBeenCalledWith("/nutrition", {
      query: "1 medium banana",
    });
    expect(result.calories).toBe(105);
    expect(result.protein).toBe(1.3);
    expect(result.carbs).toBe(27);
    expect(result.fats).toBe(0.4);
    expect(result.fiber).toBe(3.1);
    expect(result.potassium).toBe(422);
  });

  it("sums nutrition for multi-food responses", async () => {
    const multiResponse = {
      data: {
        foods: [
          {
            nf_calories: 100,
            nf_protein: 10,
            nf_total_carbohydrate: 20,
            nf_total_fat: 5,
            nf_saturated_fat: 1,
            nf_trans_fatty_acid: 0,
            nf_cholesterol: 10,
            nf_sodium: 50,
            nf_dietary_fiber: 2,
            nf_sugars: 3,
            nf_vitamin_d_mcg: 0,
            nf_calcium_mg: 10,
            nf_iron_mg: 1,
            nf_potassium: 100,
          },
          {
            nf_calories: 200,
            nf_protein: 15,
            nf_total_carbohydrate: 30,
            nf_total_fat: 8,
            nf_saturated_fat: 2,
            nf_trans_fatty_acid: 0,
            nf_cholesterol: 20,
            nf_sodium: 100,
            nf_dietary_fiber: 4,
            nf_sugars: 5,
            nf_vitamin_d_mcg: 1,
            nf_calcium_mg: 20,
            nf_iron_mg: 2,
            nf_potassium: 200,
          },
        ],
      },
    };
    mockPost.mockResolvedValueOnce(multiResponse);

    const result = await fetchNutritionInfo("1 cup rice and beans");

    expect(result.calories).toBe(300);
    expect(result.protein).toBe(25);
    expect(result.carbs).toBe(50);
    expect(result.fats).toBe(13);
  });

  it("returns cached result on second call", async () => {
    mockPost.mockResolvedValueOnce(SAMPLE_API_RESPONSE);

    const first = await fetchNutritionInfo("cached banana ingredient");
    const second = await fetchNutritionInfo("cached banana ingredient");

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(second).toEqual(first);
  });

  it("falls back to stubbed data for known ingredient on API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("Network error"));

    // "Banana" matches a key in stubbedNutritionData
    const result = await fetchNutritionInfo("Banana");

    expect(result.calories).toBe(105);
    expect(result.protein).toBe(1.3);
    expect(result.carbs).toBe(27);
  });

  it("falls back to zeros for unknown ingredient on API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchNutritionInfo("some exotic ingredient xyz");

    expect(result.calories).toBe(0);
    expect(result.protein).toBe(0);
    expect(result.carbs).toBe(0);
    expect(result.fats).toBe(0);
  });

  it("falls back when API returns empty foods array", async () => {
    mockPost.mockResolvedValueOnce({ data: { foods: [] } });

    const result = await fetchNutritionInfo("empty response ingredient");

    expect(result.calories).toBe(0);
  });

  it("handles null nutrition fields gracefully", async () => {
    const nullFieldsResponse = {
      data: {
        foods: [
          {
            nf_calories: 100,
            nf_protein: null,
            nf_total_carbohydrate: null,
            nf_total_fat: 5,
          },
        ],
      },
    };
    mockPost.mockResolvedValueOnce(nullFieldsResponse);

    const result = await fetchNutritionInfo("null fields ingredient");

    expect(result.calories).toBe(100);
    expect(result.protein).toBe(0);
    expect(result.carbs).toBe(0);
    expect(result.fats).toBe(5);
  });
});
