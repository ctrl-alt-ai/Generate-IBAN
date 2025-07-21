import { CountryGenerator } from './CountryGenerator';
import { NetherlandsGenerator } from './NetherlandsGenerator';
import { GermanyGenerator } from './GermanyGenerator';
import { BelgiumGenerator } from './BelgiumGenerator';
import { FranceGenerator } from './FranceGenerator';
import { SpainGenerator } from './SpainGenerator';
import { ItalyGenerator } from './ItalyGenerator';
import { CountryNotSupportedError } from '../errors/IBANErrors';
import type { IBANSpecs } from '../utils/types';

/**
 * Factory for creating country-specific IBAN generators
 */
export class CountryGeneratorFactory {
  private generators = new Map<string, CountryGenerator>();
  private specs: IBANSpecs;

  constructor(specs: IBANSpecs) {
    this.specs = specs;
    this.initializeGenerators();
  }

  /**
   * Initialize all available country generators
   */
  private initializeGenerators(): void {
    // Initialize each country generator with its specific class
    if (this.specs.NL) {
      this.generators.set('NL', new NetherlandsGenerator(this.specs.NL));
    }
    if (this.specs.DE) {
      this.generators.set('DE', new GermanyGenerator(this.specs.DE));
    }
    if (this.specs.BE) {
      this.generators.set('BE', new BelgiumGenerator(this.specs.BE));
    }
    if (this.specs.FR) {
      this.generators.set('FR', new FranceGenerator(this.specs.FR));
    }
    if (this.specs.ES) {
      this.generators.set('ES', new SpainGenerator(this.specs.ES));
    }
    if (this.specs.IT) {
      this.generators.set('IT', new ItalyGenerator(this.specs.IT));
    }
  }

  /**
   * Get a generator for the specified country
   */
  public getGenerator(countryCode: string): CountryGenerator {
    const generator = this.generators.get(countryCode);
    if (!generator) {
      throw new CountryNotSupportedError(countryCode);
    }
    return generator;
  }

  /**
   * Get all available country codes
   */
  public getAvailableCountries(): string[] {
    return Array.from(this.generators.keys());
  }

  /**
   * Check if a country is supported
   */
  public isCountrySupported(countryCode: string): boolean {
    return this.generators.has(countryCode);
  }
}