import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  ListIcon,
  HStack,
  Badge,
  useColorModeValue,
  Container,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FaUtensils, FaCheck, FaAppleAlt, FaDrumstickBite, FaBreadSlice, FaFire } from 'react-icons/fa';
import { fetchNutritionInfo } from '../services/nutrition';

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

interface MealPlanDisplayProps {
  mealPlan: MealPlanResponse;
}

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

const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return Math.round(value).toString();
};

const NutritionInfoDisplay: React.FC<{ nutrition: NutritionInfo }> = ({ nutrition }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      bg={bgColor}
      maxW="600px"
      mx="auto"
    >
      <VStack align="stretch" spacing={2}>
        <Heading size="md" textAlign="center" mb={2}>Nutrition Facts</Heading>
        <Divider />
        
        <Box>
          <HStack>
            <Icon as={FaFire} color="brand.500" />
            <Text fontWeight="bold" fontSize="lg">{formatNumber(nutrition.calories)} calories</Text>
          </HStack>
          <Text fontSize="sm" color="gray.500">per serving</Text>
        </Box>
        
        <Divider />
        
        <Box>
          <HStack justify="space-between">
            <Text fontWeight="bold">Total Fat</Text>
            <Text>{formatNumber(nutrition.fats)}g</Text>
          </HStack>
          <Box pl={4}>
            <HStack justify="space-between">
              <Text>Saturated Fat</Text>
              <Text>{formatNumber(nutrition.saturatedFat)}g</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Trans Fat</Text>
              <Text>{formatNumber(nutrition.transFat)}g</Text>
            </HStack>
          </Box>
        </Box>
        
        <Divider />
        
        <HStack justify="space-between">
          <Text fontWeight="bold">Cholesterol</Text>
          <Text>{formatNumber(nutrition.cholesterol)}mg</Text>
        </HStack>
        
        <HStack justify="space-between">
          <Text fontWeight="bold">Sodium</Text>
          <Text>{formatNumber(nutrition.sodium)}mg</Text>
        </HStack>
        
        <Divider />
        
        <Box>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FaBreadSlice} color="brand.500" />
              <Text fontWeight="bold">Total Carbohydrates</Text>
            </HStack>
            <Text>{formatNumber(nutrition.carbs)}g</Text>
          </HStack>
          <Box pl={4}>
            <HStack justify="space-between">
              <Text>Dietary Fiber</Text>
              <Text>{formatNumber(nutrition.fiber)}g</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Total Sugars</Text>
              <Text>{formatNumber(nutrition.sugar)}g</Text>
            </HStack>
          </Box>
        </Box>
        
        <Divider />
        
        <HStack justify="space-between">
          <HStack>
            <Icon as={FaDrumstickBite} color="brand.500" />
            <Text fontWeight="bold">Protein</Text>
          </HStack>
          <Text>{formatNumber(nutrition.protein)}g</Text>
        </HStack>
        
        <Divider />
        
        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <HStack justify="space-between">
              <Text>Vitamin D</Text>
              <Text>{formatNumber(nutrition.vitaminD)}IU</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Calcium</Text>
              <Text>{formatNumber(nutrition.calcium)}mg</Text>
            </HStack>
          </Box>
          <Box>
            <HStack justify="space-between">
              <Text>Iron</Text>
              <Text>{formatNumber(nutrition.iron)}mg</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>Potassium</Text>
              <Text>{formatNumber(nutrition.potassium)}mg</Text>
            </HStack>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

