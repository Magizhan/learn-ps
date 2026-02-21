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
  onNext,
  onReplay,
  onNextLevel,
}) {
  const isCorrect = correct;

  return (
    <div className="screen result-screen">
      <div className={`result-icon ${isCorrect ? "correct" : "incorrect"}`}>
        {isCorrect ? "✓" : "✗"}
      </div>

      <h2 className={isCorrect ? "text-correct" : "text-incorrect"}>
        {isCorrect ? "Correct!" : "Not Quite!"}
      </h2>

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
              Next Level →
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={onReplay}>
              Restart Level
            </button>
            <button className="btn btn-primary" onClick={onNext}>
              Next Pattern →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
