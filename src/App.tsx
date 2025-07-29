import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBANForm } from './components/IBANForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ProgressIndicator } from './components/ProgressIndicator';
import { generateIBAN } from './utils/ibanGenerator';
import { BANK_DATA, COUNTRY_NAMES } from './utils/constants';
import type { FormData } from './utils/types';
import './styles/App.css';

function App() {
  const { t } = useTranslation();
  const [results, setResults] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('NL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errors, setErrors] = useState<{
    country?: string;
    bank?: string;
    quantity?: string;
    general?: string;
  }>({});

  const validateForm = (data: FormData): boolean => {
    const newErrors: typeof errors = {};

    if (!data.country) {
      newErrors.country = t('errors.selectCountry');
    }

    if (isNaN(data.quantity) || data.quantity < 1 || data.quantity > 100) {
      newErrors.quantity = t('errors.invalidQuantity');
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
    const showProgress = data.quantity > 50;
    
    if (showProgress) {
      setProgress({ current: 0, total: data.quantity });
    }

    try {
      // Get bank info if selected
      const bankInfo = data.bank && BANK_DATA[data.country] 
        ? BANK_DATA[data.country][data.bank] 
        : null;

      const newResults: string[] = [];
      let failures = 0;

      // Generate IBANs with progress updates
      for (let i = 0; i < data.quantity; i++) {
        const iban = generateIBAN(data.country, bankInfo);
        if (iban) {
          newResults.push(iban);
        } else {
          failures++;
        }

        // Update progress for large quantities
        if (showProgress) {
          setProgress({ current: i + 1, total: data.quantity });
          // Add small delay to improve UI responsiveness for large quantities
          if (i % 10 === 0 && i > 0 && isGenerating) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
      }

      if (newResults.length > 0) {
        setResults(newResults);
        
        if (failures > 0 && data.quantity > 1) {
          setErrors({
            general: t('errors.partialFailure', { failures, total: data.quantity })
          });
        }
      } else {
        setErrors({
          general: t('errors.generateFailed', { country: COUNTRY_NAMES[data.country] || data.country })
        });
      }
    } catch (error) {
      console.error('Error generating IBANs:', error);
      setErrors({
        general: t('errors.unexpectedError')
      });
    } finally {
      setIsGenerating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  const handleClearResults = () => {
    setResults([]);
    setErrors({});
  };

  return (
    <>
      {/* Skip Navigation Link for accessibility */}
      <a href="#main-content" className="skip-link">{t('skipToContent')}</a>

      <main id="main-content">
        <div className="container">
          <header role="banner">
            <div className="header-content">
              <div className="title-section">
                <h1>{t('title')}</h1>
                <p className="subtitle">{t('subtitle')}</p>
              </div>
            </div>
          </header>

          <div className="card">
            <noscript>
              <p className="error-message has-error">
                {t('errors.jsRequired')}
              </p>
            </noscript>

            <IBANForm 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              errors={errors}
            />

            <ProgressIndicator 
              current={progress.current}
              total={progress.total}
              isVisible={isGenerating && progress.total > 50}
            />

            <ResultsDisplay 
              results={results}
              country={currentCountry}
              onClear={handleClearResults}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
