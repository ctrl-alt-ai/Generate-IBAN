import React, { useState } from 'react';
import { exportIBANs, generateExportFilename, type ExportFormat } from '../utils/exportUtils';
import type { ToastType } from '../hooks/useToast';

interface ExportModalProps {
  ibans: string[];
  country?: string;
  bank?: string;
  onClose: () => void;
  onToast: (message: string, type: ToastType, duration?: number) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  ibans,
  country,
  bank,
  onClose,
  onToast
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (ibans.length === 0) {
      onToast('No IBANs to export', 'warning');
      return;
    }

    setIsExporting(true);

    try {
      const exportData = {
        ibans,
        metadata: {
          country,
          bank,
          quantity: ibans.length,
          timestamp: Date.now()
        }
      };

      const blob = exportIBANs(exportData, selectedFormat);
      const filename = generateExportFilename(selectedFormat, exportData.metadata);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onToast(`IBANs exported successfully as ${selectedFormat.toUpperCase()}!`, 'success');
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      onToast('Failed to export IBANs. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDescriptions = {
    csv: 'Comma-separated values - compatible with Excel and spreadsheet applications',
    json: 'JavaScript Object Notation - structured data format for developers',
    xml: 'Extensible Markup Language - structured format for data exchange',
    txt: 'Plain text format - simple, human-readable format'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Export IBANs</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close export dialog"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Export {ibans.length} IBAN{ibans.length > 1 ? 's' : ''} in your preferred format:
          </p>

          <div className="export-format-selection">
            <fieldset>
              <legend className="sr-only">Select export format</legend>
              {Object.entries(formatDescriptions).map(([format, description]) => (
                <label key={format} className="format-option">
                  <input
                    type="radio"
                    name="export-format"
                    value={format}
                    checked={selectedFormat === format}
                    onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                  />
                  <div className="format-details">
                    <div className="format-name">{format.toUpperCase()}</div>
                    <div className="format-description">{description}</div>
                  </div>
                </label>
              ))}
            </fieldset>
          </div>

          {country && (
            <div className="export-metadata">
              <h3>Export Details</h3>
              <ul>
                <li><strong>Country:</strong> {country}</li>
                {bank && <li><strong>Bank:</strong> {bank}</li>}
                <li><strong>IBANs:</strong> {ibans.length}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : `Export as ${selectedFormat.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
};