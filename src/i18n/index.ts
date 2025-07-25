import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // App metadata
      title: 'IBAN Generator',
      subtitle: 'Generate valid IBAN numbers for testing purposes',
      skipToContent: 'Skip to main content',
      
      // Form labels and help text
      form: {
        legend: 'Generator Settings',
        country: {
          label: 'Country:',
          help: 'Select the country for the IBAN.',
          selected: 'Country selected'
        },
        bank: {
          label: 'Bank:',
          help: 'Optional: Select a bank for {{country}}.',
          loading: 'Loading available banks...',
          noSpecificBanks: 'No specific banks available for {{country}}. A random valid bank code will be used.',
          randomCodeUsed: 'Random bank code will be used',
          specificSelected: 'Specific bank selected'
        },
        quantity: {
          label: 'Number of IBANs to generate:',
          help: 'Enter a number between 1 and 100.',
          validNumber: 'Please enter a valid number',
          minimum: 'Minimum quantity is 1',
          maximum: 'Maximum quantity is 100',
          largeQuantity: 'Large quantities may take longer to generate',
          willGenerate: 'Will generate {{count}} IBAN',
          willGenerate_plural: 'Will generate {{count}} IBANs'
        },
        submit: {
          generate: 'Generate IBAN(s)',
          generating: 'Generating...',
          fixErrors: 'Please fix the form errors above before submitting.'
        }
      },
      
      // Results section
      results: {
        title: 'Generated Results',
        heading: 'Generated IBANs ({{count}})',
        helpText: 'Generated IBANs, one per line.',
        download: 'Download Results (.txt)',
        copySuccess: 'Copied to clipboard!',
        copyButton: 'Copy IBAN'
      },
      
      // Error messages
      errors: {
        selectCountry: 'Please select a country',
        invalidQuantity: 'Please enter a number between 1 and 100',
        generateFailed: 'Failed to generate any IBANs for {{country}}.',
        partialFailure: 'Note: {{failures}} out of {{total}} IBANs could not be generated.',
        unexpectedError: 'An unexpected error occurred while generating IBANs. Please try again.',
        jsRequired: 'JavaScript is required for this tool to function. Please enable JavaScript in your browser.'
      }
    }
  },
  nl: {
    translation: {
      // App metadata
      title: 'IBAN Generator',
      subtitle: 'Genereer geldige IBAN-nummers voor testdoeleinden',
      skipToContent: 'Ga naar hoofdinhoud',
      
      // Form labels and help text
      form: {
        legend: 'Generator Instellingen',
        country: {
          label: 'Land:',
          help: 'Selecteer het land voor de IBAN.',
          selected: 'Land geselecteerd'
        },
        bank: {
          label: 'Bank:',
          help: 'Optioneel: Selecteer een bank voor {{country}}.',
          loading: 'Beschikbare banken laden...',
          noSpecificBanks: 'Geen specifieke banken beschikbaar voor {{country}}. Een willekeurige geldige bankcode wordt gebruikt.',
          randomCodeUsed: 'Willekeurige bankcode wordt gebruikt',
          specificSelected: 'Specifieke bank geselecteerd'
        },
        quantity: {
          label: 'Aantal te genereren IBANs:',
          help: 'Voer een getal tussen 1 en 100 in.',
          validNumber: 'Voer een geldig getal in',
          minimum: 'Minimum aantal is 1',
          maximum: 'Maximum aantal is 100',
          largeQuantity: 'Grote aantallen kunnen langer duren om te genereren',
          willGenerate: '{{count}} IBAN wordt gegenereerd',
          willGenerate_plural: '{{count}} IBANs worden gegenereerd'
        },
        submit: {
          generate: 'Genereer IBAN(s)',
          generating: 'Genereren...',
          fixErrors: 'Corrigeer eerst de fouten in het formulier voordat u verzendt.'
        }
      },
      
      // Results section
      results: {
        title: 'Gegenereerde Resultaten',
        heading: 'Gegenereerde IBANs ({{count}})',
        helpText: 'Gegenereerde IBANs, één per regel.',
        download: 'Download Resultaten (.txt)',
        copySuccess: 'Gekopieerd naar klembord!',
        copyButton: 'Kopieer IBAN'
      },
      
      // Error messages
      errors: {
        selectCountry: 'Selecteer een land',
        invalidQuantity: 'Voer een getal tussen 1 en 100 in',
        generateFailed: 'Kon geen IBANs genereren voor {{country}}.',
        partialFailure: 'Let op: {{failures}} van de {{total}} IBANs konden niet worden gegenereerd.',
        unexpectedError: 'Er is een onverwachte fout opgetreden bij het genereren van IBANs. Probeer het opnieuw.',
        jsRequired: 'JavaScript is vereist voor deze tool. Schakel JavaScript in uw browser in.'
      }
    }
  },
  de: {
    translation: {
      // App metadata
      title: 'IBAN Generator',
      subtitle: 'Gültige IBAN-Nummern für Testzwecke generieren',
      skipToContent: 'Zum Hauptinhalt springen',
      
      // Form labels and help text
      form: {
        legend: 'Generator Einstellungen',
        country: {
          label: 'Land:',
          help: 'Wählen Sie das Land für die IBAN.',
          selected: 'Land ausgewählt'
        },
        bank: {
          label: 'Bank:',
          help: 'Optional: Wählen Sie eine Bank für {{country}}.',
          loading: 'Verfügbare Banken werden geladen...',
          noSpecificBanks: 'Keine spezifischen Banken für {{country}} verfügbar. Ein zufälliger gültiger Bankcode wird verwendet.',
          randomCodeUsed: 'Zufälliger Bankcode wird verwendet',
          specificSelected: 'Spezifische Bank ausgewählt'
        },
        quantity: {
          label: 'Anzahl zu generierender IBANs:',
          help: 'Geben Sie eine Zahl zwischen 1 und 100 ein.',
          validNumber: 'Bitte geben Sie eine gültige Zahl ein',
          minimum: 'Mindestanzahl ist 1',
          maximum: 'Höchstanzahl ist 100',
          largeQuantity: 'Große Mengen können länger dauern',
          willGenerate: '{{count}} IBAN wird generiert',
          willGenerate_plural: '{{count}} IBANs werden generiert'
        },
        submit: {
          generate: 'IBAN(s) generieren',
          generating: 'Generiere...',
          fixErrors: 'Bitte beheben Sie die Formularfehler vor dem Absenden.'
        }
      },
      
      // Results section
      results: {
        title: 'Generierte Ergebnisse',
        heading: 'Generierte IBANs ({{count}})',
        helpText: 'Generierte IBANs, eine pro Zeile.',
        download: 'Ergebnisse herunterladen (.txt)',
        copySuccess: 'In die Zwischenablage kopiert!',
        copyButton: 'IBAN kopieren'
      },
      
      // Error messages
      errors: {
        selectCountry: 'Bitte wählen Sie ein Land',
        invalidQuantity: 'Bitte geben Sie eine Zahl zwischen 1 und 100 ein',
        generateFailed: 'Keine IBANs für {{country}} generiert.',
        partialFailure: 'Hinweis: {{failures}} von {{total}} IBANs konnten nicht generiert werden.',
        unexpectedError: 'Ein unerwarteter Fehler ist beim Generieren der IBANs aufgetreten. Bitte versuchen Sie es erneut.',
        jsRequired: 'JavaScript ist für dieses Tool erforderlich. Bitte aktivieren Sie JavaScript in Ihrem Browser.'
      }
    }
  }
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    // Language detection options
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for now
    }
  });

export default i18n;