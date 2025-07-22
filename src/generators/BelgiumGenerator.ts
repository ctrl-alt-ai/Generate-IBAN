import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Belgium IBAN generator
 * Format: BE + 2 check digits + 3 bank code + 7 account number + 2 national check
 */
export class BelgiumGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('BE', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const accountPart = this.generateAccountPart();
    const nationalCheckPart = this.calculateNationalCheck((bankCodePart + accountPart).replace(/\D/g, ''));
    
    return bankCodePart + accountPart + nationalCheckPart;
  }
}