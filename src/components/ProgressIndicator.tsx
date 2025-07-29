import React from 'react';
import { useTranslation } from 'react-i18next';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  isVisible: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  current, 
  total, 
  isVisible 
}) => {
  const { t } = useTranslation();

  if (!isVisible || total === 0) return null;

  const percentage = Math.round((current / total) * 100);

  return (
    <div className="progress-container" role="status" aria-live="polite">
      <div className="progress-info">
        <span className="progress-text">
          {t('results.generating')} ({current}/{total})
        </span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
};