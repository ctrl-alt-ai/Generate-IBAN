import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * Portugal IBAN generator
 * Format: PT + 2 check digits + 4 bank code + 4 branch code + 11 account number + 2 national check
 */
export class PortugalGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('PT', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const branchCodePart = this.generateBranchCodePart();
    const accountPart = this.generateAccountPart();
    const nationalCheckPart = this.calculateNationalCheck((bankCodePart + branchCodePart + accountPart).replace(/\D/g, ''));
    
    return bankCodePart + branchCodePart + accountPart + nationalCheckPart;
  }
}