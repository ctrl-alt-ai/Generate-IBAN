import { useTranslation } from 'react-i18next';
import { IBANForm } from './components/IBANForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useIBANGeneration } from './hooks/useIBANGeneration';
import './styles/App.css';

function App() {
  const { t } = useTranslation();
  const { results, currentCountry, isGenerating, errors, generate } = useIBANGeneration();

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

              <IBANForm onGenerate={generate} isGenerating={isGenerating} errors={errors} />

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
