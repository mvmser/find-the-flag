// Game page component

import { useState, useEffect, useRef, useCallback } from 'react';
import { Country } from '../data/countries';
import { countries } from '../data/countries';
import { GameState, GameSettings } from '../types';
import { buildQuestion, buildQuestionWithDifficulty } from '../lib/game';
import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { FlagImage } from './FlagImage';
import { LanguageToggle } from './LanguageToggle';
import { Timer } from './Timer';
import { loadTotalScore, saveTotalScore, loadSettings, loadPseudonym, encodeScoreData } from '../utils/storage';

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
    startTime: Date.now(),
  });
  
  // Helper function to build a new question based on difficulty
  const buildNewQuestion = useCallback((previousCode?: string) => {
    return settings.difficulty === 'easy'
      ? buildQuestion(countries, previousCode, settings.optionCount)
      : buildQuestionWithDifficulty(countries, settings.difficulty, previousCode, settings.optionCount);
  }, [settings.difficulty, settings.optionCount]);
  
  const [currentQuestion, setCurrentQuestion] = useState(() => buildNewQuestion());
  const [selectedOption, setSelectedOption] = useState<Country | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [textInput, setTextInput] = useState('');
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  // Cancel the auto-advance timer if set
  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  // Cleanup effect to cancel timer on unmount
  useEffect(() => {
    return () => {
      cancelAutoAdvance();
    };
  }, [cancelAutoAdvance]);
  const normalizeText = (text: string): string => {
    return text
      .normalize('NFD') // Decompose combined characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ') // Replace non-alphanumeric with spaces
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      .trim();
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
    
    // Start auto-advance countdown
    startAutoAdvance();
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
    
    // Start auto-advance countdown
    startAutoAdvance();
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
    
    // Start auto-advance countdown
    startAutoAdvance();
  };

  const startAutoAdvance = () => {
    setAutoAdvanceCountdown(5);
  };

  const cancelAutoAdvance = () => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceCountdown(null);
  };

  // Auto-advance countdown effect
  useEffect(() => {
    if (autoAdvanceCountdown === null) return;

    if (autoAdvanceCountdown <= 0) {
      cancelAutoAdvance();
      // Inline next logic to avoid dependency
      const newQuestion = buildNewQuestion(gameState.previousCorrectCode);
      setCurrentQuestion(newQuestion);
      setSelectedOption(null);
      setTextInput('');
      setAnswerState('unanswered');
      return;
    }

    autoAdvanceTimerRef.current = window.setInterval(() => {
      setAutoAdvanceCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, [autoAdvanceCountdown, gameState.previousCorrectCode, buildNewQuestion]);

  const handleNext = () => {
    cancelAutoAdvance();
    const newQuestion = buildNewQuestion(gameState.previousCorrectCode);
    setCurrentQuestion(newQuestion);
    setSelectedOption(null);
    setTextInput('');
    setAnswerState('unanswered');
  };

  const handleSkip = () => {
    // Skip counts as incorrect but shows next question immediately
    setGameState((prev) => ({
      ...prev,
      total: prev.total + 1,
      previousCorrectCode: currentQuestion.correct.code,
    }));
    handleNext();
  };

  const handleRestart = () => {
    setGameState({ score: 0, total: 0, startTime: Date.now() });
    const newQuestion = buildNewQuestion();
    setCurrentQuestion(newQuestion);
    setSelectedOption(null);
    setTextInput('');
    setAnswerState('unanswered');
  };

  const handleShare = () => {
    const pseudonym = loadPseudonym() || 'Anonymous';
    const baseUrl = window.location.origin + window.location.pathname;
    const elapsedTime = gameState.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0;
    const encodedData = encodeScoreData(pseudonym, gameState.score, gameState.total, elapsedTime);
    const shareUrl = `${baseUrl}?data=${encodeURIComponent(encodedData)}`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Find the Flag - My Score',
        text: `${pseudonym} achieved ${gameState.score}/${gameState.total} in Find the Flag!`,
        url: shareUrl,
      }).catch(() => {
        // User cancelled or error occurred - silently ignore
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShowCopyNotification(true);
        setTimeout(() => setShowCopyNotification(false), 3000);
      }).catch(() => {
        // Final fallback: show the URL in prompt
        prompt('Copy this link to share your score:', shareUrl);
      });
    }
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

  // Check if game is complete
  const isGameComplete = gameState.total >= settings.questionCount;

  // Show game complete screen
  if (isGameComplete && answerState !== 'unanswered') {
    const elapsedTime = gameState.startTime ? Math.floor((Date.now() - gameState.startTime) / 1000) : 0;
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (mins > 0) {
        return `${mins}m ${secs}s`;
      }
      return `${secs}s`;
    };

    return (
      <div className="page game-page">
        <div className="game-header">
          <button className="btn-text" onClick={onGoHome}>
            ← {t('home.title', language)}
          </button>
          <LanguageToggle />
        </div>

        <div className="game-content game-complete-content">
          <h1 className="game-complete-title">{t('game.gameComplete', language)}</h1>
          
          <div className="game-complete-card">
            <div className="game-complete-stat">
              <div className="game-complete-label">{t('game.yourScore', language)}</div>
              <div className="game-complete-value">{gameState.score} / {gameState.total}</div>
            </div>
            
            {elapsedTime > 0 && (
              <div className="game-complete-stat">
                <div className="game-complete-label">{t('game.time', language)}:</div>
                <div className="game-complete-value">{formatTime(elapsedTime)}</div>
              </div>
            )}
          </div>

          <div className="game-complete-actions">
            <button className="btn btn-primary btn-large" onClick={handleRestart}>
              {t('game.restart', language)}
            </button>
            <button className="btn btn-secondary" onClick={handleShare}>
              📤 {t('game.shareScore', language)}
            </button>
            <button className="btn btn-secondary" onClick={onGoHome}>
              {t('home.title', language)}
            </button>
          </div>
        </div>

        {showCopyNotification && (
          <div className="copy-notification">
            {t('game.linkCopied', language)}
          </div>
        )}
      </div>
    );
  }

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
          <div className="progress-indicator">
            {t('game.progress', language)
              .replace('{current}', (gameState.total + 1).toString())
              .replace('{total}', settings.questionCount.toString())}
          </div>
          <div className="score-display">
            {t('game.score', language)}: {gameState.score} / {gameState.total}
          </div>
          <div className="total-score-badge">
            {t('game.totalScore', language)}: {totalScore}
          </div>
        </div>
        
        <button
          className="btn btn-secondary share-btn"
          onClick={handleShare}
        >
          📤 {t('game.shareScore', language)}
        </button>

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
          onSkip={answerState === 'unanswered' ? handleSkip : undefined}
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
              aria-label={t('game.typeCountryName', language)}
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
            <button className="btn btn-primary next-btn-with-countdown" onClick={handleNext}>
              <span>{t('game.next', language)}</span>
              {autoAdvanceCountdown !== null && autoAdvanceCountdown > 0 && (
                <>
                  <span className="countdown-separator">•</span>
                  <span className="countdown-value">{autoAdvanceCountdown}</span>
                  <div 
                    className="countdown-progress" 
                    style={{ width: `${(autoAdvanceCountdown / 5) * 100}%` }}
                  />
                </>
              )}
            </button>
            <button className="btn btn-secondary" onClick={handleRestart}>
              {t('game.restart', language)}
            </button>
          </div>
        )}
      </div>
      
      {showCopyNotification && (
        <div className="copy-notification">
          {t('game.linkCopied', language)}
        </div>
      )}
    </div>
  );
}
