import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Button,
  HStack,
  Input,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { FaDrumstickBite, FaBreadSlice, FaFire, FaTint } from 'react-icons/fa';

interface MacroInput {
  protein: number;
  carbs: number;
  fats: number;
  days: number;
  preferences: string[];
  restrictions: string[];
}

interface MacroInputFormProps {
  onSubmit: (data: MacroInput) => void;
  isLoading: boolean;
}

export const MacroInputForm = ({ onSubmit, isLoading }: MacroInputFormProps) => {
  const [protein, setProtein] = useState(150);
  const [carbs, setCarbs] = useState(200);
  const [fats, setFats] = useState(70);
  const [preferences, setPreferences] = useState('');

  const calories = useMemo(() => {
    return (protein * 4) + (carbs * 4) + (fats * 9);
  }, [protein, carbs, fats]);

  const handleSubmit = () => {
    onSubmit({
      protein,
      carbs,
      fats,
      days: 7,
      preferences: [preferences.trim()],
      restrictions: [],
    });
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
    >
      <VStack spacing={6} align="stretch">
        <HStack spacing={4} align="flex-start">
          <FormControl>
            <FormLabel>Protein (g)</FormLabel>
            <HStack>
              <Input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                min={0}
                max={500}
                required
                width="100px"
              />
              <Box color="brand.500">
                <FaDrumstickBite size={24} />
              </Box>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Carbs (g)</FormLabel>
            <HStack>
              <Input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                min={0}
                max={1000}
                required
                width="100px"
              />
              <Box color="brand.500">
                <FaBreadSlice size={24} />
              </Box>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Fats (g)</FormLabel>
            <HStack>
              <Input
                type="number"
                value={fats}
                onChange={(e) => setFats(Number(e.target.value))}
                min={0}
                max={200}
                required
                width="100px"
              />
              <Box color="brand.500">
                <FaTint size={24} />
              </Box>
            </HStack>
          </FormControl>

          <FormControl>
            <FormLabel>Calories</FormLabel>
            <HStack>
              <Box
                bg="gray.50"
                p={2}
                borderRadius="md"
                width="100px"
                textAlign="center"
              >
                <Text fontSize="lg" fontWeight="bold" color="brand.500">
                  {calories}
                </Text>
              </Box>
              <Box color="brand.500">
                <FaFire size={24} />
              </Box>
            </HStack>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Food Preferences</FormLabel>
          <Textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Describe your food preferences, dietary restrictions, or any specific requirements (e.g., 'I prefer Mediterranean cuisine with lots of vegetables and lean proteins')"
            rows={3}
          />
        </FormControl>

        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="Generating Meal Plan..."
          mt={4}
          width="100%"
        >
          Generate Meal Plan
        </Button>
      </VStack>
    </Box>
  );
};

export default MacroInputForm;