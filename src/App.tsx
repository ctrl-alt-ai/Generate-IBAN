import { useState } from 'react';
import { IBANForm } from './components/IBANForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { IBANValidator } from './components/IBANValidator';
import { IBANHistory } from './components/IBANHistory';
import { ToastContainer } from './components/ToastContainer';
import { BANK_DATA, COUNTRY_NAMES } from './utils/constants';
import { useToast } from './hooks/useToast';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { useMemoizedGeneration } from './hooks/useMemoizedGeneration';
import { useFormValidation } from './hooks/useFormValidation';
import { useIBANHistory } from './hooks/useIBANHistory';
import type { FormData } from './utils/types';
import './styles/App.css';

function App() {
  const [results, setResults] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('NL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'validate' | 'history'>('generate');
  const [formData, setFormData] = useState<FormData>({
    country: 'NL',
    bank: '',
    quantity: 1,
  });

  // Custom hooks
  const { toasts, addToast, removeToast } = useToast();
  const { generateMemoized } = useMemoizedGeneration();
  const { validationState, validateAll, clearValidation, setGeneralError } = useFormValidation();
  const { addToHistory } = useIBANHistory();

  const handleGenerate = async (data: FormData) => {
    // Clear previous results and validation
    setResults([]);
    clearValidation();
    setCurrentCountry(data.country);
    setFormData(data);

    if (!validateAll(data)) {
      addToast('Please fix the form errors before generating IBANs.', 'error');
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

      // Generate IBANs with memoization for performance
      for (let i = 0; i < data.quantity; i++) {
        const iban = generateMemoized(data.country, bankInfo);
        if (iban) {
          newResults.push(iban);
        } else {
          failures++;
        }
      }

      if (newResults.length > 0) {
        setResults(newResults);
        
        // Add to history
        const bankName = data.bank && BANK_DATA[data.country] 
          ? data.bank 
          : undefined;
        addToHistory(newResults, data.country, bankName);
        
        // Success toast
        const successMessage = data.quantity === 1 
          ? 'IBAN generated successfully!'
          : `${newResults.length} IBANs generated successfully!`;
        addToast(successMessage, 'success');
        
        if (failures > 0 && data.quantity > 1) {
          const warningMessage = `Note: ${failures} out of ${data.quantity} IBANs could not be generated.`;
          setGeneralError(warningMessage);
          addToast(warningMessage, 'warning');
        }
      } else {
        const errorMessage = `Failed to generate any IBANs for ${COUNTRY_NAMES[data.country] || data.country}.`;
        setGeneralError(errorMessage);
        addToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Error generating IBANs:', error);
      const errorMessage = 'An unexpected error occurred while generating IBANs. Please try again.';
      setGeneralError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyboard shortcut for generation (Ctrl+Enter)
  useKeyboardShortcut('ctrl+enter', () => {
    if (!isGenerating) {
      handleGenerate(formData);
    }
  }, [formData, isGenerating]);

  return (
    <>
      {/* Skip Navigation Link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <main id="main-content">
        <div className="container">
          <header role="banner">
            <h1>IBAN Generator & Validator</h1>
            <p className="subtitle">Generate valid IBAN numbers for testing purposes and validate existing IBANs</p>
            <p className="keyboard-shortcut-hint">
              💡 Tip: Press <kbd>Ctrl+Enter</kbd> to generate IBANs quickly
            </p>
          </header>

          <div className="card">
            <noscript>
              <p className="error-message has-error">
                JavaScript is required for this tool to function. Please enable JavaScript in your
                browser.
              </p>
            </noscript>

            {/* Tab Navigation */}
            <div className="tabs-container">
              <nav className="tabs-nav" role="tablist">
                <button
                  type="button"
                  className={`tab-button ${activeTab === 'generate' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'generate'}
                  aria-controls="generate-panel"
                  onClick={() => setActiveTab('generate')}
                >
                  Generate IBANs
                </button>
                <button
                  type="button"
                  className={`tab-button ${activeTab === 'validate' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'validate'}
                  aria-controls="validate-panel"
                  onClick={() => setActiveTab('validate')}
                >
                  Validate IBAN
                </button>
                <button
                  type="button"
                  className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'history'}
                  aria-controls="history-panel"
                  onClick={() => setActiveTab('history')}
                >
                  History
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div
              id="generate-panel"
              className={`tab-content ${activeTab === 'generate' ? 'active' : ''}`}
              role="tabpanel"
              aria-labelledby="generate-tab"
            >
              <IBANForm 
                onGenerate={handleGenerate}
                onFormDataChange={setFormData}
                isGenerating={isGenerating}
                validationState={validationState}
              />

              <ResultsDisplay 
                results={results}
                country={currentCountry}
                bank={formData.bank}
                onToast={addToast}
              />
            </div>

            <div
              id="validate-panel"
              className={`tab-content ${activeTab === 'validate' ? 'active' : ''}`}
              role="tabpanel"
              aria-labelledby="validate-tab"
            >
              <IBANValidator onToast={addToast} />
            </div>

            <div
              id="history-panel"
              className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}
              role="tabpanel"
              aria-labelledby="history-tab"
            >
              <IBANHistory onToast={addToast} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
