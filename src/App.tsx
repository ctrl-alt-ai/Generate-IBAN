import { useState } from 'react';
import { IBANForm } from './components/IBANForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ToastContainer } from './components/ToastContainer';
import { BANK_DATA, COUNTRY_NAMES } from './utils/constants';
import { useToast } from './hooks/useToast';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { useMemoizedGeneration } from './hooks/useMemoizedGeneration';
import { useFormValidation } from './hooks/useFormValidation';
import type { FormData } from './utils/types';
import './styles/App.css';

function App() {
  const [results, setResults] = useState<string[]>([]);
  const [currentCountry, setCurrentCountry] = useState<string>('NL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    country: 'NL',
    bank: '',
    quantity: 1,
  });

  // Custom hooks
  const { toasts, addToast, removeToast } = useToast();
  const { generateMemoized } = useMemoizedGeneration();
  const { validationState, validateAll, clearValidation, setGeneralError } = useFormValidation();

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
            <h1>IBAN Generator</h1>
            <p className="subtitle">Generate valid IBAN numbers for testing purposes</p>
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

            <IBANForm 
              onGenerate={handleGenerate}
              onFormDataChange={setFormData}
              isGenerating={isGenerating}
              validationState={validationState}
            />

            <ResultsDisplay 
              results={results}
              country={currentCountry}
              onToast={addToast}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
