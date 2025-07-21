import { CountryGenerator } from './CountryGenerator';
import { NetherlandsGenerator } from './NetherlandsGenerator';
import { GermanyGenerator } from './GermanyGenerator';
import { BelgiumGenerator } from './BelgiumGenerator';
import { FranceGenerator } from './FranceGenerator';
import { SpainGenerator } from './SpainGenerator';
import { ItalyGenerator } from './ItalyGenerator';
import { CountryNotSupportedError } from '../errors/IBANErrors';
import { ConfigLoader } from '../config/ConfigLoader';

/**
 * Factory for creating country-specific IBAN generators
 * Uses configuration from ConfigLoader for better maintainability
 */
export class CountryGeneratorFactory {
  private generators = new Map<string, CountryGenerator>();
  private configLoader: ConfigLoader;

  constructor() {
    this.configLoader = ConfigLoader.getInstance();
    this.initializeGenerators();
  }

  /**
   * Initialize all available country generators
   */
  private initializeGenerators(): void {
    const specs = this.configLoader.getIBANSpecs();
    
    // Initialize each country generator with its specific class
    if (specs.NL) {
      this.generators.set('NL', new NetherlandsGenerator(specs.NL));
    }
    if (specs.DE) {
      this.generators.set('DE', new GermanyGenerator(specs.DE));
    }
    if (specs.BE) {
      this.generators.set('BE', new BelgiumGenerator(specs.BE));
    }
    if (specs.FR) {
      this.generators.set('FR', new FranceGenerator(specs.FR));
    }
    if (specs.ES) {
      this.generators.set('ES', new SpainGenerator(specs.ES));
    }
    if (specs.IT) {
      this.generators.set('IT', new ItalyGenerator(specs.IT));
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