import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * France IBAN generator
 * Format: FR + 2 check digits + 5 bank code + 5 branch code + 11 account number + 2 national check
 */
export class FranceGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('FR', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const branchCodePart = this.generateBranchCodePart();
    const accountPart = this.generateAccountPart();
    const nationalCheckPart = this.generateNationalCheckPart();
    
    return bankCodePart + branchCodePart + accountPart + nationalCheckPart;
  }
}