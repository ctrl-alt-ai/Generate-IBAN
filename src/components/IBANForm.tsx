import React, { useState, useEffect } from 'react';
import { IBAN_SPECS, COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { getSuggestedCountry } from '../utils/ibanGenerator';
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

export const IBANForm: React.FC<IBANFormProps> = ({ onGenerate, isGenerating, errors }) => {
  const [formData, setFormData] = useState<FormData>({
    country: getSuggestedCountry(),
    bank: '',
    quantity: 1,
  });
  
  const [showBankSelector, setShowBankSelector] = useState(false);
  const [availableBanks, setAvailableBanks] = useState<{ [key: string]: BankInfo }>({});

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

        <div className="form-group">
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleCountryChange}
            required
            aria-describedby="country-help country-error"
            aria-invalid={errors.country ? 'true' : 'false'}
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
          {errors.country && (
            <p id="country-error" className="error-message has-error" role="alert">
              {errors.country}
            </p>
          )}
        </div>

        {showBankSelector && (
          <div className="form-group" id="bank-container">
            <label htmlFor="bank">Bank:</label>
            <select
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleBankChange}
              aria-describedby="bank-help bank-error"
              aria-invalid={errors.bank ? 'true' : 'false'}
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
            {errors.bank && (
              <p id="bank-error" className="error-message has-error" role="alert">
                {errors.bank}
              </p>
            )}
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

        <div className="form-group">
          <label htmlFor="quantity">Number of IBANs to generate:</label>
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
            aria-describedby="quantity-help quantity-error"
            aria-invalid={errors.quantity ? 'true' : 'false'}
          />
          <p id="quantity-help" className="help-text">
            Enter a number between 1 and 100.
          </p>
          {errors.quantity && (
            <p id="quantity-error" className="error-message has-error" role="alert">
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
            className="btn btn-primary"
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate IBAN(s)'}
          </button>
        </div>
      </fieldset>
    </form>
  );
};