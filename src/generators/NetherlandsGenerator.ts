import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Netherlands IBAN generator
 * Format: NL + 2 check digits + 4 bank code + 10 account number
 */
export class NetherlandsGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('NL', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}