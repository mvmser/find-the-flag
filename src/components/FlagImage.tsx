// Flag image component with error handling

import { useState } from 'react';
import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';

interface FlagImageProps {
  flagUrl: string;
  countryName: string;
}

export function FlagImage({ flagUrl, countryName }: FlagImageProps) {
  const { language } = useLanguage();
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flag-container">
        <div className="flag-placeholder">
          <svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="320" height="240" fill="#e0e0e0" />
            <text
              x="160"
              y="120"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#666"
              fontSize="16"
              fontFamily="system-ui, sans-serif"
            >
              {t('flag.unavailable', language)}
            </text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flag-container">
      <img
        src={flagUrl}
        alt={`${t('flag.alt', language)} ${countryName}`}
        className="flag-image"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}
