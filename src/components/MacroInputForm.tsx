import React, { useState } from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Button,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FaAppleAlt, FaDrumstickBite, FaBreadSlice } from 'react-icons/fa';

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

  const handleSubmit = () => {
    onSubmit({
      protein,
      carbs,
      fats,
      days: 7,
      preferences: [],
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
        <FormControl>
          <FormLabel>Daily Protein Target (g)</FormLabel>
          <HStack>
            <NumberInput
              value={protein}
              onChange={(_, value) => setProtein(value)}
              min={0}
              max={500}
              step={1}
            >
              <NumberInputField name="protein" required />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Box color="brand.500">
              <FaDrumstickBite size={24} />
            </Box>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>Daily Carbs Target (g)</FormLabel>
          <HStack>
            <NumberInput
              value={carbs}
              onChange={(_, value) => setCarbs(value)}
              min={0}
              max={1000}
              step={1}
            >
              <NumberInputField name="carbs" required />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Box color="brand.500">
              <FaBreadSlice size={24} />
            </Box>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel>Daily Fats Target (g)</FormLabel>
          <HStack>
            <NumberInput
              value={fats}
              onChange={(_, value) => setFats(value)}
              min={0}
              max={200}
              step={1}
            >
              <NumberInputField name="fats" required />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Box color="brand.500">
              <FaAppleAlt size={24} />
            </Box>
          </HStack>
        </FormControl>

        <Button
          colorScheme="brand"
          size="lg"
          onClick={handleSubmit}
          isLoading={isLoading}
          mt={4}
        >
          Generate Meal Plan
        </Button>
      </VStack>
    </Box>
  );
};

export default MacroInputForm;