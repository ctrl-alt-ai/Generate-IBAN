import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Denmark IBAN generator
 * Format: DK + 2 check digits + 4 bank code + 10 account number
 */
export class DenmarkGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('DK', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}