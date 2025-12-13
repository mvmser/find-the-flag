// Custom confirmation dialog component

import { useEffect } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import { t } from '../i18n';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { language } = useLanguage();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div 
      className="dialog-overlay" 
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-message"
    >
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-content">
          <p id="dialog-message" className="dialog-message">{message}</p>
          <div className="dialog-actions">
            <button className="btn btn-secondary" onClick={onCancel}>
              {t('settings.cancel', language)}
            </button>
            <button className="btn btn-primary" onClick={onConfirm}>
              {t('settings.confirm', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
