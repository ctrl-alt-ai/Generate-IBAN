import { CountryGenerator } from './CountryGenerator';
import { NetherlandsGenerator } from './NetherlandsGenerator';
import { GermanyGenerator } from './GermanyGenerator';
import { BelgiumGenerator } from './BelgiumGenerator';
import { FranceGenerator } from './FranceGenerator';
import { SpainGenerator } from './SpainGenerator';
import { ItalyGenerator } from './ItalyGenerator';
import { AustriaGenerator } from './AustriaGenerator';
import { SwitzerlandGenerator } from './SwitzerlandGenerator';
import { LuxembourgGenerator } from './LuxembourgGenerator';
import { PortugalGenerator } from './PortugalGenerator';
import { UnitedKingdomGenerator } from './UnitedKingdomGenerator';
import { SwedenGenerator } from './SwedenGenerator';
import { NorwayGenerator } from './NorwayGenerator';
import { DenmarkGenerator } from './DenmarkGenerator';
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
    if (specs.AT) {
      this.generators.set('AT', new AustriaGenerator(specs.AT));
    }
    if (specs.CH) {
      this.generators.set('CH', new SwitzerlandGenerator(specs.CH));
    }
    if (specs.LU) {
      this.generators.set('LU', new LuxembourgGenerator(specs.LU));
    }
    if (specs.PT) {
      this.generators.set('PT', new PortugalGenerator(specs.PT));
    }
    if (specs.GB) {
      this.generators.set('GB', new UnitedKingdomGenerator(specs.GB));
    }
    if (specs.SE) {
      this.generators.set('SE', new SwedenGenerator(specs.SE));
    }
    if (specs.NO) {
      this.generators.set('NO', new NorwayGenerator(specs.NO));
    }
    if (specs.DK) {
      this.generators.set('DK', new DenmarkGenerator(specs.DK));
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