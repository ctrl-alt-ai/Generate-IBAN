import React, { useState } from 'react';
import { useIBANHistory } from '../hooks/useIBANHistory';
import { COUNTRY_NAMES, BANK_DATA } from '../utils/constants';
import { formatIBAN } from '../utils/ibanGenerator';
import type { ToastType } from '../hooks/useToast';

interface IBANHistoryProps {
  onToast: (message: string, type: ToastType, duration?: number) => void;
}

export const IBANHistory: React.FC<IBANHistoryProps> = ({ onToast }) => {
  const { history, removeFromHistory, clearHistory, exportHistory } = useIBANHistory();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const handleExportHistory = () => {
    try {
      const data = exportHistory();
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iban-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      onToast('History exported successfully!', 'success');
    } catch {
      onToast('Failed to export history', 'error');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      clearHistory();
      onToast('History cleared successfully', 'success');
    }
  };

  const handleCopyEntry = async (ibans: string[]) => {
    try {
      const text = ibans.join('\n');
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        onToast('IBANs copied to clipboard!', 'success');
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch {
      onToast('Failed to copy IBANs', 'error');
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  if (history.length === 0) {
    return (
      <div className="history-section">
        <h2 className="form-section-heading">Generation History</h2>
        <p className="help-text">No IBANs generated yet. Your generation history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="history-section">
      <div className="history-header">
        <h2 className="form-section-heading">
          Generation History ({history.length})
        </h2>
        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleExportHistory}
          >
            Export History
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClearHistory}
          >
            Clear History
          </button>
        </div>
      </div>

      <div className="history-list">
        {history.map((entry) => {
          const bankName = entry.bank && BANK_DATA[entry.country] 
            ? BANK_DATA[entry.country][entry.bank]?.name || entry.bank
            : 'Random Bank';
          
          const isExpanded = expandedEntry === entry.id;
          
          return (
            <div key={entry.id} className="history-entry">
              <div className="history-entry-header">
                <div className="history-entry-info">
                  <div className="history-entry-main">
                    <span className="history-country">
                      {COUNTRY_NAMES[entry.country] || entry.country}
                    </span>
                    <span className="history-bank">{bankName}</span>
                    <span className="history-quantity">
                      {entry.quantity} IBAN{entry.quantity > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="history-entry-meta">
                    <time className="history-timestamp">
                      {new Date(entry.timestamp).toLocaleString()}
                    </time>
                  </div>
                </div>
                
                <div className="history-entry-actions">
                  <button
                    type="button"
                    className="btn btn-small"
                    onClick={() => toggleExpanded(entry.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Hide' : 'Show'} IBANs
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-secondary"
                    onClick={() => handleCopyEntry(entry.ibans)}
                  >
                    Copy All
                  </button>
                  <button
                    type="button"
                    className="btn btn-small btn-outline"
                    onClick={() => removeFromHistory(entry.id)}
                    aria-label="Remove from history"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="history-entry-content">
                  <div className="history-ibans">
                    {entry.ibans.map((iban, index) => (
                      <div key={index} className="history-iban">
                        <span className="iban-text">{formatIBAN(iban)}</span>
                        <button
                          type="button"
                          className="copy-btn btn-small"
                          onClick={() => handleCopyEntry([iban])}
                          aria-label="Copy this IBAN"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};