import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Austria IBAN generator
 * Format: AT + 2 check digits + 5 bank code + 11 account number
 */
export class AustriaGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('AT', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + accountPart;
  }
}