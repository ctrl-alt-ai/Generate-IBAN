import { useMemo } from 'react';
import { generateIBAN } from '../utils/ibanGenerator';
import type { BankInfo } from '../utils/types';

// Simple memoization cache for IBAN generation
const generationCache = new Map<string, string | null>();
const MAX_CACHE_SIZE = 1000;

/**
 * Hook that provides memoized IBAN generation to avoid expensive recalculations
 * for the same country/bank combinations
 */
export function useMemoizedGeneration() {
  return useMemo(() => {
    const generateMemoized = (country: string, bankInfo?: BankInfo | null): string | null => {
      // Create cache key from country and bank info
      const cacheKey = `${country}-${bankInfo?.code || 'random'}-${bankInfo?.name || ''}`;
      
      // Check cache first
      if (generationCache.has(cacheKey)) {
        return generationCache.get(cacheKey) || null;
      }
      
      // Generate new IBAN
      const result = generateIBAN(country, bankInfo);
      
      // Cache the result (with size limit)
      if (generationCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entry
        const firstKey = generationCache.keys().next().value;
        if (firstKey !== undefined) {
          generationCache.delete(firstKey);
        }
      }
      
      generationCache.set(cacheKey, result);
      return result;
    };

    const clearCache = () => {
      generationCache.clear();
    };

    const getCacheSize = () => generationCache.size;

    return {
      generateMemoized,
      clearCache,
      getCacheSize
    };
  }, []);
}