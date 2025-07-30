import React, {
  useState,
  useEffect,
  useDeferredValue,
  startTransition,
  memo,
  useCallback,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { getSuggestedCountry } from '../utils/ibanGenerator';
import { MAX_QUANTITY } from '../utils/validation';
import { useFormValidation } from '../hooks/useFormValidation';
import { SkeletonLoader } from './SkeletonLoader';
import { CountryGeneratorFactory } from '../generators/CountryGeneratorFactory';
import type { BankInfo, FormData } from '../utils/types';
import { sanitizeErrorMessage } from '../utils/sanitize';

interface CountrySelectorProps {
  sortedCountries: string[];
  selectedCountry: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  errors: { country?: string };
  getFieldValidation: (field: string) => { type: string } | null;
  t: (key: string, options?: any) => string;
  countrySelectRef: React.RefObject<HTMLSelectElement>;
}

const CountrySelector = memo(
  ({
    sortedCountries,
    selectedCountry,
    onChange,
    errors,
    getFieldValidation,
    t,
    countrySelectRef,
  }: CountrySelectorProps) => (
    <div className="form-group has-validation form-field-enhanced">
      <label htmlFor="country">{t('form.country.label')}</label>
      <select
        ref={countrySelectRef}
        id="country"
        name="country"
        value={selectedCountry}
        onChange={onChange}
        required
        tabIndex={0}
        aria-describedby="country-help"
        aria-invalid={getFieldValidation('country')?.type === 'error' ? 'true' : 'false'}
        aria-expanded="false"
        className={
          getFieldValidation('country')?.type === 'error'
            ? 'invalid'
            : getFieldValidation('country')?.type === 'success'
            ? 'valid'
            : ''
        }
      >
        {sortedCountries.map(countryCode => (
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
  )
);

interface BankSelectorProps {
  isBanksLoading: boolean;
  showBankSelector: boolean;
  sortedBanks: [string, BankInfo][];
  selectedBank: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  errors: { bank?: string };
  getFieldValidation: (field: string) => { type: string } | null;
  t: (key: string, options?: any) => string;
  bankSelectRef: React.RefObject<HTMLSelectElement>;
  selectedCountry: string;
}

const BankSelector = memo(
  ({
    isBanksLoading,
    showBankSelector,
    sortedBanks,
    selectedBank,
    onChange,
    errors,
    getFieldValidation,
    t,
    bankSelectRef,
    selectedCountry,
  }: BankSelectorProps) => {
    if (isBanksLoading) {
      return (
        <div className="form-group">
          <label>{t('form.bank.label')}</label>
          <SkeletonLoader rows={1} />
          <p className="help-text">{t('form.bank.loading')}</p>
        </div>
      );
    }

    if (!showBankSelector) {
      return (
        <div className="form-group">
          <p className="help-text">
            {t('form.bank.noSpecificBanks', {
              country: COUNTRY_NAMES[selectedCountry] || selectedCountry,
            })}
          </p>
        </div>
      );
    }

    return (
      <div className="form-group has-validation form-field-enhanced" id="bank-container">
        <label htmlFor="bank">{t('form.bank.label')}</label>
        <select
          ref={bankSelectRef}
          id="bank"
          name="bank"
          value={selectedBank}
          onChange={onChange}
          tabIndex={0}
          aria-describedby="bank-help"
          aria-invalid={getFieldValidation('bank')?.type === 'error' ? 'true' : 'false'}
          aria-expanded="false"
          className={
            getFieldValidation('bank')?.type === 'error'
              ? 'invalid'
              : getFieldValidation('bank')?.type === 'success'
              ? 'valid'
              : ''
          }
        >
          {sortedBanks.map(([bic, bank]) => (
            <option key={bic} value={bic}>
              {bank.name || bic}
            </option>
          ))}
        </select>
        <p id="bank-help" className="help-text">
          {t('form.bank.help', { country: COUNTRY_NAMES[selectedCountry] || selectedCountry })}
        </p>
        {errors.bank && (
          <p className="error-message has-error" role="alert">
            {errors.bank}
          </p>
        )}
      </div>
    );
  }
);

interface QuantityInputProps {
  quantity: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  getFieldValidation: (field: string) => { type: string; message?: string } | null;
  deferredQuantity: number;
  t: (key: string, options?: any) => string;
}

const QuantityInput = memo(({ quantity, onChange, getFieldValidation, deferredQuantity, t }: QuantityInputProps) => (
  <div className="form-group has-validation form-field-enhanced">
    <label htmlFor="quantity">{t('form.quantity.label')}</label>
    <input
      type="number"
      id="quantity"
      name="quantity"
      value={quantity}
      min="1"
      max="100"
      onChange={onChange}
      required
      autoComplete="off"
      aria-describedby="quantity-help"
      aria-invalid={getFieldValidation('quantity')?.type === 'error' ? 'true' : 'false'}
      className={
        getFieldValidation('quantity')?.type === 'error'
          ? 'invalid'
          : getFieldValidation('quantity')?.type === 'success'
          ? 'valid'
          : ''
      }
    />
    <p id="quantity-help" className="help-text">
      {t('form.quantity.help')}
    </p>
    {getFieldValidation('quantity')?.type === 'error' && (
      <p className={`error-message has-error ${deferredQuantity > MAX_QUANTITY ? 'critical' : ''}`} role="alert">
        {getFieldValidation('quantity')?.message}
      </p>
    )}
  </div>
));

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

  const [selectedCountry, setSelectedCountry] = useState(getSuggestedCountry());
  const [selectedBank, setSelectedBank] = useState('');
  const [quantity, setQuantity] = useState(1);

  const formData: FormData = {
    country: selectedCountry,
    bank: selectedBank,
    quantity,
  };
  
  // Bank selector state management for dynamic bank loading
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<{ [key: string]: BankInfo }>({});
  const [isBanksLoading, setIsBanksLoading] = useState(false);
  
  // Refs for proper focus management and preventing unmounted component updates
  const countrySelectRef = useRef<HTMLSelectElement>(null);
  const bankSelectRef = useRef<HTMLSelectElement>(null);
  const isMountedRef = useRef(true);
  
  // 🐛 FIX: Properly manage update timeout reference
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // React 18 performance optimizations: deferred values and concurrent features
  const deferredFormData = useDeferredValue(formData);
  const { isFormValid, getFieldValidation } = useFormValidation(deferredFormData);

  // 🐛 FIX: Proper cleanup on unmount to prevent memory leaks and race conditions
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = null;
      }
    };
  }, []);

  // Dynamic bank loading effect: updates available banks when country changes
  // Uses startTransition for improved UX during rapid country switching
  useEffect(() => {
    // 🐛 FIX: Clear any pending timeout before starting new bank loading
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }

    const banksForCountry = BANK_DATA[selectedCountry];
    setIsBanksLoading(true);
    
    // 🐛 FIX: Use timeout to prevent race conditions during rapid country switching
    updateTimeoutRef.current = setTimeout(() => {
      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;
      
      // Wrap state updates in startTransition to prevent blocking UI updates
      startTransition(() => {
        if (banksForCountry && Object.keys(banksForCountry).length > 0) {
          setAvailableBanks(banksForCountry);
          setShowBankSelector(true);

          const isCurrentBankValid = selectedBank && banksForCountry[selectedBank];
          const firstBankKey = Object.keys(banksForCountry)[0];
          setSelectedBank(isCurrentBankValid ? selectedBank : firstBankKey);
        } else {
          // Handle countries without specific bank data
          setAvailableBanks({});
          setShowBankSelector(false);
          setSelectedBank('');
        }
        
        setIsBanksLoading(false);
        updateTimeoutRef.current = null; // Clear reference after completion
      });
    }, 100); // Small delay to debounce rapid changes

  }, [selectedCountry]);

  const handleCountryChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    event.stopPropagation();
    setSelectedCountry(event.target.value);
  }, []);

  const handleBankChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    event.stopPropagation();
    setSelectedBank(event.target.value);
  }, []);

  const handleQuantityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const value = parseInt(event.target.value) || 1;
    setQuantity(value);
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

        <CountrySelector
          sortedCountries={sortedCountries}
          selectedCountry={selectedCountry}
          onChange={handleCountryChange}
          errors={errors}
          getFieldValidation={getFieldValidation}
          t={t}
          countrySelectRef={countrySelectRef}
        />

        <BankSelector
          isBanksLoading={isBanksLoading}
          showBankSelector={showBankSelector}
          sortedBanks={sortedBanks}
          selectedBank={selectedBank}
          onChange={handleBankChange}
          errors={errors}
          getFieldValidation={getFieldValidation}
          t={t}
          bankSelectRef={bankSelectRef}
          selectedCountry={selectedCountry}
        />

        <QuantityInput
          quantity={quantity}
          onChange={handleQuantityChange}
          getFieldValidation={getFieldValidation}
          deferredQuantity={deferredFormData.quantity}
          t={t}
        />

        {errors.general && (
          <div className="form-group">
            <p className="error-message has-error" role="alert">
              {sanitizeErrorMessage(errors.general)}
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