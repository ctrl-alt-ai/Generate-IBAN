import { describe, test, expect } from '@jest/globals';
import { 
  IBANError, 
  CountryNotSupportedError, 
  ValidationError, 
  GenerationError 
} from '../../errors/IBANErrors';

describe('IBAN Errors', () => {
  describe('IBANError', () => {
    test('should create error with message', () => {
      const error = new IBANError('Test message');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Test message');
      expect(error.name).toBe('IBANError');
    });

    test('should create error with message and code', () => {
      const error = new IBANError('Test message', 'TEST_CODE');
      
      expect(error.message).toBe('Test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('IBANError');
    });

    test('should create error without code', () => {
      const error = new IBANError('Test message');
      
      expect(error.message).toBe('Test message');
      expect(error.code).toBeUndefined();
    });
  });

  describe('CountryNotSupportedError', () => {
    test('should create error for unsupported country', () => {
      const error = new CountryNotSupportedError('XX');
      
      expect(error).toBeInstanceOf(IBANError);
      expect(error.message).toBe('IBAN specification not found for country: XX');
      expect(error.code).toBe('COUNTRY_NOT_SUPPORTED');
      expect(error.name).toBe('CountryNotSupportedError');
    });

    test('should handle empty country code', () => {
      const error = new CountryNotSupportedError('');
      
      expect(error.message).toBe('IBAN specification not found for country: ');
    });
  });

  describe('ValidationError', () => {
    test('should create validation error', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error).toBeInstanceOf(IBANError);
      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.name).toBe('ValidationError');
    });

    test('should handle long error messages', () => {
      const longMessage = 'This is a very long validation error message that should be handled properly';
      const error = new ValidationError(longMessage);
      
      expect(error.message).toBe(longMessage);
    });
  });

  describe('GenerationError', () => {
    test('should create generation error without country', () => {
      const error = new GenerationError('Failed to generate');
      
      expect(error).toBeInstanceOf(IBANError);
      expect(error.message).toBe('Failed to generate');
      expect(error.code).toBe('GENERATION_ERROR');
      expect(error.name).toBe('GenerationError');
    });

    test('should create generation error with country', () => {
      const error = new GenerationError('Failed to generate', 'NL');
      
      expect(error.message).toBe('Failed to generate for country NL');
      expect(error.code).toBe('GENERATION_ERROR');
    });

    test('should handle empty country code', () => {
      const error = new GenerationError('Failed to generate', '');
      
      expect(error.message).toBe('Failed to generate for country ');
    });
  });

  describe('Error inheritance', () => {
    test('all custom errors should be instances of Error', () => {
      const errors = [
        new IBANError('test'),
        new CountryNotSupportedError('XX'),
        new ValidationError('test'),
        new GenerationError('test')
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(Error);
      });
    });

    test('all custom errors except IBANError should be instances of IBANError', () => {
      const errors = [
        new CountryNotSupportedError('XX'),
        new ValidationError('test'),
        new GenerationError('test')
      ];

      errors.forEach(error => {
        expect(error).toBeInstanceOf(IBANError);
      });
    });

    test('should be catchable as specific error types', () => {
      const throwCountryError = () => {
        throw new CountryNotSupportedError('XX');
      };

      const throwValidationError = () => {
        throw new ValidationError('invalid');
      };

      expect(throwCountryError).toThrow(CountryNotSupportedError);
      expect(throwCountryError).toThrow(IBANError);
      expect(throwCountryError).toThrow(Error);

      expect(throwValidationError).toThrow(ValidationError);
      expect(throwValidationError).toThrow(IBANError);
      expect(throwValidationError).toThrow(Error);
    });
  });
});