import React, { useState } from 'react';
import { validateIBAN, getIBANInfo } from '../utils/ibanValidation';
import { COUNTRY_NAMES } from '../utils/constants';
import type { ToastType } from '../hooks/useToast';

interface IBANValidatorProps {
  onToast: (message: string, type: ToastType, duration?: number) => void;
}

export const IBANValidator: React.FC<IBANValidatorProps> = ({ onToast }) => {
  const [inputValue, setInputValue] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Clear previous validation if input is empty
    if (!value.trim()) {
      setValidationResult(null);
      return;
    }

    // Debounced validation (validate as user types but with slight delay)
    setIsValidating(true);
    setTimeout(() => {
      const result = validateIBAN(value);
      setValidationResult(result);
      setIsValidating(false);
    }, 300);
  };

  const handleValidate = () => {
    if (!inputValue.trim()) {
      onToast('Please enter an IBAN to validate', 'warning');
      return;
    }

    const result = validateIBAN(inputValue);
    setValidationResult(result);
    
    if (result.isValid) {
      onToast('IBAN is valid!', 'success');
    } else {
      onToast('IBAN is invalid', 'error');
    }
  };

  const handleCopyInfo = async () => {
    if (!validationResult || !validationResult.isValid) return;

    const info = getIBANInfo(inputValue);
    const infoText = [
      `IBAN: ${validationResult.formatted}`,
      `Country: ${info.country} (${COUNTRY_NAMES[info.country || ''] || 'Unknown'})`,
      `Bank Code: ${info.bankCode || 'N/A'}`,
      `Account Number: ${info.accountNumber || 'N/A'}`,
      `Check Digits: ${info.checkDigits || 'N/A'}`
    ].join('\n');

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(infoText);
        onToast('IBAN information copied to clipboard!', 'success');
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (error) {
      onToast('Failed to copy IBAN information', 'error');
    }
  };

  return (
    <div className="validator-section">
      <h2 className="form-section-heading">IBAN Validator</h2>
      
      <div className="form-group">
        <label htmlFor="iban-input">Enter IBAN to validate:</label>
        <input
          type="text"
          id="iban-input"
          className={`form-input ${validationResult ? (validationResult.isValid ? 'valid' : 'invalid') : ''}`}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="e.g., NL91ABNA0417164300"
          aria-describedby="iban-input-help"
        />
        <p id="iban-input-help" className="help-text">
          Enter a complete IBAN to validate its format and checksum.
        </p>
      </div>

      {isValidating && (
        <div className="validation-status">
          <p className="help-text">Validating...</p>
        </div>
      )}

      {validationResult && !isValidating && (
        <div className={`validation-result ${validationResult.isValid ? 'valid' : 'invalid'}`}>
          <div className="validation-summary">
            <h3>{validationResult.isValid ? '✅ Valid IBAN' : '❌ Invalid IBAN'}</h3>
            
            {validationResult.isValid ? (
              <div className="iban-details">
                <p><strong>Formatted IBAN:</strong> {validationResult.formatted}</p>
                <p><strong>Country:</strong> {validationResult.country} ({COUNTRY_NAMES[validationResult.country] || 'Unknown'})</p>
                {validationResult.bankCode && (
                  <p><strong>Bank Code:</strong> {validationResult.bankCode}</p>
                )}
                {validationResult.accountNumber && (
                  <p><strong>Account Number:</strong> {validationResult.accountNumber}</p>
                )}
                
                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCopyInfo}
                  >
                    Copy IBAN Info
                  </button>
                </div>
              </div>
            ) : (
              <div className="validation-errors">
                <h4>Validation Errors:</h4>
                <ul>
                  {validationResult.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="form-group button-group">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleValidate}
          disabled={!inputValue.trim() || isValidating}
        >
          {isValidating ? 'Validating...' : 'Validate IBAN'}
        </button>
      </div>
    </div>
  );
};