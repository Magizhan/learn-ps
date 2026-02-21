import { useState, useEffect, useCallback } from "react";
import MatchstickCanvas from "./MatchstickCanvas";

export default function GameScreen({
  pattern,
  level,
  score,
  timeLeft,
  onSubmit,
  patternsCompleted,
  patternsPerLevel,
}) {
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);

  // Reset input when pattern changes
  useEffect(() => {
    setAnswer("");
  }, [pattern]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const num = parseInt(answer, 10);
      if (isNaN(num) || num < 0) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }
      onSubmit(num);
    },
    [answer, onSubmit]
  );

  const timerPercent = (timeLeft / 60) * 100;
  const timerColor =
    timeLeft > 30 ? "#4ecca3" : timeLeft > 10 ? "#ffc107" : "#e74c3c";

  return (
    <div className="screen game-screen">
      {/* Header bar */}
      <div className="game-header">
        <div className="stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{level}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Pattern</span>
          <span className="stat-value">
            {patternsCompleted + 1}/{patternsPerLevel}
          </span>
        </div>
        <div className="stat timer-stat">
          <span className="stat-label">Time</span>
          <span className="stat-value" style={{ color: timerColor }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="timer-bar-container">
        <div
          className="timer-bar"
          style={{
            width: `${timerPercent}%`,
            backgroundColor: timerColor,
          }}
        />
      </div>

      {/* Pattern info */}
      <div className="pattern-info">
        <h2>{pattern.name}</h2>
        <p>{pattern.description}</p>
        {pattern.hint && <p className="pattern-hint">Hint: {pattern.hint}</p>}
      </div>

      {/* Canvas */}
      <MatchstickCanvas matchsticks={pattern.matchsticks} width={500} height={320} />

      {/* Answer form */}
      <form
        className={`answer-form ${shake ? "shake" : ""}`}
        onSubmit={handleSubmit}
      >
        <label htmlFor="answer-input">How many matchsticks?</label>
        <div className="answer-row">
          <input
            id="answer-input"
            type="number"
            min="0"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter number..."
            autoFocus
            disabled={timeLeft === 0}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={timeLeft === 0 || answer === ""}
          >
            Submit
          </button>
        </div>
      </form>

      {timeLeft === 0 && (
        <div className="time-up-overlay">
          <p>Time's up!</p>
        </div>
      )}
    </div>
  );
}
