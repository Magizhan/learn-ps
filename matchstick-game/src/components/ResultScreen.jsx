import { useState, useEffect, useRef } from "react";
import MatchstickCanvas from "./MatchstickCanvas";

const AUTO_ADVANCE_SECONDS = 4;
const REVIEW_PAUSE_SECONDS = 8;

export default function ResultScreen({
  correct,
  playerAnswer,
  correctAnswer,
  pointsEarned,
  totalScore,
  level,
  timeLeft,
  isLevelComplete,
  isGameComplete,
  pattern,
  onNext,
  onReplay,
  onNextLevel,
}) {
  const isCorrect = correct;
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SECONDS);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  const canAutoAdvance = !isLevelComplete && !isGameComplete;
  // On wrong answer, auto-pause longer so player can study the pattern
  const autoSeconds = !isCorrect ? REVIEW_PAUSE_SECONDS : AUTO_ADVANCE_SECONDS;

  useEffect(() => {
    if (!canAutoAdvance || paused) return;

    setCountdown(autoSeconds);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [canAutoAdvance, paused, onNext, autoSeconds]);

  const handlePauseToggle = () => {
    if (paused) {
      setPaused(false);
    } else {
      setPaused(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="screen result-screen">
      <div className={`result-icon ${isCorrect ? "correct" : "incorrect"}`}>
        {isCorrect ? "\u2713" : "\u2717"}
      </div>

      <h2 className={isCorrect ? "text-correct" : "text-incorrect"}>
        {isCorrect ? "Correct!" : "Not Quite!"}
      </h2>

      {/* On wrong answer, show the pattern again with your answer vs correct */}
      {!isCorrect && pattern && (
        <div className="review-section">
          <div className="review-header">
            <span className="review-label">Review: {pattern.name}</span>
          </div>
          <MatchstickCanvas
            matchsticks={pattern.matchsticks}
            width={400}
            height={240}
            compact
          />
          <div className="review-comparison">
            <div className="review-badge review-yours">
              Your answer: <strong>{playerAnswer}</strong>
            </div>
            <div className="review-badge review-correct">
              Correct: <strong>{correctAnswer}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="result-details">
        <div className="result-row">
          <span>Your Answer</span>
          <span className={isCorrect ? "text-correct" : "text-incorrect"}>
            {playerAnswer}
          </span>
        </div>
        <div className="result-row">
          <span>Correct Answer</span>
          <span>{correctAnswer}</span>
        </div>
        <div className="result-row">
          <span>Time Remaining</span>
          <span>{timeLeft}s</span>
        </div>
        <div className="result-row">
          <span>Points Earned</span>
          <span className="text-points">+{pointsEarned}</span>
        </div>
        <div className="result-row total-row">
          <span>Total Score</span>
          <span className="text-points">{totalScore}</span>
        </div>
      </div>

      {isLevelComplete && !isGameComplete && (
        <div className="level-complete-banner">
          <p>Level {level} Complete!</p>
        </div>
      )}

      {isGameComplete && (
        <div className="game-complete-banner">
          <p>Congratulations! You completed all levels!</p>
          <p className="final-score">Final Score: {totalScore}</p>
        </div>
      )}

      {canAutoAdvance && (
        <div className="auto-advance">
          {paused ? (
            <p className="auto-advance-text">Auto-advance paused</p>
          ) : (
            <p className="auto-advance-text">
              Next pattern in <span className="countdown-num">{countdown}</span>s...
            </p>
          )}
        </div>
      )}

      <div className="result-actions">
        {isGameComplete ? (
          <button className="btn btn-primary btn-large" onClick={onReplay}>
            Play Again
          </button>
        ) : isLevelComplete ? (
          <>
            <button className="btn btn-secondary" onClick={onReplay}>
              Replay Level
            </button>
            <button className="btn btn-primary btn-large" onClick={onNextLevel}>
              Next Level
            </button>
          </>
        ) : (
          <>
            {paused ? (
              <button className="btn btn-primary" onClick={handlePauseToggle}>
                Resume Auto-advance
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={handlePauseToggle}>
                Pause
              </button>
            )}
            <button className="btn btn-primary" onClick={onNext}>
              Next Pattern
            </button>
          </>
        )}
      </div>
    </div>
  );
}
