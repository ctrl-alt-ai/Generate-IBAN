import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Spain IBAN generator
 * Format: ES + 2 check digits + 4 bank code + 4 branch code + 2 national check + 10 account number
 */
export class SpainGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('ES', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const branchCodePart = this.generateBranchCodePart();
    const nationalCheckPart = this.generateNationalCheckPart();
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + branchCodePart + nationalCheckPart + accountPart;
  }
}