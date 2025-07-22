import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Italy IBAN generator
 * Format: IT + 2 check digits + 1 national check + 5 bank code + 5 branch code + 12 account number
 */
export class ItalyGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('IT', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const nationalCheckPart = this.generateNationalCheckPart();
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const branchCodePart = this.generateBranchCodePart();
    const accountPart = this.generateAccountPart();
    
    return nationalCheckPart + bankCodePart + branchCodePart + accountPart;
  }
}