const calculateDailyTotals = (meals: Meal[]) => {
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.macros.calories,
    protein: acc.protein + meal.macros.protein,
    carbs: acc.carbs + meal.macros.carbs,
    fats: acc.fats + meal.macros.fats,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan }) => {
  const [nutritionData, setNutritionData] = useState<{ [key: string]: NutritionInfo }>({});
  const [loadingIngredients, setLoadingIngredients] = useState<{ [key: string]: boolean }>({});
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.600');
  const totalBg = useColorModeValue('gray.100', 'gray.500');

  const calculateMealTotals = (ingredients: string[]): NutritionInfo => {
    return ingredients.reduce((acc, ingredient) => {
      const nutrition = nutritionData[ingredient] || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        saturatedFat: 0,
        transFat: 0,
        cholesterol: 0,
        sodium: 0,
        fiber: 0,
        sugar: 0,
        vitaminD: 0,
        calcium: 0,
        iron: 0,
        potassium: 0,
      };
      return {
        calories: acc.calories + nutrition.calories,
        protein: acc.protein + nutrition.protein,
        carbs: acc.carbs + nutrition.carbs,
        fats: acc.fats + nutrition.fats,
        saturatedFat: acc.saturatedFat + nutrition.saturatedFat,
        transFat: acc.transFat + nutrition.transFat,
        cholesterol: acc.cholesterol + nutrition.cholesterol,
        sodium: acc.sodium + nutrition.sodium,
        fiber: acc.fiber + nutrition.fiber,
        sugar: acc.sugar + nutrition.sugar,
        vitaminD: acc.vitaminD + nutrition.vitaminD,
        calcium: acc.calcium + nutrition.calcium,
        iron: acc.iron + nutrition.iron,
        potassium: acc.potassium + nutrition.potassium,
      };
    }, {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 0,
      fiber: 0,
      sugar: 0,
      vitaminD: 0,
      calcium: 0,
      iron: 0,
      potassium: 0,
    });
  };

  const fetchIngredientNutrition = async (ingredient: string) => {
    if (nutritionData[ingredient] || loadingIngredients[ingredient]) return;

    setLoadingIngredients(prev => ({ ...prev, [ingredient]: true }));
    try {
      const nutrition = await fetchNutritionInfo(ingredient);
      setNutritionData(prev => ({ ...prev, [ingredient]: nutrition }));
    } catch (error) {
      console.error(`Error fetching nutrition for ${ingredient}:`, error);
    } finally {
      setLoadingIngredients(prev => ({ ...prev, [ingredient]: false }));
    }
  };

  if (!mealPlan?.days) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Heading size="xl">No Meal Plan Available</Heading>
          <Text>Please generate a meal plan to see the details.</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl" textAlign="center">Your Meal Plan</Heading>
        
        {mealPlan.days.map((day, dayIndex) => {
          const dailyTotals = calculateDailyTotals(day.meals);
          
          return (
            <Box
              key={dayIndex}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
            >
              <Heading size="lg" mb={4}>
                {day.day}
              </Heading>

              <Table variant="simple" size="sm" mb={6}>
                <Thead>
                  <Tr bg={headerBg}>
                    <Th>Meal</Th>
                    <Th isNumeric>Calories</Th>
                    <Th isNumeric>Protein</Th>
                    <Th isNumeric>Carbs</Th>
                    <Th isNumeric>Fats</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {day.meals.map((meal, index) => (
                    <Tr key={index} _hover={{ bg: 'gray.50' }}>
                      <Td fontWeight="medium">{meal.name}</Td>
                      <Td isNumeric>{meal.macros.calories}</Td>
                      <Td isNumeric>{meal.macros.protein}g</Td>
                      <Td isNumeric>{meal.macros.carbs}g</Td>
                      <Td isNumeric>{meal.macros.fats}g</Td>
                    </Tr>
                  ))}
                  <Tr fontWeight="bold" bg={totalBg}>
                    <Td>Daily Total</Td>
                    <Td isNumeric>{dailyTotals.calories}</Td>
                    <Td isNumeric>{dailyTotals.protein}g</Td>
                    <Td isNumeric>{dailyTotals.carbs}g</Td>
                    <Td isNumeric>{dailyTotals.fats}g</Td>
                  </Tr>
                </Tbody>
              </Table>

              <Accordion allowMultiple>
                {day.meals.map((meal, index) => {
                  const mealKey = `${meal.name}-${meal.ingredients.join(',')}`;
                  const mealTotals = calculateMealTotals(meal.ingredients);
                  
                  return (
                    <AccordionItem key={index} border="none">
                      <AccordionButton
                        bg={bgColor}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        _hover={{ bg: 'gray.50' }}
                      >
                        <Box flex="1" textAlign="left">
                          <HStack>
                            <Icon as={FaUtensils} color="brand.500" />
                            <Heading size="sm">{meal.name}</Heading>
                            <Badge colorScheme="brand">
                              {meal.macros.protein}P / {meal.macros.carbs}C / {meal.macros.fats}F
                            </Badge>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <VStack align="stretch" spacing={4}>
                          <Box>
                            <Text fontWeight="bold" mb={2}>Ingredients:</Text>
                            <Accordion allowMultiple>
                              {meal.ingredients.map((ingredient, ingredientIndex) => (
                                <AccordionItem key={ingredientIndex} border="none">
                                  <AccordionButton
                                    onClick={() => fetchIngredientNutrition(ingredient)}
                                    bg={bgColor}
                                    borderWidth="1px"
                                    borderColor={borderColor}
                                    borderRadius="md"
                                    _hover={{ bg: 'gray.50' }}
                                  >
                                    <Box flex="1" textAlign="left">
                                      <HStack>
                                        <List>
                                          <ListItem>
                                            <ListIcon as={FaCheck} color="brand.500" />
                                            <Text>{ingredient}</Text>
                                          </ListItem>
                                        </List>
                                      </HStack>
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel pb={4}>
                                    {loadingIngredients[ingredient] ? (
                                      <Text fontSize="sm" color="gray.500">Loading nutrition info...</Text>
                                    ) : (
                                      nutritionData[ingredient] && (
                                        <NutritionInfoDisplay nutrition={nutritionData[ingredient]} />
                                      )
                                    )}
                                  </AccordionPanel>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </Box>
                          
                          <Divider my={4} />
                          
                          <Box>
                            <Text fontWeight="bold" mb={2}>Total Meal Nutrition:</Text>
                            <NutritionInfoDisplay nutrition={mealTotals} />
                          </Box>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Box>
          );
        })}
      </VStack>
    </Container>
  );
};

export default MealPlanDisplay; 