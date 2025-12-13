// Game page component

import { useState } from 'react';
import { Country } from '../data/countries';
import { countries } from '../data/countries';
import { GameState } from '../types';
import { buildQuestion } from '../lib/game';
import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { FlagImage } from './FlagImage';
import { LanguageToggle } from './LanguageToggle';

interface GamePageProps {
  onGoHome: () => void;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export function GamePage({ onGoHome }: GamePageProps) {
  const { language } = useLanguage();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    total: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState(() =>
    buildQuestion(countries)
  );
  const [selectedOption, setSelectedOption] = useState<Country | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');

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
  };

  const handleNext = () => {
    const newQuestion = buildQuestion(countries, gameState.previousCorrectCode);
    setCurrentQuestion(newQuestion);
    setSelectedOption(null);
    setAnswerState('unanswered');
  };

  const handleRestart = () => {
    setGameState({ score: 0, total: 0 });
    const newQuestion = buildQuestion(countries);
    setCurrentQuestion(newQuestion);
    setSelectedOption(null);
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

  return (
    <div className="page game-page">
      <div className="game-header">
        <button className="btn-text" onClick={onGoHome}>
          ← {t('home.title', language)}
        </button>
        <LanguageToggle />
      </div>

      <div className="game-content">
        <div className="score-display">
          {t('game.score', language)}: {gameState.score} / {gameState.total}
        </div>

        <FlagImage
          flagUrl={currentQuestion.correct.flagUrl}
          countryName={getCountryName(currentQuestion.correct)}
        />

        <h2 className="game-question">{t('game.question', language)}</h2>

        <div className="options-grid">
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

        {answerState !== 'unanswered' && (
          <div className={`feedback feedback-${answerState}`}>
            <p className="feedback-message">
              {answerState === 'correct' ? t('game.correct', language) : t('game.incorrect', language)}
            </p>
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
