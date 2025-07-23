import React, { useState, useEffect } from 'react';
import { IBAN_SPECS, COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { getSuggestedCountry } from '../utils/ibanGenerator';
import type { BankInfo, FormData } from '../utils/types';

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface FormValidationState {
  country: ValidationState;
  bank: ValidationState;
  quantity: ValidationState;
  general: ValidationState;
}

interface IBANFormProps {
  onGenerate: (data: FormData) => void;
  onFormDataChange: (data: FormData) => void;
  isGenerating: boolean;
  validationState: FormValidationState;
}

export const IBANForm: React.FC<IBANFormProps> = ({ 
  onGenerate, 
  onFormDataChange, 
  isGenerating, 
  validationState 
}) => {
  const [formData, setFormData] = useState<FormData>({
    country: getSuggestedCountry(),
    bank: '',
    quantity: 1,
  });
  
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<{ [key: string]: BankInfo }>({});

  // Update parent component when form data changes
  useEffect(() => {
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  // Update bank selector when country changes
  useEffect(() => {
    const banksForCountry = BANK_DATA[formData.country];
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
  }, [formData.country]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      country: event.target.value,
    }));
  };

  const handleBankChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      bank: event.target.value,
    }));
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      quantity: parseInt(event.target.value) || 1,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGenerate(formData);
  };

  // Sort countries by display name
  const sortedCountries = Object.keys(IBAN_SPECS).sort((a, b) =>
    (COUNTRY_NAMES[a] || a).localeCompare(COUNTRY_NAMES[b] || b)
  );

  // Sort banks by name
  const sortedBanks = Object.entries(availableBanks).sort((a, b) =>
    (a[1].name || a[0]).localeCompare(b[1].name || b[0])
  );

  return (
    <form id="iban-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend className="form-section-heading">Generator Settings</legend>

        <div className={`form-group has-validation ${validationState.country.isValid ? 'is-valid' : 'is-invalid'}`}>
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            name="country"
            className="form-input"
            value={formData.country}
            onChange={handleCountryChange}
            required
            aria-describedby="country-help country-validation"
            aria-invalid={!validationState.country.isValid}
          >
            {sortedCountries.map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {COUNTRY_NAMES[countryCode] || countryCode}
              </option>
            ))}
          </select>
          <p id="country-help" className="help-text">
            Select the country for the IBAN.
          </p>
          <p id="country-validation" className={`validation-message ${validationState.country.isValid ? 'success' : 'error'}`}>
            {validationState.country.message}
          </p>
        </div>

        {showBankSelector && (
          <div className={`form-group has-validation ${validationState.bank.isValid ? 'is-valid' : 'is-invalid'}`} id="bank-container">
            <label htmlFor="bank">Bank:</label>
            <select
              id="bank"
              name="bank"
              className="form-input"
              value={formData.bank}
              onChange={handleBankChange}
              aria-describedby="bank-help bank-validation"
              aria-invalid={!validationState.bank.isValid}
            >
              {sortedBanks.map(([bic, bank]) => (
                <option key={bic} value={bic}>
                  {bank.name || bic}
                </option>
              ))}
            </select>
            <p id="bank-help" className="help-text">
              Optional: Select a bank for {COUNTRY_NAMES[formData.country] || formData.country}.
            </p>
            <p id="bank-validation" className={`validation-message ${validationState.bank.isValid ? 'success' : 'error'}`}>
              {validationState.bank.message}
            </p>
          </div>
        )}

        {!showBankSelector && (
          <div className="form-group">
            <p className="help-text">
              No specific banks available for {COUNTRY_NAMES[formData.country] || formData.country}. 
              A random valid bank code will be used.
            </p>
          </div>
        )}

        <div className={`form-group has-validation ${validationState.quantity.isValid ? 'is-valid' : 'is-invalid'}`}>
          <label htmlFor="quantity">Number of IBANs to generate:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="form-input"
            value={formData.quantity}
            min="1"
            max="100"
            onChange={handleQuantityChange}
            required
            autoComplete="off"
            aria-describedby="quantity-help quantity-validation"
            aria-invalid={!validationState.quantity.isValid}
          />
          <p id="quantity-help" className="help-text">
            Enter a number between 1 and 100.
          </p>
          <p id="quantity-validation" className={`validation-message ${validationState.quantity.isValid ? 'success' : 'error'}`}>
            {validationState.quantity.message}
          </p>
        </div>

        {validationState.general.message && (
          <div className="form-group">
            <p className={`error-message ${validationState.general.isValid ? '' : 'has-error'}`} role="alert">
              {validationState.general.message}
            </p>
          </div>
        )}

        <div className="form-group button-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate IBAN(s)'}
          </button>
          <p className="keyboard-shortcut-hint">
            or press <kbd>Ctrl+Enter</kbd>
          </p>
        </div>
      </fieldset>
    </form>
  );
};