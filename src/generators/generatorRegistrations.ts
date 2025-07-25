import { GeneratorRegistry } from './GeneratorRegistry';
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

/**
 * Register all available country generators
 * This pattern makes it easier to add new generators without modifying factory code
 */
export function registerAllGenerators(): void {
  const registry = GeneratorRegistry.getInstance();
  
  // Register each generator with its country code
  registry.register('NL', NetherlandsGenerator);
  registry.register('DE', GermanyGenerator);
  registry.register('BE', BelgiumGenerator);
  registry.register('FR', FranceGenerator);
  registry.register('ES', SpainGenerator);
  registry.register('IT', ItalyGenerator);
  registry.register('AT', AustriaGenerator);
  registry.register('CH', SwitzerlandGenerator);
  registry.register('LU', LuxembourgGenerator);
  registry.register('PT', PortugalGenerator);
  registry.register('GB', UnitedKingdomGenerator);
  registry.register('SE', SwedenGenerator);
  registry.register('NO', NorwayGenerator);
  registry.register('DK', DenmarkGenerator);
}

// Auto-register on module load
registerAllGenerators();