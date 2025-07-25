import { CountryGenerator } from './CountryGenerator';
import type { IBANSpec, BankInfo } from '../utils/types';

/**
 * United Kingdom IBAN generator
 * Format: GB + 2 check digits + 4 bank code + 6 sort code + 8 account number
 */
export class UnitedKingdomGenerator extends CountryGenerator {
  constructor(spec: IBANSpec) {
    super('GB', spec);
  }

  protected generateBBAN(bankInfo?: BankInfo | null): string {
    const bankCodePart = this.generateBankCodePart(bankInfo);
    const sortCodePart = this.generateBranchCodePart(); // Sort code is treated as branch code
    const accountPart = this.generateAccountPart();
    
    return bankCodePart + sortCodePart + accountPart;
  }
}