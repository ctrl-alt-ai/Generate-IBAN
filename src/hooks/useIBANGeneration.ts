import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { generateIBAN } from '../utils/ibanGenerator';
import { BANK_DATA, COUNTRY_NAMES } from '../utils/constants';
import type { FormData } from '../utils/types';

export interface GenerationErrors {
  country?: string;
  bank?: string;
  quantity?: string;
  general?: string;
}

export const useIBANGeneration = () => {
  const { t } = useTranslation();
  const [results, setResults] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('NL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<GenerationErrors>({});

  const validateForm = useCallback(
    (data: FormData): boolean => {
      const newErrors: GenerationErrors = {};
      if (!data.country) {
        newErrors.country = t('errors.selectCountry');
      }
      if (isNaN(data.quantity) || data.quantity < 1 || data.quantity > 100) {
        newErrors.quantity = t('errors.invalidQuantity');
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [t]
  );

  const generate = useCallback(
    async (data: FormData) => {
      setResults([]);
      setErrors({});
      setCurrentCountry(data.country);
      if (!validateForm(data)) {
        return;
      }

      setIsGenerating(true);
      try {
        const bankInfo =
          data.bank && BANK_DATA[data.country]
            ? BANK_DATA[data.country][data.bank]
            : null;
        const newResults: string[] = [];
        let failures = 0;
        for (let i = 0; i < data.quantity; i++) {
          const iban = generateIBAN(data.country, bankInfo);
          if (iban) {
            newResults.push(iban);
          } else {
            failures++;
          }
        }
        if (newResults.length > 0) {
          setResults(newResults);
          if (failures > 0 && data.quantity > 1) {
            setErrors({
              general: t('errors.partialFailure', { failures, total: data.quantity }),
            });
          }
        } else {
          setErrors({
            general: t('errors.generateFailed', {
              country: COUNTRY_NAMES[data.country] || data.country,
            }),
          });
        }
      } catch (error) {
        console.error('Error generating IBANs:', error);
        setErrors({ general: t('errors.unexpectedError') });
      } finally {
        setIsGenerating(false);
      }
    },
    [t, validateForm]
  );

  return { results, currentCountry, isGenerating, errors, generate };
};

