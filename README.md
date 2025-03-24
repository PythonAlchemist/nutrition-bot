# Weekly Meal Planner

A React application that generates personalized weekly meal plans based on your macro nutrients, dietary restrictions, and cuisine preferences.

## Features

- Input daily macro nutrient targets (calories, protein, carbs, fats)
- Specify number of meals per day
- Select dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- Choose cuisine preferences
- View detailed meal plans with ingredients and instructions
- Track macro nutrients for each meal

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nutrition-bot.git
cd nutrition-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API URL:
```
VITE_API_URL=http://localhost:3001
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `dist` directory.

## API Integration

This application requires a backend API to generate meal plans. The API should:

1. Accept POST requests to `/api/generate-meal-plan`
2. Process the following input:
   - dailyCalories
   - protein (g)
   - carbs (g)
   - fats (g)
   - mealsPerDay
   - dietaryRestrictions
   - cuisinePreferences
3. Return a weekly meal plan in the following format:
```typescript
interface DayPlan {
  day: string;
  meals: {
    name: string;
    ingredients: string[];
    instructions: string[];
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    };
  }[];
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 