import { useState, useCallback } from 'react';

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface FormValidationState {
  country: ValidationState;
  bank: ValidationState;
  quantity: ValidationState;
  general: ValidationState;
}

export function useFormValidation() {
  const [validationState, setValidationState] = useState<FormValidationState>({
    country: { isValid: true, message: '' },
    bank: { isValid: true, message: '' },
    quantity: { isValid: true, message: '' },
    general: { isValid: true, message: '' }
  });

  const validateCountry = useCallback((country: string): ValidationState => {
    if (!country || country.trim().length === 0) {
      return { isValid: false, message: 'Please select a valid country.' };
    }
    return { isValid: true, message: '' };
  }, []);

  const validateQuantity = useCallback((quantity: number): ValidationState => {
    if (isNaN(quantity) || quantity < 1 || quantity > 100) {
      return { isValid: false, message: 'Please enter a number between 1 and 100.' };
    }
    return { isValid: true, message: '' };
  }, []);

  const validateBank = useCallback((bank: string, isRequired = false): ValidationState => {
    if (isRequired && (!bank || bank.trim().length === 0)) {
      return { isValid: false, message: 'Please select a bank.' };
    }
    return { isValid: true, message: '' };
  }, []);

  const validateField = useCallback((field: keyof FormValidationState, value: any, extra?: any) => {
    let newState: ValidationState;
    
    switch (field) {
      case 'country':
        newState = validateCountry(value);
        break;
      case 'quantity':
        newState = validateQuantity(value);
        break;
      case 'bank':
        newState = validateBank(value, extra);
        break;
      default:
        newState = { isValid: true, message: '' };
    }

    setValidationState(prev => ({
      ...prev,
      [field]: newState
    }));

    return newState.isValid;
  }, [validateCountry, validateQuantity, validateBank]);

  const validateAll = useCallback((formData: {
    country: string;
    bank?: string;
    quantity: number;
  }): boolean => {
    const countryValid = validateField('country', formData.country);
    const quantityValid = validateField('quantity', formData.quantity);
    const bankValid = validateField('bank', formData.bank, false);

    return countryValid && quantityValid && bankValid;
  }, [validateField]);

  const clearValidation = useCallback(() => {
    setValidationState({
      country: { isValid: true, message: '' },
      bank: { isValid: true, message: '' },
      quantity: { isValid: true, message: '' },
      general: { isValid: true, message: '' }
    });
  }, []);

  const setGeneralError = useCallback((message: string) => {
    setValidationState(prev => ({
      ...prev,
      general: { isValid: false, message }
    }));
  }, []);

  return {
    validationState,
    validateField,
    validateAll,
    clearValidation,
    setGeneralError
  };
}