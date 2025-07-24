import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { FormData } from '../utils/types';

interface ValidationError {
  message: string;
  type: 'error' | 'warning' | 'success';
}

interface ValidationResult {
  [key: string]: ValidationError | null;
}

/**
 * Enhanced form validation hook with real-time validation and debouncing
 */
export function useFormValidation(formData: FormData, validationDelay = 300) {
  const [validationResults, setValidationResults] = useState<ValidationResult>({});
  const [isValidating, setIsValidating] = useState(false);
  
  // Debounce form data changes to avoid excessive validation
  const debouncedFormData = useDebounce(formData, validationDelay);

  const validateQuantity = (quantity: number): ValidationError | null => {
    if (isNaN(quantity)) {
      return { message: 'Please enter a valid number', type: 'error' };
    }
    if (quantity < 1) {
      return { message: 'Minimum quantity is 1', type: 'error' };
    }
    if (quantity > 100) {
      return { message: 'Maximum quantity is 100', type: 'error' };
    }
    if (quantity > 50) {
      return { message: 'Large quantities may take longer to generate', type: 'warning' };
    }
    return { message: `Will generate ${quantity} IBAN${quantity > 1 ? 's' : ''}`, type: 'success' };
  };

  const validateCountry = (country: string): ValidationError | null => {
    if (!country) {
      return { message: 'Please select a country', type: 'error' };
    }
    return { message: 'Country selected', type: 'success' };
  };

  const validateBank = (bank: string, _country: string): ValidationError | null => {
    // Bank is optional, so no error if empty
    if (!bank) {
      return { message: 'Random bank code will be used', type: 'warning' };
    }
    return { message: 'Specific bank selected', type: 'success' };
  };

  useEffect(() => {
    setIsValidating(true);
    
    const results: ValidationResult = {};
    
    // Validate each field
    results.country = validateCountry(debouncedFormData.country);
    results.quantity = validateQuantity(debouncedFormData.quantity);
    results.bank = validateBank(debouncedFormData.bank || '', debouncedFormData.country);
    
    setValidationResults(results);
    setIsValidating(false);
  }, [debouncedFormData]);

  const isFormValid = () => {
    return Object.values(validationResults).every(
      result => !result || result.type !== 'error'
    );
  };

  const getFieldValidation = (fieldName: string) => {
    return validationResults[fieldName] || null;
  };

  const hasErrors = () => {
    return Object.values(validationResults).some(
      result => result && result.type === 'error'
    );
  };

  return {
    validationResults,
    isValidating,
    isFormValid: isFormValid(),
    hasErrors: hasErrors(),
    getFieldValidation
  };
}