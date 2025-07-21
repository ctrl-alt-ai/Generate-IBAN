import type { IBANSpec, BankInfo } from '../utils/types';
import { GenerationError } from '../errors/IBANErrors';
import { generateRandomChars, calculateMod97Check } from '../utils/ibanGenerator';

/**
 * Abstract base class for country-specific IBAN generators
 */
export abstract class CountryGenerator {
  protected spec: IBANSpec;
  protected countryCode: string;

  constructor(countryCode: string, spec: IBANSpec) {
    this.countryCode = countryCode;
    this.spec = spec;
  }

  /**
   * Generates the BBAN (Basic Bank Account Number) part of the IBAN
   */
  protected abstract generateBBAN(bankInfo?: BankInfo | null): string;

  /**
   * Generates a complete IBAN for this country
   */
  public generateIBAN(bankInfo?: BankInfo | null): string {
    try {
      const bban = this.generateBBAN(bankInfo);
      
      if (bban.length !== this.spec.length - 4) {
        throw new GenerationError(
          `BBAN length mismatch: expected ${this.spec.length - 4}, got ${bban.length}`,
          this.countryCode
        );
      }

      return this.assembleIBAN(bban);
    } catch (error) {
      if (error instanceof GenerationError) {
        throw error;
      }
      throw new GenerationError(
        `Failed to generate IBAN: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.countryCode
      );
    }
  }

  /**
   * Assembles the final IBAN with check digits
   */
  private assembleIBAN(bban: string): string {
    const ibanWithoutCheck = `${this.countryCode}00${bban}`;
    const checkDigits = this.calculateIBANCheckDigits(ibanWithoutCheck);
    
    if (!checkDigits) {
      throw new GenerationError('Failed to calculate IBAN check digits', this.countryCode);
    }

    return `${this.countryCode}${checkDigits}${bban}`;
  }

  /**
   * Calculates IBAN check digits using mod-97 algorithm
   */
  private calculateIBANCheckDigits(iban: string): string | null {
    const rearranged = iban.substring(4) + iban.substring(0, 4);
    let numerical = '';

    for (let i = 0; i < rearranged.length; i++) {
      const char = rearranged.charAt(i).toUpperCase();

      if (char >= 'A' && char <= 'Z') {
        numerical += (char.charCodeAt(0) - 55).toString();
      } else if (char >= '0' && char <= '9') {
        numerical += char;
      } else {
        return null;
      }
    }

    try {
      if (!/^\d+$/.test(numerical)) {
        throw new Error('Non-digit characters found');
      }

      // Handle large numbers safely without BigInt
      let remainder = 0;
      for (let i = 0; i < numerical.length; i++) {
        remainder = (remainder * 10 + parseInt(numerical[i])) % 97;
      }

      const checkDigitInt = 98 - remainder;
      return checkDigitInt < 10 ? `0${checkDigitInt}` : `${checkDigitInt}`;
    } catch {
      return null;
    }
  }

  /**
   * Helper method to generate bank code part
   */
  protected generateBankCodePart(bankInfo?: BankInfo | null): string {
    return bankInfo?.code || generateRandomChars(this.spec.bankCodeLength, this.spec.bankCodeType);
  }

  /**
   * Helper method to generate account part
   */
  protected generateAccountPart(): string {
    return generateRandomChars(this.spec.accountLength, this.spec.accountType);
  }

  /**
   * Helper method to generate branch code part
   */
  protected generateBranchCodePart(): string {
    if (!this.spec.branchCodeLength || !this.spec.branchCodeType) {
      throw new GenerationError('Branch code specification missing', this.countryCode);
    }
    return generateRandomChars(this.spec.branchCodeLength, this.spec.branchCodeType);
  }

  /**
   * Helper method to generate national check part
   */
  protected generateNationalCheckPart(): string {
    if (!this.spec.nationalCheckLength || !this.spec.nationalCheckType) {
      throw new GenerationError('National check specification missing', this.countryCode);
    }
    return generateRandomChars(this.spec.nationalCheckLength, this.spec.nationalCheckType);
  }

  /**
   * Helper method to calculate mod-97 check for national check digits
   */
  protected calculateNationalCheck(input: string): string {
    return calculateMod97Check(input);
  }
}