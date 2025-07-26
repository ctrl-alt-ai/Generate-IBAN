import type { CountryGenerator } from './CountryGenerator';
import type { IBANSpec } from '../utils/types';

/**
 * Interface for country generator constructors
 */
export interface CountryGeneratorConstructor {
  new (spec: IBANSpec): CountryGenerator;
}

/**
 * Registry for country generators using a more flexible pattern
 * This allows easier extension without modifying the factory code
 */
export class GeneratorRegistry {
  private static instance: GeneratorRegistry;
  private generators = new Map<string, CountryGeneratorConstructor>();

  private constructor() {}

  public static getInstance(): GeneratorRegistry {
    if (!GeneratorRegistry.instance) {
      GeneratorRegistry.instance = new GeneratorRegistry();
    }
    return GeneratorRegistry.instance;
  }

  /**
   * Register a generator for a country
   */
  public register(countryCode: string, generator: CountryGeneratorConstructor): void {
    this.generators.set(countryCode, generator);
  }

  /**
   * Get a generator constructor for a country
   */
  public getGenerator(countryCode: string): CountryGeneratorConstructor | undefined {
    return this.generators.get(countryCode);
  }

  /**
   * Get all registered country codes
   */
  public getRegisteredCountries(): string[] {
    return Array.from(this.generators.keys());
  }

  /**
   * Check if a country is registered
   */
  public isCountryRegistered(countryCode: string): boolean {
    return this.generators.has(countryCode);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  public clear(): void {
    this.generators.clear();
  }
}