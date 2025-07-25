import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Luxembourg IBAN generator
 * Format: LU + 2 check digits + 3 bank code + 13 account number
 */
export class LuxembourgGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('LU', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}