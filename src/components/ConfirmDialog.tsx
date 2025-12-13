// Custom confirmation dialog component

import { useLanguage } from '../contexts/useLanguage';
import { t } from '../i18n';

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { language } = useLanguage();

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-content">
          <p className="dialog-message">{message}</p>
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
