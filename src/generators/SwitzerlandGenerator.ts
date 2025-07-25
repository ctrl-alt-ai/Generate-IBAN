import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Switzerland IBAN generator
 * Format: CH + 2 check digits + 5 bank code + 12 account number
 */
export class SwitzerlandGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('CH', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}