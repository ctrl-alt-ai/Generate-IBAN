import { describe, test, expect, beforeEach } from '@jest/globals';
import { NetherlandsGenerator } from '../../generators/NetherlandsGenerator';
import { GermanyGenerator } from '../../generators/GermanyGenerator';
import { BelgiumGenerator } from '../../generators/BelgiumGenerator';
import { FranceGenerator } from '../../generators/FranceGenerator';
import { SpainGenerator } from '../../generators/SpainGenerator';
import { ItalyGenerator } from '../../generators/ItalyGenerator';
import { ConfigLoader } from '../../config/ConfigLoader';
import type { IBANSpec, BankInfo } from '../../utils/types';

describe('Country Generators', () => {
  let configLoader: ConfigLoader;
  let specs: Record<string, IBANSpec>;

  beforeEach(() => {
    configLoader = ConfigLoader.getInstance();
    specs = configLoader.getIBANSpecs();
  });

  describe('NetherlandsGenerator', () => {
    let generator: NetherlandsGenerator;

    beforeEach(() => {
      generator = new NetherlandsGenerator(specs.NL);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^NL\d{2}[A-Z]{4}\d{10}$/);
      expect(iban.length).toBe(18);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'ABN AMRO', code: 'ABNA' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^NL\d{2}ABNA\d{10}$/);
      expect(iban.length).toBe(18);
    });

    test('should generate different IBANs on multiple calls', () => {
      const iban1 = generator.generateIBAN();
      const iban2 = generator.generateIBAN();
      
      expect(iban1).not.toBe(iban2);
    });
  });

  describe('GermanyGenerator', () => {
    let generator: GermanyGenerator;

    beforeEach(() => {
      generator = new GermanyGenerator(specs.DE);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^DE\d{22}$/);
      expect(iban.length).toBe(22);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Deutsche Bank', code: '50070010' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^DE\d{2}50070010\d{10}$/);
      expect(iban.length).toBe(22);
    });
  });

  describe('BelgiumGenerator', () => {
    let generator: BelgiumGenerator;

    beforeEach(() => {
      generator = new BelgiumGenerator(specs.BE);
    });

    test('should generate valid IBAN with national check digits', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^BE\d{2}\d{3}\d{7}\d{2}$/);
      expect(iban.length).toBe(16);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'BNP Paribas Fortis', code: '001' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^BE\d{2}001\d{7}\d{2}$/);
      expect(iban.length).toBe(16);
    });
  });

  describe('FranceGenerator', () => {
    let generator: FranceGenerator;

    beforeEach(() => {
      generator = new FranceGenerator(specs.FR);
    });

    test('should generate valid IBAN', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^FR\d{2}\d{5}\d{5}[A-Z0-9]{11}\d{2}$/);
      expect(iban.length).toBe(27);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'BNP Paribas', code: '30004' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^FR\d{2}30004\d{5}[A-Z0-9]{11}\d{2}$/);
      expect(iban.length).toBe(27);
    });
  });

  describe('SpainGenerator', () => {
    let generator: SpainGenerator;

    beforeEach(() => {
      generator = new SpainGenerator(specs.ES);
    });

    test('should generate valid IBAN', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^ES\d{2}\d{4}\d{4}\d{2}\d{10}$/);
      expect(iban.length).toBe(24);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Banco Santander', code: '0049' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^ES\d{2}0049\d{4}\d{2}\d{10}$/);
      expect(iban.length).toBe(24);
    });
  });

  describe('ItalyGenerator', () => {
    let generator: ItalyGenerator;

    beforeEach(() => {
      generator = new ItalyGenerator(specs.IT);
    });

    test('should generate valid IBAN', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^IT\d{2}[A-Z]\d{5}\d{5}[A-Z0-9]{12}$/);
      expect(iban.length).toBe(27);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'UniCredit', code: '02008' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^IT\d{2}[A-Z]02008\d{5}[A-Z0-9]{12}$/);
      expect(iban.length).toBe(27);
    });
  });
});