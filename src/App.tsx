import { useState } from 'react';
import { IBANForm } from './components/IBANForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { generateIBAN } from './utils/ibanGenerator';
import { BANK_DATA, COUNTRY_NAMES } from './utils/constants';
import type { FormData } from './utils/types';
import './styles/App.css';

function App() {
  const [results, setResults] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('NL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<{
    country?: string;
    bank?: string;
    quantity?: string;
    general?: string;
  }>({});

  const validateForm = (data: FormData): boolean => {
    const newErrors: typeof errors = {};

    if (!data.country) {
      newErrors.country = 'Please select a valid country.';
    }

    if (isNaN(data.quantity) || data.quantity < 1 || data.quantity > 100) {
      newErrors.quantity = 'Please enter a number between 1 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async (data: FormData) => {
    // Clear previous results and errors
    setResults([]);
    setErrors({});
    setCurrentCountry(data.country);

    if (!validateForm(data)) {
      return;
    }

    setIsGenerating(true);

    try {
      // Get bank info if selected
      const bankInfo = data.bank && BANK_DATA[data.country] 
        ? BANK_DATA[data.country][data.bank] 
        : null;

      const newResults: string[] = [];
      let failures = 0;

      // Generate IBANs
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
            general: `Note: ${failures} out of ${data.quantity} IBANs could not be generated.`
          });
        }
      } else {
        setErrors({
          general: `Failed to generate any IBANs for ${COUNTRY_NAMES[data.country] || data.country}.`
        });
      }
    } catch (error) {
      console.error('Error generating IBANs:', error);
      setErrors({
        general: 'An unexpected error occurred while generating IBANs. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Skip Navigation Link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <main id="main-content">
        <div className="container">
          <header role="banner">
            <h1>IBAN Generator</h1>
            <p className="subtitle">Generate valid IBAN numbers for testing purposes</p>
          </header>

          <div className="card">
            <noscript>
              <p className="error-message has-error">
                JavaScript is required for this tool to function. Please enable JavaScript in your
                browser.
              </p>
            </noscript>

            <IBANForm 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              errors={errors}
            />

            <ResultsDisplay 
              results={results}
              country={currentCountry}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
