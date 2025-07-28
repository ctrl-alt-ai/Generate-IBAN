import React, { useState, useEffect, useDeferredValue, startTransition, memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { getSuggestedCountry } from '../utils/ibanGenerator';
import { MAX_QUANTITY } from '../utils/validation';
import { useFormValidation } from '../hooks/useFormValidation';
import { SkeletonLoader } from './SkeletonLoader';
import { CountryGeneratorFactory } from '../generators/CountryGeneratorFactory';
import type { BankInfo, FormData } from '../utils/types';

/**
 * Factory instance created outside component scope to prevent re-instantiation
 * This optimization ensures the factory is only created once across all form renders
 */
const countryGeneratorFactory = new CountryGeneratorFactory();

/**
 * Props interface for the IBANForm component
 * Defines the contract for form interactions and error handling
 */
interface IBANFormProps {
  /** Callback function called when form is submitted with valid data */
  onGenerate: (data: FormData) => void;
  /** Flag indicating if IBAN generation is currently in progress */
  isGenerating: boolean;
  /** Object containing field-specific and general error messages */
  errors: {
    country?: string;
    bank?: string;
    quantity?: string;
    general?: string;
  };
}

export const IBANForm: React.FC<IBANFormProps> = memo(({ onGenerate, isGenerating, errors }) => {
  const { t } = useTranslation();
  
  // Initialize form state with suggested country based on user's locale
  const [formData, setFormData] = useState<FormData>({
    country: getSuggestedCountry(),
    bank: '',
    quantity: 1,
  });
  
  // Bank selector state management for dynamic bank loading
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<{ [key: string]: BankInfo }>({});
  const [isBanksLoading, setIsBanksLoading] = useState(false);
  
  // Refs for proper focus management and preventing unmounted component updates
  const countrySelectRef = useRef<HTMLSelectElement>(null);
  const bankSelectRef = useRef<HTMLSelectElement>(null);
  const isMountedRef = useRef(true);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // React 18 performance optimizations: deferred values and concurrent features
  const deferredFormData = useDeferredValue(formData);
  const { isFormValid, getFieldValidation } = useFormValidation(deferredFormData);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    const timeoutRef = updateTimeoutRef.current;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  // Dynamic bank loading effect: updates available banks when country changes
  // Uses startTransition for improved UX during rapid country switching
  useEffect(() => {
    const banksForCountry = BANK_DATA[formData.country];
    setIsBanksLoading(true);
    
    // Wrap state updates in startTransition to prevent blocking UI updates
    startTransition(() => {
      if (banksForCountry && Object.keys(banksForCountry).length > 0) {
        setAvailableBanks(banksForCountry);
        setShowBankSelector(true);
        
        // Smart bank selection: preserve current selection if valid, otherwise pick first available
        setFormData(prev => {
          const currentBank = prev.bank;
          const isCurrentBankValid = currentBank && banksForCountry[currentBank];
          const firstBankKey = Object.keys(banksForCountry)[0];
          
          return {
            ...prev,
            bank: isCurrentBankValid ? currentBank : firstBankKey
          };
        });
      } else {
        // Handle countries without specific bank data
        setAvailableBanks({});
        setShowBankSelector(false);
        setFormData(prev => ({ ...prev, bank: '' }));
      }
      
      setIsBanksLoading(false);
    });
  }, [formData.country]);

  const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    // Prevent event propagation that might interfere with dropdown behavior
    event.stopPropagation();
    
    setFormData(prev => ({
      ...prev,
      country: event.target.value,
    }));
  }, []);

  const handleBankChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    // Prevent event propagation that might interfere with dropdown behavior
    event.stopPropagation();
    
    setFormData(prev => ({
      ...prev,
      bank: event.target.value,
    }));
  }, []);

  const handleQuantityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent event propagation that might interfere with form behavior
    event.stopPropagation();
    const value = parseInt(event.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      quantity: value,
    }));
  }, []);

  // Handle click events on form elements to prevent interference
  const handleFormClick = useCallback((event: React.MouseEvent) => {
    // Only stop propagation for select elements to maintain dropdown functionality
    const target = event.target as HTMLElement;
    if (target.tagName === 'SELECT') {
      event.stopPropagation();
    }
  }, []);

  // Form submission handler with validation checks
  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid && !isGenerating) {
      onGenerate(deferredFormData);
    }
  }, [isFormValid, isGenerating, onGenerate, deferredFormData]);

  // Performance optimization: memoized sorted countries list to prevent unnecessary re-renders
  // Countries are sorted alphabetically by their display names for better UX
  const sortedCountries = React.useMemo(() => {
    return countryGeneratorFactory.getAvailableCountries().sort((a: string, b: string) =>
      (COUNTRY_NAMES[a] || a).localeCompare(COUNTRY_NAMES[b] || b)
    );
  }, []);

  // Performance optimization: memoized sorted banks list that updates when available banks change
  // Banks are sorted alphabetically by name or BIC code for consistent ordering
  const sortedBanks = React.useMemo(() => 
    Object.entries(availableBanks).sort((a, b) =>
      (a[1].name || a[0]).localeCompare(b[1].name || b[0])
    ), [availableBanks]
  );

  return (
    <form id="iban-form" onSubmit={handleSubmit} onClick={handleFormClick} noValidate>
      <fieldset>
        <legend className="form-section-heading">{t('form.legend')}</legend>

        <div className="form-group has-validation form-field-enhanced">
          <label htmlFor="country">{t('form.country.label')}</label>
          <select
            ref={countrySelectRef}
            id="country"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            required
            tabIndex={0}
            aria-describedby="country-help"
            aria-invalid={getFieldValidation('country')?.type === 'error' ? 'true' : 'false'}
            aria-expanded="false"
            className={getFieldValidation('country')?.type === 'error' ? 'invalid' : 
                      getFieldValidation('country')?.type === 'success' ? 'valid' : ''}
          >
            {sortedCountries.map((countryCode: string) => (
              <option key={countryCode} value={countryCode}>
                {COUNTRY_NAMES[countryCode] || countryCode}
              </option>
            ))}
          </select>
          <p id="country-help" className="help-text">
            {t('form.country.help')}
          </p>
          {errors.country && (
            <p className="error-message has-error" role="alert">
              {errors.country}
            </p>
          )}
        </div>

        {isBanksLoading ? (
          <div className="form-group">
            <label>{t('form.bank.label')}</label>
            <SkeletonLoader rows={1} />
            <p className="help-text">{t('form.bank.loading')}</p>
          </div>
        ) : showBankSelector ? (
          <div className="form-group has-validation form-field-enhanced" id="bank-container">
            <label htmlFor="bank">{t('form.bank.label')}</label>
            <select
              ref={bankSelectRef}
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleBankChange}
              tabIndex={0}
              aria-describedby="bank-help"
              aria-invalid={getFieldValidation('bank')?.type === 'error' ? 'true' : 'false'}
              aria-expanded="false"
              className={getFieldValidation('bank')?.type === 'error' ? 'invalid' : 
                        getFieldValidation('bank')?.type === 'success' ? 'valid' : ''}
            >
              {sortedBanks.map(([bic, bank]) => (
                <option key={bic} value={bic}>
                  {bank.name || bic}
                </option>
              ))}
            </select>
            <p id="bank-help" className="help-text">
              {t('form.bank.help', { country: COUNTRY_NAMES[formData.country] || formData.country })}
            </p>
            {errors.bank && (
              <p className="error-message has-error" role="alert">
                {errors.bank}
              </p>
            )}
          </div>
        ) : (
          <div className="form-group">
            <p className="help-text">
              {t('form.bank.noSpecificBanks', { country: COUNTRY_NAMES[formData.country] || formData.country })}
            </p>
          </div>
        )}

        <div className="form-group has-validation form-field-enhanced">
          <label htmlFor="quantity">{t('form.quantity.label')}</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            min="1"
            max="100"
            onChange={handleQuantityChange}
            required
            autoComplete="off"
            aria-describedby="quantity-help"
            aria-invalid={getFieldValidation('quantity')?.type === 'error' ? 'true' : 'false'}
            className={getFieldValidation('quantity')?.type === 'error' ? 'invalid' : 
                      getFieldValidation('quantity')?.type === 'success' ? 'valid' : ''}
          />
          <p id="quantity-help" className="help-text">
            {t('form.quantity.help')}
          </p>
          {getFieldValidation('quantity')?.type === 'error' && (
            <p className={`error-message has-error ${
              deferredFormData.quantity > MAX_QUANTITY ? 'critical' : ''
            }`} role="alert">
              {getFieldValidation('quantity')?.message}
            </p>
          )}
        </div>

        {errors.general && (
          <div className="form-group">
            <p className="error-message has-error" role="alert">
              {errors.general}
            </p>
          </div>
        )}

        <div className="form-group button-group">
          <button 
            type="submit" 
            className={`btn btn-primary ${isGenerating ? 'loading' : ''}`}
            disabled={isGenerating || !isFormValid}
            aria-describedby="submit-help"
          >
            {isGenerating ? t('form.submit.generating') : t('form.submit.generate')}
          </button>
          {!isFormValid && !isGenerating && (
            <p id="submit-help" className="help-text" role="status">
              {t('form.submit.fixErrors')}
            </p>
          )}
        </div>
      </fieldset>
    </form>
  );
});