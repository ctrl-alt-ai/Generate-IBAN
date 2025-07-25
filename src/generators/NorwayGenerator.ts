import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Norway IBAN generator
 * Format: NO + 2 check digits + 4 bank code + 7 account number
 */
export class NorwayGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('NO', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}