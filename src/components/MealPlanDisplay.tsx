import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  useColorModeValue,
  Container,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Icon,
  UnorderedList,
  ListItem,
  Spinner,
  List,
  ListIcon,
} from '@chakra-ui/react';
import { FaUtensils, FaFire, FaBreadSlice, FaDrumstickBite, FaCheck } from 'react-icons/fa';
import { fetchNutritionInfo } from '../services/nutrition';

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

interface MealPlanDisplayProps {
  mealPlan: MealPlanResponse;
}

const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return Math.round(value).toString();
};

const NutritionInfoDisplay: React.FC<{ nutrition: NutritionInfo | Meal['macros'] }> = ({ nutrition }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Check if we're displaying full nutrition info or just macros
  const isFullNutrition = 'saturatedFat' in nutrition;

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
          {isFullNutrition && (
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
          )}
        </Box>
        
        {isFullNutrition && (
          <>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="bold">Cholesterol</Text>
              <Text>{formatNumber(nutrition.cholesterol)}mg</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Sodium</Text>
              <Text>{formatNumber(nutrition.sodium)}mg</Text>
            </HStack>
          </>
        )}
        
        <Divider />
        
        <Box>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FaBreadSlice} color="brand.500" />
              <Text fontWeight="bold">Total Carbohydrates</Text>
            </HStack>
            <Text>{formatNumber(nutrition.carbs)}g</Text>
          </HStack>
          {isFullNutrition && (
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
          )}
        </Box>
        
        <Divider />
        
        <HStack justify="space-between">
          <HStack>
            <Icon as={FaDrumstickBite} color="brand.500" />
            <Text fontWeight="bold">Protein</Text>
          </HStack>
          <Text>{formatNumber(nutrition.protein)}g</Text>
        </HStack>
        
        {isFullNutrition && (
          <>
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
          </>
        )}
      </VStack>
    </Box>
  );
};

