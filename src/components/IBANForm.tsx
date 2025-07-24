import React, { useState, useEffect, useDeferredValue, startTransition, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { IBAN_SPECS, COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { getSuggestedCountry } from '../utils/ibanGenerator';
import { useFormValidation } from '../hooks/useFormValidation';
import { SkeletonLoader } from './SkeletonLoader';
import type { BankInfo, FormData } from '../utils/types';

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

  // Memoized bank loading function
  const loadBanksForCountry = useCallback((country: string) => {
    setIsBanksLoading(true);
    
    // Simulate async bank loading (in a real app, this might be an API call)
    startTransition(() => {
      const banksForCountry = BANK_DATA[country];
      if (banksForCountry && Object.keys(banksForCountry).length > 0) {
        setAvailableBanks(banksForCountry);
        setShowBankSelector(true);
        // Set first bank as default
        const firstBankKey = Object.keys(banksForCountry)[0];
        setFormData(prev => ({ ...prev, bank: firstBankKey }));
      } else {
        setAvailableBanks({});
        setShowBankSelector(false);
        setFormData(prev => ({ ...prev, bank: '' }));
      }
      setIsBanksLoading(false);
    });
  }, []);

  // Update bank selector when country changes
  useEffect(() => {
    loadBanksForCountry(formData.country);
  }, [formData.country, loadBanksForCountry]);

  const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setFormData(prev => ({
        ...prev,
        country: event.target.value,
      }));
    });
  }, []);

  const handleBankChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setFormData(prev => ({
        ...prev,
        bank: event.target.value,
      }));
    });
  }, []);

  const handleQuantityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    startTransition(() => {
      setFormData(prev => ({
        ...prev,
        quantity: value,
      }));
    });
  }, []);

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    if (isFormValid && !isGenerating) {
      onGenerate(deferredFormData);
    }
  }, [isFormValid, isGenerating, onGenerate, deferredFormData]);

  // Memoized validation message component - only show errors and warnings
  const ValidationMessage = memo(({ validation }: { validation: ReturnType<typeof getFieldValidation> }) => {
    if (!validation || validation.type === 'success') return null;
    
    return (
      <p className={`validation-message ${validation.type}`} role={validation.type === 'error' ? 'alert' : 'status'}>
        {validation.type === 'error' && '⚠️ '}
        {validation.type === 'warning' && '⚠️ '}
        {validation.message}
      </p>
    );
  });

  // Memoized sorted countries to prevent unnecessary re-renders
  const sortedCountries = React.useMemo(() => 
    Object.keys(IBAN_SPECS).sort((a, b) =>
      (COUNTRY_NAMES[a] || a).localeCompare(COUNTRY_NAMES[b] || b)
    ), []
  );

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
            aria-describedby="country-help country-validation"
            aria-invalid={getFieldValidation('country')?.type === 'error' ? 'true' : 'false'}
            className={getFieldValidation('country')?.type === 'error' ? 'invalid' : ''}
          >
            {sortedCountries.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {COUNTRY_NAMES[countryCode] || countryCode}
              </option>
            ))}
          </select>
          <p id="country-help" className="help-text">
            {t('form.country.help')}
          </p>
          <div id="country-validation">
            <ValidationMessage validation={getFieldValidation('country')} />
          </div>
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
              aria-describedby="bank-help bank-validation"
              aria-invalid={getFieldValidation('bank')?.type === 'error' ? 'true' : 'false'}
              className={getFieldValidation('bank')?.type === 'error' ? 'invalid' : ''}
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
            <div id="bank-validation">
              <ValidationMessage validation={getFieldValidation('bank')} />
            </div>
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
            aria-describedby="quantity-help quantity-validation"
            aria-invalid={getFieldValidation('quantity')?.type === 'error' ? 'true' : 'false'}
            className={getFieldValidation('quantity')?.type === 'error' ? 'invalid' : ''}
          />
          <p id="quantity-help" className="help-text">
            {t('form.quantity.help')}
          </p>
          <div id="quantity-validation">
            <ValidationMessage validation={getFieldValidation('quantity')} />
          </div>
          {errors.quantity && (
            <p className="error-message has-error" role="alert">
              {errors.quantity}
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