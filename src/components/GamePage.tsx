// Game page component

import { useState } from 'react';
import { Country } from '../data/countries';
import { countries } from '../data/countries';
import { GameState, GameSettings } from '../types';
import { buildQuestion } from '../lib/game';
import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { FlagImage } from './FlagImage';
import { LanguageToggle } from './LanguageToggle';
import { Timer } from './Timer';
import { loadTotalScore, saveTotalScore, loadSettings } from '../utils/storage';

interface GamePageProps {
  onGoHome: () => void;
  settings?: GameSettings;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export function GamePage({ onGoHome, settings: propsSettings }: GamePageProps) {
  const { language } = useLanguage();
  const [settings] = useState<GameSettings>(propsSettings || loadSettings());
  const [totalScore, setTotalScore] = useState(loadTotalScore());
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    total: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    buildQuestion(countries, undefined, settings.optionCount)
  );
  const [selectedOption, setSelectedOption] = useState<Country | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [textInput, setTextInput] = useState('');

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');
  };

  const checkTextAnswer = (input: string): boolean => {
    const normalized = normalizeText(input);
    const correctEn = normalizeText(currentQuestion.correct.name_en);
    const correctFr = normalizeText(currentQuestion.correct.name_fr);
    
    return normalized === correctEn || normalized === correctFr;
  };

  const handleTextSubmit = () => {
    if (answerState !== 'unanswered' || !textInput.trim()) return;

    const isCorrect = checkTextAnswer(textInput);
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      total: prev.total + 1,
      previousCorrectCode: currentQuestion.correct.code,
    }));

    if (isCorrect) {
      const newTotal = totalScore + 1;
      setTotalScore(newTotal);
      saveTotalScore(newTotal);
    }
  };

  const handleOptionClick = (option: Country) => {
    if (answerState !== 'unanswered') return;

    setSelectedOption(option);
    const isCorrect = option.code === currentQuestion.correct.code;
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    setGameState((prev) => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      total: prev.total + 1,
      previousCorrectCode: currentQuestion.correct.code,
    }));

    if (isCorrect) {
      const newTotal = totalScore + 1;
      setTotalScore(newTotal);
      saveTotalScore(newTotal);
    }
  };

  const handleTimeUp = () => {
    if (answerState !== 'unanswered') return;
    
    // Mark as incorrect when time runs out
    // Don't set previousCorrectCode since user didn't actively see the answer
    setAnswerState('incorrect');
    setGameState((prev) => ({
      ...prev,
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    const newQuestion = buildQuestion(countries, gameState.previousCorrectCode, settings.optionCount);
    setCurrentQuestion(newQuestion);
    setSelectedOption(null);
    setTextInput('');
    setAnswerState('unanswered');
  };

  const handleRestart = () => {
    setGameState({ score: 0, total: 0 });
    const newQuestion = buildQuestion(countries, undefined, settings.optionCount);
    setCurrentQuestion(newQuestion);
    setSelectedOption(null);
    setTextInput('');
    setAnswerState('unanswered');
  };

  const getCountryName = (country: Country) => {
    return language === 'fr' ? country.name_fr : country.name_en;
  };

  const getButtonClass = (option: Country) => {
    const classes = ['option-btn'];
    
    if (answerState === 'unanswered') {
      return classes.join(' ');
    }

    // After answer is given
    if (option.code === currentQuestion.correct.code) {
      classes.push('correct');
    } else if (option.code === selectedOption?.code) {
      classes.push('incorrect');
    } else {
      classes.push('disabled');
    }

    return classes.join(' ');
  };

  // Determine grid columns based on option count
  const getGridClass = () => {
    const baseClass = 'options-grid';
    const modifierClass = settings.optionCount === 6 ? 'options-grid-6' 
      : settings.optionCount === 8 ? 'options-grid-8' 
      : null;
    return [baseClass, modifierClass].filter(Boolean).join(' ');
  };

  return (
    <div className="page game-page">
      <div className="game-header">
        <button className="btn-text" onClick={onGoHome}>
          ← {t('home.title', language)}
        </button>
        <LanguageToggle />
      </div>

      <div className="game-content">
        <div className="game-stats">
          <div className="score-display">
            {t('game.score', language)}: {gameState.score} / {gameState.total}
          </div>
          <div className="total-score-badge">
            {t('game.totalScore', language)}: {totalScore}
          </div>
        </div>

        {settings.timerEnabled && (
          <Timer 
            duration={settings.timerDuration} 
            onTimeUp={handleTimeUp}
            isActive={answerState === 'unanswered'}
          />
        )}

        <FlagImage
          flagUrl={currentQuestion.correct.flagUrl}
          countryName={getCountryName(currentQuestion.correct)}
        />

        <h2 className="game-question">{t('game.question', language)}</h2>

        {settings.gameMode === 'multiple-choice' ? (
          <div className={getGridClass()}>
            {currentQuestion.options.map((option) => (
              <button
                key={option.code}
                className={getButtonClass(option)}
                onClick={() => handleOptionClick(option)}
                disabled={answerState !== 'unanswered'}
              >
                {getCountryName(option)}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-input-container">
            <input
              type="text"
              className="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
              placeholder={t('game.typeCountryName', language)}
              disabled={answerState !== 'unanswered'}
              autoFocus
            />
            <button
              className="btn btn-primary"
              onClick={handleTextSubmit}
              disabled={answerState !== 'unanswered' || !textInput.trim()}
            >
              {t('game.submit', language)}
            </button>
          </div>
        )}

        {answerState !== 'unanswered' && (
          <div className={`feedback feedback-${answerState}`}>
            <p className="feedback-message">
              {answerState === 'correct' ? t('game.correct', language) : t('game.incorrect', language)}
            </p>
            {answerState === 'incorrect' && settings.gameMode === 'free-text' && textInput && (
              <p className="feedback-answer">
                {t('game.yourAnswer', language)} <strong>{textInput}</strong>
              </p>
            )}
            {answerState === 'incorrect' && (
              <p className="feedback-answer">
                {t('game.correctAnswer', language)} <strong>{getCountryName(currentQuestion.correct)}</strong>
              </p>
            )}
          </div>
        )}

        {answerState !== 'unanswered' && (
          <div className="game-actions">
            <button className="btn btn-primary" onClick={handleNext}>
              {t('game.next', language)}
            </button>
            <button className="btn btn-secondary" onClick={handleRestart}>
              {t('game.restart', language)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
