import { CountryGenerator } from './CountryGenerator';
import { CountryNotSupportedError } from '../errors/IBANErrors';
import { ConfigLoader } from '../config/ConfigLoader';
import { GeneratorRegistry } from './GeneratorRegistry';
// Import to trigger registration
import './generatorRegistrations';

/**
 * Factory for creating country-specific IBAN generators
 * Uses a registry pattern for better extensibility and maintainability
 */
export class CountryGeneratorFactory {
  private generators = new Map<string, CountryGenerator>();
  private configLoader: ConfigLoader;
  private registry: GeneratorRegistry;

  constructor() {
    this.configLoader = ConfigLoader.getInstance();
    this.registry = GeneratorRegistry.getInstance();
    this.initializeGenerators();
  }

  /**
   * Initialize all available country generators using the registry
   */
  private initializeGenerators(): void {
    const specs = this.configLoader.getIBANSpecs();
    const registeredCountries = this.registry.getRegisteredCountries();
    
    // Create instances for countries that have both specifications and registered generators
    for (const countryCode of registeredCountries) {
      const spec = specs[countryCode];
      if (spec) {
        const GeneratorClass = this.registry.getGenerator(countryCode);
        if (GeneratorClass) {
          this.generators.set(countryCode, new GeneratorClass(spec));
        }
      }
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

  /**
   * Refresh generators (useful when configuration changes)
   */
  public refresh(): void {
    this.generators.clear();
    this.initializeGenerators();
  }
}