import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  Divider,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';

interface Meal {
  name: string;
  ingredients: string[];
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

interface ShoppingListProps {
  mealPlan: DayPlan[];
}

// Define grocery store sections and their keywords
const grocerySections = {
  'Produce': ['lettuce', 'tomato', 'onion', 'garlic', 'carrot', 'celery', 'bell pepper', 'spinach', 'kale', 'cucumber', 'lemon', 'lime', 'avocado', 'mushroom', 'ginger', 'apple', 'banana', 'orange', 'berry'],
  'Meat & Seafood': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'turkey', 'bacon', 'sausage', 'shrimp', 'egg'],
  'Dairy & Eggs': ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'egg'],
  'Pantry': ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil', 'vinegar', 'sauce', 'spice', 'nut', 'seed', 'bean', 'canned', 'dried'],
  'Frozen': ['frozen'],
  'Bakery': ['bread', 'tortilla', 'wrap', 'bun'],
  'Other': [] // Default section for items that don't match other categories
};

const ShoppingList: React.FC<ShoppingListProps> = ({ mealPlan }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Combine all ingredients and count occurrences
  const ingredientCounts = mealPlan.reduce((acc, day) => {
    day.meals.forEach(meal => {
      meal.ingredients.forEach(ingredient => {
        acc[ingredient] = (acc[ingredient] || 0) + 1;
      });
    });
    return acc;
  }, {} as Record<string, number>);

  // Group ingredients by section
  const groupedIngredients = Object.entries(ingredientCounts).reduce((acc, [ingredient, count]) => {
    let section = 'Other';
    for (const [sectionName, keywords] of Object.entries(grocerySections)) {
      if (keywords.some(keyword => ingredient.toLowerCase().includes(keyword))) {
        section = sectionName;
        break;
      }
    }
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push({ ingredient, count });
    return acc;
  }, {} as Record<string, { ingredient: string; count: number }[]>);

  // Sort ingredients within each section
  Object.keys(groupedIngredients).forEach(section => {
    groupedIngredients[section].sort((a, b) => a.ingredient.localeCompare(b.ingredient));
  });

  return (
    <Box bg={bgColor} p={8} borderRadius="xl" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Shopping List</Heading>
          <Text color="gray.600">
            Here's a combined list of all ingredients needed for your meal plan.
          </Text>
        </Box>
        <Divider />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {Object.entries(groupedIngredients).map(([section, ingredients]) => (
            <Box key={section}>
              <Heading size="md" mb={3} color="brand.600">{section}</Heading>
              <List spacing={2}>
                {ingredients.map(({ ingredient, count }) => (
                  <ListItem 
                    key={ingredient}
                    display="flex"
                    alignItems="center"
                    p={1}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50' }}
                  >
                    <Text fontSize="sm">
                      {ingredient}
                      {count > 1 && (
                        <Text as="span" color="gray.500" ml={1}>
                          (×{count})
                        </Text>
                      )}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ShoppingList; 