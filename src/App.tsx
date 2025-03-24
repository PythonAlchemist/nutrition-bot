import React, { useState, useEffect } from 'react';
import { ChakraProvider, Container, VStack, Heading, useToast } from '@chakra-ui/react';
import MacroInputForm from './components/MacroInputForm';
import MealPlanDisplay from './components/MealPlanDisplay';
import { generateMealPlan } from './services/api';

interface MealPlan {
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

function App() {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    console.log('App component mounted');
  }, []);

  const handleSubmit = async (data: any) => {
    console.log('Form submitted with data:', data);
    setIsLoading(true);
    setError(null);
    
    try {
      const generatedPlan = await generateMealPlan(data);
      console.log('Generated meal plan:', generatedPlan);
      setMealPlan(generatedPlan);
      toast({
        title: 'Success!',
        description: 'Your meal plan has been generated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      setError('Failed to generate meal plan. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to generate meal plan. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <ChakraProvider>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8}>
            <Heading color="red.500">Error: {error}</Heading>
            <MacroInputForm onSubmit={handleSubmit} />
          </VStack>
        </Container>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Heading>Weekly Meal Planner</Heading>
          <MacroInputForm onSubmit={handleSubmit} />
          {isLoading && <Heading size="md">Generating your meal plan...</Heading>}
          {mealPlan.length > 0 && <MealPlanDisplay mealPlan={mealPlan} />}
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App; 