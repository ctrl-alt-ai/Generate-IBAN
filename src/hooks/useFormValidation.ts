import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [validationResults, setValidationResults] = useState<ValidationResult>({});
  const [isValidating, setIsValidating] = useState(false);
  
  // Debounce form data changes to avoid excessive validation
  const debouncedFormData = useDebounce(formData, validationDelay);

  const validateQuantity = useCallback((quantity: number): ValidationError | null => {
    if (isNaN(quantity)) {
      return { message: t('form.quantity.validNumber'), type: 'error' };
    }
    if (quantity < 1) {
      return { message: t('form.quantity.minimum'), type: 'error' };
    }
    if (quantity > 100) {
      return { message: t('form.quantity.maximum'), type: 'error' };
    }
    if (quantity > 50) {
      return { message: t('form.quantity.largeQuantity'), type: 'warning' };
    }
    // Remove success message - only show warnings and errors
    return null;
  }, [t]);

  const validateCountry = useCallback((country: string): ValidationError | null => {
    if (!country) {
      return { message: t('errors.selectCountry'), type: 'error' };
    }
    // Remove success message - only show errors
    return null;
  }, [t]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const validateBank = useCallback((bank: string): ValidationError | null => {
    // Bank is optional, so no validation needed - clean interface
    // Parameter kept for consistency and future extensibility
    return null;
  }, []);

  useEffect(() => {
    setIsValidating(true);
    
    const results: ValidationResult = {};
    
    // Validate each field
    results.country = validateCountry(debouncedFormData.country);
    results.quantity = validateQuantity(debouncedFormData.quantity);
    results.bank = validateBank(debouncedFormData.bank);
    
    setValidationResults(results);
    setIsValidating(false);
  }, [debouncedFormData, validateCountry, validateQuantity, validateBank]);

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