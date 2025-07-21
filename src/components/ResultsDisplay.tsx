import React, { useState } from 'react';
import { formatIBAN } from '../utils/ibanGenerator';

interface ResultsDisplayProps {
  results: string[];
  country: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, country }) => {
  const [copyMessage, setCopyMessage] = useState('');
  const [copyTimeout, setCopyTimeout] = useState<number | null>(null);

  if (results.length === 0) return null;

  const handleCopy = async (iban: string) => {
    const ibanRaw = iban.replace(/\s/g, '');
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(ibanRaw);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('textarea');
        tempInput.value = ibanRaw;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      
      setCopyMessage('Copied!');
      
      // Clear previous timeout
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
      
      // Set new timeout
      const timeout = window.setTimeout(() => {
        setCopyMessage('');
      }, 3000);
      
      setCopyTimeout(timeout);
      
    } catch (err) {
      console.error('Copy failed:', err);
      setCopyMessage('Copy failed');
      
      if (copyTimeout) {
        clearTimeout(copyTimeout);
      }
      
      const timeout = window.setTimeout(() => {
        setCopyMessage('');
      }, 3000);
      
      setCopyTimeout(timeout);
    }
  };

  const handleDownload = () => {
    try {
      const text = results.join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iban-results-${country}-${results.length}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error downloading bulk:', e);
    }
  };

  const CopyIcon = () => (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  if (results.length === 1) {
    // Single IBAN result
    return (
      <div className="result-section" role="region" aria-labelledby="result-heading">
        <h2 id="result-heading" className="form-section-heading">Generated Results</h2>
        
        <div id="single-result-container">
          <h3>Generated IBAN</h3>
          <div className="iban-result">
            <div className="iban-display">
              <span className="iban-text" aria-live="polite">
                {formatIBAN(results[0])}
              </span>
              <button
                type="button"
                className="copy-btn"
                title="Copy to clipboard"
                aria-label="Copy IBAN to clipboard"
                onClick={() => handleCopy(results[0])}
              >
                <CopyIcon />
              </button>
            </div>
            {copyMessage && (
              <p className="copy-message" role="status" aria-live="polite">
                {copyMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Multiple IBAN results
  return (
    <div className="result-section" role="region" aria-labelledby="result-heading">
      <h2 id="result-heading" className="form-section-heading">Generated Results</h2>
      
      <div className="bulk-result-container">
        <h3>Generated IBANs ({results.length})</h3>
        <div className="form-group">
          <label htmlFor="bulk-ibans">Results:</label>
          <textarea
            id="bulk-ibans"
            className="bulk-ibans"
            rows={10}
            readOnly
            value={results.join('\n')}
            aria-describedby="bulk-ibans-help"
            aria-label="Generated IBANs"
          />
          <p id="bulk-ibans-help" className="help-text">
            Generated IBANs, one per line.
          </p>
        </div>
        <div className="form-group button-group">
          <button 
            type="button" 
            className="btn btn-secondary download-bulk"
            onClick={handleDownload}
          >
            Download Results (.txt)
          </button>
        </div>
      </div>
    </div>
  );
};