import { describe, test, expect, beforeEach } from '@jest/globals';
import { NetherlandsGenerator } from '../../generators/NetherlandsGenerator';
import { GermanyGenerator } from '../../generators/GermanyGenerator';
import { BelgiumGenerator } from '../../generators/BelgiumGenerator';
import { FranceGenerator } from '../../generators/FranceGenerator';
import { SpainGenerator } from '../../generators/SpainGenerator';
import { ItalyGenerator } from '../../generators/ItalyGenerator';
import { AustriaGenerator } from '../../generators/AustriaGenerator';
import { SwitzerlandGenerator } from '../../generators/SwitzerlandGenerator';
import { LuxembourgGenerator } from '../../generators/LuxembourgGenerator';
import { PortugalGenerator } from '../../generators/PortugalGenerator';
import { UnitedKingdomGenerator } from '../../generators/UnitedKingdomGenerator';
import { SwedenGenerator } from '../../generators/SwedenGenerator';
import { NorwayGenerator } from '../../generators/NorwayGenerator';
import { DenmarkGenerator } from '../../generators/DenmarkGenerator';
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
      
      expect(iban).toMatch(/^DE\d{20}$/); // DE + 2 check digits + 18 BBAN digits
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

  describe('AustriaGenerator', () => {
    let generator: AustriaGenerator;

    beforeEach(() => {
      generator = new AustriaGenerator(specs.AT);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^AT\d{18}$/); // AT + 2 check + 16 BBAN digits
      expect(iban.length).toBe(20);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Bank Austria', code: '12000' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^AT\d{2}12000\d{11}$/);
      expect(iban.length).toBe(20);
    });
  });

  describe('SwitzerlandGenerator', () => {
    let generator: SwitzerlandGenerator;

    beforeEach(() => {
      generator = new SwitzerlandGenerator(specs.CH);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^CH\d{19}$/); // CH + 2 check + 17 BBAN digits
      expect(iban.length).toBe(21);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'UBS', code: '00240' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^CH\d{2}00240\d{12}$/);
      expect(iban.length).toBe(21);
    });
  });

  describe('LuxembourgGenerator', () => {
    let generator: LuxembourgGenerator;

    beforeEach(() => {
      generator = new LuxembourgGenerator(specs.LU);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^LU\d{18}$/); // LU + 2 check + 16 BBAN digits
      expect(iban.length).toBe(20);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'BGL BNP Paribas', code: '001' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^LU\d{2}001\d{13}$/);
      expect(iban.length).toBe(20);
    });
  });

  describe('PortugalGenerator', () => {
    let generator: PortugalGenerator;

    beforeEach(() => {
      generator = new PortugalGenerator(specs.PT);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^PT\d{23}$/); // PT + 2 check + 21 BBAN digits
      expect(iban.length).toBe(25);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Millennium bcp', code: '0033' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^PT\d{2}0033\d{4}\d{11}\d{2}$/);
      expect(iban.length).toBe(25);
    });
  });

  describe('UnitedKingdomGenerator', () => {
    let generator: UnitedKingdomGenerator;

    beforeEach(() => {
      generator = new UnitedKingdomGenerator(specs.GB);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^GB\d{2}[A-Z]{4}\d{14}$/); // GB + 2 check + 4 bank letters + 14 digits
      expect(iban.length).toBe(22);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Barclays', code: 'BARC' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^GB\d{2}BARC\d{14}$/);
      expect(iban.length).toBe(22);
    });
  });

  describe('SwedenGenerator', () => {
    let generator: SwedenGenerator;

    beforeEach(() => {
      generator = new SwedenGenerator(specs.SE);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^SE\d{22}$/); // SE + 2 check + 20 BBAN digits
      expect(iban.length).toBe(24);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Handelsbanken', code: '600' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^SE\d{2}600\d{17}$/);
      expect(iban.length).toBe(24);
    });
  });

  describe('NorwayGenerator', () => {
    let generator: NorwayGenerator;

    beforeEach(() => {
      generator = new NorwayGenerator(specs.NO);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^NO\d{13}$/); // NO + 2 check + 11 BBAN digits
      expect(iban.length).toBe(15);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'DNB', code: '1200' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^NO\d{2}1200\d{7}$/);
      expect(iban.length).toBe(15);
    });
  });

  describe('DenmarkGenerator', () => {
    let generator: DenmarkGenerator;

    beforeEach(() => {
      generator = new DenmarkGenerator(specs.DK);
    });

    test('should generate valid IBAN without bank info', () => {
      const iban = generator.generateIBAN();
      
      expect(iban).toMatch(/^DK\d{16}$/); // DK + 2 check + 14 BBAN digits
      expect(iban.length).toBe(18);
    });

    test('should generate valid IBAN with bank info', () => {
      const bankInfo: BankInfo = { name: 'Danske Bank', code: '0040' };
      const iban = generator.generateIBAN(bankInfo);
      
      expect(iban).toMatch(/^DK\d{2}0040\d{10}$/);
      expect(iban.length).toBe(18);
    });
  });
});