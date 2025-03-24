import React, { useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  Textarea,
  Heading,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

interface MacroInputFormProps {
  onSubmit: (data: any) => void;
}

interface FormData {
  protein: number;
  carbs: number;
  fats: number;
  preferences: string;
}

const MacroInputForm: React.FC<MacroInputFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    console.log('MacroInputForm component mounted');
  }, []);

  const onFormSubmit = (data: FormData) => {
    console.log('Form data:', data);
    onSubmit(data);
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading size="lg" mb={6}>Meal Planner Preferences</Heading>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.protein}>
            <FormLabel>Protein (g)</FormLabel>
            <NumberInput min={0} max={400} step={10}>
              <NumberInputField {...register('protein', { required: 'Protein amount is required' })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.protein?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.carbs}>
            <FormLabel>Carbs (g)</FormLabel>
            <NumberInput min={0} max={600} step={10}>
              <NumberInputField {...register('carbs', { required: 'Carbs amount is required' })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.carbs?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.fats}>
            <FormLabel>Fats (g)</FormLabel>
            <NumberInput min={0} max={200} step={10}>
              <NumberInputField {...register('fats', { required: 'Fats amount is required' })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>{errors.fats?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Dietary Restrictions & Preferences</FormLabel>
            <Textarea
              {...register('preferences')}
              placeholder="Enter any dietary restrictions or cuisine preferences (e.g., vegetarian, gluten-free, Mediterranean cuisine)"
              size="md"
              rows={4}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg">
            Generate Meal Plan
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default MacroInputForm; 