/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from '@jest/globals';
import { ValidationUtils } from '../../utils/validation';
import { ValidationError } from '../../errors/IBANErrors';
import type { FormData, BankInfo } from '../../utils/types';

describe('ValidationUtils', () => {
  describe('validateCountryCode', () => {
    test('should accept valid country codes', () => {
      expect(() => ValidationUtils.validateCountryCode('NL')).not.toThrow();
      expect(() => ValidationUtils.validateCountryCode('DE')).not.toThrow();
    });

    test('should reject invalid country codes', () => {
      expect(() => ValidationUtils.validateCountryCode('')).toThrow(ValidationError);
      expect(() => ValidationUtils.validateCountryCode('XX')).toThrow(ValidationError);
    });

    test('should reject non-string country codes', () => {
      expect(() => ValidationUtils.validateCountryCode(null as any)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateCountryCode(undefined as any)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateCountryCode(123 as any)).toThrow(ValidationError);
    });
  });

  describe('validateBankInfo', () => {
    test('should accept null/undefined bank info (optional)', () => {
      expect(() => ValidationUtils.validateBankInfo(null, 'NL')).not.toThrow();
      expect(() => ValidationUtils.validateBankInfo(undefined, 'NL')).not.toThrow();
    });

    test('should accept valid bank info', () => {
      const bankInfo: BankInfo = { name: 'ABN AMRO', code: 'ABNA' };
      expect(() => ValidationUtils.validateBankInfo(bankInfo, 'NL')).not.toThrow();
    });

    test('should reject invalid bank info structure', () => {
      expect(() => ValidationUtils.validateBankInfo('invalid' as any, 'NL')).toThrow(ValidationError);
      expect(() => ValidationUtils.validateBankInfo({ name: 'Test' } as any, 'NL')).toThrow(ValidationError);
      expect(() => ValidationUtils.validateBankInfo({ code: 'TEST' } as any, 'NL')).toThrow(ValidationError);
    });

    test('should reject non-string fields', () => {
      expect(() => ValidationUtils.validateBankInfo({ name: 123, code: 'TEST' } as any, 'NL')).toThrow(ValidationError);
      expect(() => ValidationUtils.validateBankInfo({ name: 'Test', code: 123 } as any, 'NL')).toThrow(ValidationError);
    });
  });

  describe('validateQuantity', () => {
    test('should accept valid quantities', () => {
      expect(() => ValidationUtils.validateQuantity(1)).not.toThrow();
      expect(() => ValidationUtils.validateQuantity(50)).not.toThrow();
      expect(() => ValidationUtils.validateQuantity(100)).not.toThrow();
    });

    test('should reject invalid quantities', () => {
      expect(() => ValidationUtils.validateQuantity(0)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateQuantity(-1)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateQuantity(101)).toThrow(ValidationError);
    });

    test('should reject non-integer quantities', () => {
      expect(() => ValidationUtils.validateQuantity(1.5)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateQuantity('10' as any)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateQuantity(null as any)).toThrow(ValidationError);
    });
  });

  describe('validateFormData', () => {
    test('should accept valid form data', () => {
      const formData: FormData = {
        country: 'NL',
        bank: 'ABNA',
        quantity: 1
      };
      expect(() => ValidationUtils.validateFormData(formData)).not.toThrow();
    });

    test('should accept form data without bank', () => {
      const formData: FormData = {
        country: 'NL',
        quantity: 5
      };
      expect(() => ValidationUtils.validateFormData(formData)).not.toThrow();
    });

    test('should reject invalid form data', () => {
      expect(() => ValidationUtils.validateFormData(null as any)).toThrow(ValidationError);
      expect(() => ValidationUtils.validateFormData('invalid' as any)).toThrow(ValidationError);
    });

    test('should reject form data with invalid country', () => {
      const formData: FormData = {
        country: 'XX',
        quantity: 1
      };
      expect(() => ValidationUtils.validateFormData(formData)).toThrow(ValidationError);
    });

    test('should reject form data with invalid quantity', () => {
      const formData: FormData = {
        country: 'NL',
        quantity: 0
      };
      expect(() => ValidationUtils.validateFormData(formData)).toThrow(ValidationError);
    });
  });

  describe('validateIBANFormat', () => {
    test('should accept valid IBAN formats', () => {
      expect(ValidationUtils.validateIBANFormat('NL91ABNA0417164300')).toBe(true);
      expect(ValidationUtils.validateIBANFormat('DE89370400440532013000')).toBe(true);
      expect(ValidationUtils.validateIBANFormat('NL91 ABNA 0417 1643 00')).toBe(true); // with spaces
    });

    test('should reject invalid IBAN formats', () => {
      expect(ValidationUtils.validateIBANFormat('')).toBe(false);
      expect(ValidationUtils.validateIBANFormat('invalid')).toBe(false);
      expect(ValidationUtils.validateIBANFormat('NL')).toBe(false); // too short
      expect(ValidationUtils.validateIBANFormat('1191ABNA0417164300')).toBe(false); // starts with digit
      expect(ValidationUtils.validateIBANFormat('NLX1ABNA0417164300')).toBe(false); // invalid check digit
    });

    test('should handle null/undefined input', () => {
      expect(ValidationUtils.validateIBANFormat(null as any)).toBe(false);
      expect(ValidationUtils.validateIBANFormat(undefined as any)).toBe(false);
    });
  });

  describe('validateIBANLength', () => {
    test('should accept correct length IBANs', () => {
      expect(ValidationUtils.validateIBANLength('NL91ABNA0417164300', 'NL')).toBe(true); // 18 chars
      expect(ValidationUtils.validateIBANLength('DE89370400440532013000', 'DE')).toBe(true); // 22 chars
    });

    test('should reject incorrect length IBANs', () => {
      expect(ValidationUtils.validateIBANLength('NL91ABNA041716430', 'NL')).toBe(false); // too short
      expect(ValidationUtils.validateIBANLength('NL91ABNA04171643000', 'NL')).toBe(false); // too long
    });

    test('should infer country from IBAN', () => {
      expect(ValidationUtils.validateIBANLength('NL91ABNA0417164300')).toBe(true);
      expect(ValidationUtils.validateIBANLength('DE89370400440532013000')).toBe(true);
    });

    test('should reject invalid format IBANs', () => {
      expect(ValidationUtils.validateIBANLength('invalid')).toBe(false);
      expect(ValidationUtils.validateIBANLength('XX91ABNA0417164300')).toBe(false); // unsupported country
    });
  });
});