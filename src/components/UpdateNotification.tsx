// Update notification component

import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';

interface UpdateNotificationProps {
  onUpdate: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  const { language } = useLanguage();

  return (
    <div className="update-notification">
      <div className="update-notification-content">
        <p className="update-notification-text">
          {t('update.available', language)}
        </p>
        <button className="btn btn-primary btn-small" onClick={onUpdate}>
          {t('update.reload', language)}
        </button>
      </div>
    </div>
  );
}
