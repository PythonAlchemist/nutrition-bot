import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
  Divider,
} from '@chakra-ui/react';

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

interface MealPlanDisplayProps {
  mealPlan: DayPlan[];
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan }) => {
  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6}>Your Weekly Meal Plan</Heading>
      <VStack spacing={8} align="stretch">
        {mealPlan.map((day, index) => (
          <Box key={index}>
            <Heading size="md" mb={4}>{day.day}</Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
              {day.meals.map((meal, mealIndex) => (
                <GridItem key={mealIndex}>
                  <Box p={4} borderWidth="1px" borderRadius="md">
                    <Heading size="sm" mb={2}>{meal.name}</Heading>
                    <VStack align="start" spacing={2}>
                      <Box>
                        <Text fontWeight="bold">Macros:</Text>
                        <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                          <Text>Calories: {meal.macros.calories}</Text>
                          <Text>Protein: {meal.macros.protein}g</Text>
                          <Text>Carbs: {meal.macros.carbs}g</Text>
                          <Text>Fats: {meal.macros.fats}g</Text>
                        </Grid>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Ingredients:</Text>
                        <VStack align="start" spacing={1}>
                          {meal.ingredients.map((ingredient, i) => (
                            <Text key={i}>• {ingredient}</Text>
                          ))}
                        </VStack>
                      </Box>
                      <Box>
                        <Text fontWeight="bold">Instructions:</Text>
                        <VStack align="start" spacing={1}>
                          {meal.instructions.map((instruction, i) => (
                            <Text key={i}>{i + 1}. {instruction}</Text>
                          ))}
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </GridItem>
              ))}
            </Grid>
            {index < mealPlan.length - 1 && <Divider my={6} />}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default MealPlanDisplay; 