const calculateDailyTotals = (meals: Meal[], nutritionData: { [key: string]: NutritionInfo }) => {
  return meals.reduce((acc, meal) => {
    const mealTotals = meal.ingredients.every(ingredient => nutritionData[ingredient])
      ? meal.ingredients.reduce((total, ingredient) => {
          const nutrition = nutritionData[ingredient];
          return {
            calories: total.calories + nutrition.calories,
            protein: total.protein + nutrition.protein,
            carbs: total.carbs + nutrition.carbs,
            fats: total.fats + nutrition.fats
          };
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 })
      : meal.macros;

    return {
      calories: acc.calories + mealTotals.calories,
      protein: acc.protein + mealTotals.protein,
      carbs: acc.carbs + mealTotals.carbs,
      fats: acc.fats + mealTotals.fats,
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
};

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan }) => {
  const [nutritionData, setNutritionData] = useState<{ [key: string]: NutritionInfo }>({});
  const [loadingIngredients, setLoadingIngredients] = useState<{ [key: string]: boolean }>({});
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.600');
  const totalBg = useColorModeValue('gray.100', 'gray.500');

  // Pre-fetch nutrition data for all ingredients when meal plan changes
  useEffect(() => {
    const fetchAllNutritionData = async () => {
      const uniqueIngredients = new Set<string>();
      mealPlan.days.forEach(day => {
        day.meals.forEach(meal => {
          meal.ingredients.forEach(ingredient => {
            uniqueIngredients.add(ingredient);
          });
        });
      });

      // Fetch all ingredients in parallel
      const promises = Array.from(uniqueIngredients)
        .filter(ingredient => !nutritionData[ingredient])
        .map(async (ingredient) => {
          try {
            const nutrition = await fetchNutritionInfo(ingredient);
            setNutritionData(prev => ({ ...prev, [ingredient]: nutrition }));
          } catch (error) {
            console.error(`Error fetching nutrition for ${ingredient}:`, error);
          }
        });

      await Promise.all(promises);
    };

    fetchAllNutritionData();
  }, [mealPlan]);

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
          const dailyTotals = calculateDailyTotals(day.meals, nutritionData);
          
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
                  {day.meals.map((meal, index) => {
                    const mealTotals = meal.ingredients.every(ingredient => nutritionData[ingredient]) 
                      ? meal.ingredients.reduce((total, ingredient) => {
                          const nutrition = nutritionData[ingredient];
                          return {
                            calories: total.calories + nutrition.calories,
                            protein: total.protein + nutrition.protein,
                            carbs: total.carbs + nutrition.carbs,
                            fats: total.fats + nutrition.fats
                          };
                        }, { calories: 0, protein: 0, carbs: 0, fats: 0 })
                      : meal.macros;

                    return (
                      <Tr key={index} _hover={{ bg: 'gray.50' }}>
                        <Td fontWeight="medium">{meal.name}</Td>
                        <Td isNumeric>{mealTotals.calories}</Td>
                        <Td isNumeric>{mealTotals.protein}g</Td>
                        <Td isNumeric>{mealTotals.carbs}g</Td>
                        <Td isNumeric>{mealTotals.fats}g</Td>
                      </Tr>
                    );
                  })}
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
                {day.meals.map((meal, index) => (
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
                          <Heading size="sm">{meal.name} - {meal.recipeName}</Heading>
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
                              <AccordionItem key={ingredientIndex} border="none" mb={1}>
                                <AccordionButton
                                  bg={bgColor}
                                  borderWidth="1px"
                                  borderColor={borderColor}
                                  borderRadius="md"
                                  _hover={{ bg: 'gray.50' }}
                                  py={2}
                                >
                                  <Box flex="1" textAlign="left">
                                    <Text>{ingredient}</Text>
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
                          <Text fontWeight="bold" mb={2}>Description:</Text>
                          <Text>{meal.description}</Text>
                        </Box>

                        <Divider my={4} />

                        <Box>
                          <Text fontWeight="bold" mb={2}>Instructions:</Text>
                          <UnorderedList spacing={2}>
                            {meal.instructions.split('\n').map((instruction, index) => (
                              <ListItem key={index}>{instruction}</ListItem>
                            ))}
                          </UnorderedList>
                        </Box>
                        
                        <Divider my={4} />
                        
                        <Box>
                          <Text fontWeight="bold" mb={2}>Total Meal Nutrition:</Text>
                          {meal.ingredients.every(ingredient => nutritionData[ingredient]) ? (
                            <NutritionInfoDisplay 
                              nutrition={meal.ingredients.reduce((total, ingredient) => {
                                const nutrition = nutritionData[ingredient];
                                return {
                                  calories: total.calories + nutrition.calories,
                                  protein: total.protein + nutrition.protein,
                                  carbs: total.carbs + nutrition.carbs,
                                  fats: total.fats + nutrition.fats,
                                  fiber: total.fiber + nutrition.fiber,
                                  sugar: total.sugar + nutrition.sugar,
                                  saturatedFat: total.saturatedFat + nutrition.saturatedFat,
                                  transFat: total.transFat + nutrition.transFat,
                                  cholesterol: total.cholesterol + nutrition.cholesterol,
                                  sodium: total.sodium + nutrition.sodium,
                                  vitaminD: total.vitaminD + nutrition.vitaminD,
                                  calcium: total.calcium + nutrition.calcium,
                                  iron: total.iron + nutrition.iron,
                                  potassium: total.potassium + nutrition.potassium
                                };
                              }, {
                                calories: 0,
                                protein: 0,
                                carbs: 0,
                                fats: 0,
                                fiber: 0,
                                sugar: 0,
                                saturatedFat: 0,
                                transFat: 0,
                                cholesterol: 0,
                                sodium: 0,
                                vitaminD: 0,
                                calcium: 0,
                                iron: 0,
                                potassium: 0
                              })}
                            />
                          ) : (
                            <Text fontSize="sm" color="gray.500">Loading total nutrition...</Text>
                          )}
                        </Box>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          );
        })}
      </VStack>
    </Container>
  );
};

export default MealPlanDisplay; 