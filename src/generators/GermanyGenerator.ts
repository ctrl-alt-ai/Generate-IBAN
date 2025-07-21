import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Germany IBAN generator
 * Format: DE + 2 check digits + 8 bank code + 10 account number
 */
export class GermanyGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('DE', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}