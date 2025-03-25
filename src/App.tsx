import React, { useState } from 'react';
import {
  Box,
  VStack,
  Container,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';
import MacroInputForm from './components/MacroInputForm';
import MealPlanDisplay from './components/MealPlanDisplay';
import { generateMealPlan } from './services/ollama';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

interface MacroInput {
  protein: number;
  carbs: number;
  fats: number;
  preferences: string[];
  restrictions: string[];
  days: number;
}

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [mealPlan, setMealPlan] = useState<{ days: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async (input: MacroInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateMealPlan(input);
      console.log('Meal plan response:', response);
      setMealPlan(response);
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan');
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

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="2xl" mb={4} color="brand.600">
                Meal Plan Generator
              </Heading>
              <Text fontSize="xl" mb={8} color="gray.600">
                Get personalized meal plans based on your macro targets and preferences
              </Text>
            </Box>

            <MacroInputForm onSubmit={handleSubmit} isLoading={isLoading} />

            {error && (
              <Box p={4} bg="red.50" borderRadius="md" color="red.700">
                <Text>{error}</Text>
              </Box>
            )}

            {mealPlan && <MealPlanDisplay mealPlan={mealPlan} />}
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App; 