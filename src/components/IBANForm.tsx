import React, { useState, useEffect, useDeferredValue, startTransition, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { getSuggestedCountry } from '../utils/ibanGenerator';
import { MAX_QUANTITY } from '../utils/validation';
import { useFormValidation } from '../hooks/useFormValidation';
import { SkeletonLoader } from './SkeletonLoader';
import { CountryGeneratorFactory } from '../generators/CountryGeneratorFactory';
import type { BankInfo, FormData } from '../utils/types';

// Create factory instance outside component to avoid re-instantiation on every render
const countryGeneratorFactory = new CountryGeneratorFactory();

interface IBANFormProps {
  onGenerate: (data: FormData) => void;
  isGenerating: boolean;
  errors: {
    country?: string;
    bank?: string;
    quantity?: string;
    general?: string;
  };
}

export const IBANForm: React.FC<IBANFormProps> = memo(({ onGenerate, isGenerating, errors }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    country: getSuggestedCountry(),
    bank: '',
    quantity: 1,
  });
  
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<{ [key: string]: BankInfo }>({});
  const [isBanksLoading, setIsBanksLoading] = useState(false);

  // Use React 18 performance features
  const deferredFormData = useDeferredValue(formData);
  const { isFormValid, getFieldValidation } = useFormValidation(deferredFormData);

  // Update bank selector when country changes
  useEffect(() => {
    const banksForCountry = BANK_DATA[formData.country];
    setIsBanksLoading(true);
    
    startTransition(() => {
      if (banksForCountry && Object.keys(banksForCountry).length > 0) {
        setAvailableBanks(banksForCountry);
        setShowBankSelector(true);
        
        // Only set first bank as default if no bank is currently selected or if the current bank is not available for this country
        setFormData(prev => {
          const currentBank = prev.bank;
          const isCurrentBankAvailable = currentBank && banksForCountry[currentBank];
          
          if (!currentBank || !isCurrentBankAvailable) {
            // Set first bank as default
            const firstBankKey = Object.keys(banksForCountry)[0];
            return { ...prev, bank: firstBankKey };
          }
          
          // Keep the current bank selection
          return prev;
        });
      } else {
        setAvailableBanks({});
        setShowBankSelector(false);
        setFormData(prev => ({ ...prev, bank: '' }));
      }
      setIsBanksLoading(false);
    });
  }, [formData.country]);

  const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      country: event.target.value,
    }));
  }, []);

  const handleBankChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      bank: event.target.value,
    }));
  }, []);

  const handleQuantityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    setFormData(prev => ({
      ...prev,
      quantity: value,
    }));
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid && !isGenerating) {
      onGenerate(deferredFormData);
    }
  }, [isFormValid, isGenerating, onGenerate, deferredFormData]);


  // Memoized sorted countries to prevent unnecessary re-renders
  const sortedCountries = React.useMemo(() => {
    return countryGeneratorFactory.getAvailableCountries().sort((a: string, b: string) =>
      (COUNTRY_NAMES[a] || a).localeCompare(COUNTRY_NAMES[b] || b)
    );
  }, []);

  // Memoized sorted banks
  const sortedBanks = React.useMemo(() => 
    Object.entries(availableBanks).sort((a, b) =>
      (a[1].name || a[0]).localeCompare(b[1].name || b[0])
    ), [availableBanks]
  );

  return (
    <form id="iban-form" onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend className="form-section-heading">{t('form.legend')}</legend>

        <div className="form-group has-validation form-field-enhanced">
          <label htmlFor="country">{t('form.country.label')}</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            required
            aria-describedby="country-help"
            aria-invalid={getFieldValidation('country')?.type === 'error' ? 'true' : 'false'}
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
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleBankChange}
              aria-describedby="bank-help"
              aria-invalid={getFieldValidation('bank')?.type === 'error' ? 'true' : 'false'}
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