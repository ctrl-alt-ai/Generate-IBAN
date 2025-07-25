import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Sweden IBAN generator
 * Format: SE + 2 check digits + 3 bank code + 17 account number
 */
export class SwedenGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('SE', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}