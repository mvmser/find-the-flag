// Settings page component

import { useState } from 'react';
import { GameSettings } from '../types';
import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { LanguageToggle } from './LanguageToggle';
import { loadSettings, saveSettings, loadTotalScore, resetTotalScore } from '../utils/storage';

interface SettingsPageProps {
  onBack: () => void;
  onSettingsChange: (settings: GameSettings) => void;
}

export function SettingsPage({ onBack, onSettingsChange }: SettingsPageProps) {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [totalScore, setTotalScore] = useState(loadTotalScore());

  const handleOptionCountChange = (count: 4 | 6 | 8) => {
    const newSettings = { ...settings, optionCount: count };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleTimerToggle = () => {
    const newSettings = { ...settings, timerEnabled: !settings.timerEnabled };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleGameModeChange = (mode: 'multiple-choice' | 'free-text') => {
    const newSettings = { ...settings, gameMode: mode };
    setSettings(newSettings);
    saveSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleResetScore = () => {
    if (confirm(t('settings.confirmReset', language))) {
      resetTotalScore();
      setTotalScore(0);
    }
  };

  return (
    <div className="page settings-page">
      <div className="settings-header">
        <button className="btn-text" onClick={onBack}>
          ← {t('settings.back', language)}
        </button>
        <LanguageToggle />
      </div>

      <div className="settings-content">
        <h1 className="settings-title">{t('settings.title', language)}</h1>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('game.totalScore', language)}</h2>
          <div className="total-score-display">{totalScore}</div>
          <button className="btn btn-secondary" onClick={handleResetScore}>
            {t('settings.resetScore', language)}
          </button>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('settings.gameMode', language)}</h2>
          <div className="option-count-buttons">
            <button
              className={`btn ${settings.gameMode === 'multiple-choice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleGameModeChange('multiple-choice')}
            >
              {t('settings.multipleChoice', language)}
            </button>
            <button
              className={`btn ${settings.gameMode === 'free-text' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleGameModeChange('free-text')}
            >
              {t('settings.freeText', language)}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('settings.optionCount', language)}</h2>
          <div className="option-count-buttons">
            {[4, 6, 8].map((count) => (
              <button
                key={count}
                className={`btn ${settings.optionCount === count ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleOptionCountChange(count as 4 | 6 | 8)}
              >
                {count} {t('settings.options', language)}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">{t('settings.timer', language)}</h2>
          <button
            className={`btn ${settings.timerEnabled ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleTimerToggle}
          >
            {settings.timerEnabled ? t('settings.enabled', language) : t('settings.disabled', language)}
          </button>
          {settings.timerEnabled && (
            <p className="settings-info">
              {t('settings.timerDuration', language)}: {settings.timerDuration} {t('settings.seconds', language)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
