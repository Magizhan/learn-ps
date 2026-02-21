import { useState, useCallback, useEffect } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";
import { useTimer } from "./hooks/useTimer";
import { getLevel, MAX_LEVEL } from "./data/patterns";
import "./App.css";

const TIMER_SECONDS = 60;
const PATTERNS_PER_LEVEL = 3;

function calculatePoints(isCorrect, timeLeft) {
  if (!isCorrect) return 0;
  const base = 100;
  const timeBonus = Math.round((timeLeft / TIMER_SECONDS) * 100);
  return base + timeBonus;
}

function shuffleAndPick(patterns, count) {
  const shuffled = [...patterns].sort(() => Math.random() - 0.5);
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(shuffled[i % shuffled.length]);
  }
  return picked;
}

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [patternIndex, setPatternIndex] = useState(0);
  const [levelPatterns, setLevelPatterns] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const { timeLeft, isRunning, start, stop, reset } = useTimer(TIMER_SECONDS);

  const currentPattern = levelPatterns[patternIndex] || null;

  // When timer hits 0 during play, auto-submit as wrong
  useEffect(() => {
    if (gameState === "playing" && timeLeft === 0 && !isRunning && !submitted) {
      setSubmitted(true);
      const points = 0;
      const newScore = score;
      const patternsCompleted = patternIndex + 1;
      const isLevelComplete = patternsCompleted >= PATTERNS_PER_LEVEL;
      const isGameComplete = isLevelComplete && level >= MAX_LEVEL;

      setLastResult({
        correct: false,
        playerAnswer: "—",
        correctAnswer: currentPattern?.totalMatchsticks ?? 0,
        pointsEarned: points,
        totalScore: newScore,
        level,
        timeLeft: 0,
        isLevelComplete,
        isGameComplete,
      });
      setGameState("result");
    }
  }, [timeLeft, isRunning, gameState, submitted, score, patternIndex, level, currentPattern]);

  const startLevel = useCallback(
    (lvl) => {
      const levelData = getLevel(lvl);
      const picked = shuffleAndPick(levelData.patterns, PATTERNS_PER_LEVEL);
      setLevelPatterns(picked);
      setPatternIndex(0);
      setSubmitted(false);
      setGameState("playing");
      reset(TIMER_SECONDS);
      start();
    },
    [reset, start]
  );

  const handleStart = useCallback(() => {
    setScore(0);
    setLevel(1);
    startLevel(1);
  }, [startLevel]);

  const handleSubmit = useCallback(
    (playerAnswer) => {
      if (submitted) return;
      setSubmitted(true);
      stop();
      const correct = playerAnswer === currentPattern.totalMatchsticks;
      const points = calculatePoints(correct, timeLeft);
      const newScore = score + points;
      setScore(newScore);

      const patternsCompleted = patternIndex + 1;
      const isLevelComplete = patternsCompleted >= PATTERNS_PER_LEVEL;
      const isGameComplete = isLevelComplete && level >= MAX_LEVEL;

      setLastResult({
        correct,
        playerAnswer,
        correctAnswer: currentPattern.totalMatchsticks,
        pointsEarned: points,
        totalScore: newScore,
        level,
        timeLeft,
        isLevelComplete,
        isGameComplete,
      });
      setGameState("result");
    },
    [currentPattern, timeLeft, score, patternIndex, level, stop, submitted]
  );

  const handleNext = useCallback(() => {
    setPatternIndex((prev) => prev + 1);
    setSubmitted(false);
    setGameState("playing");
    reset(TIMER_SECONDS);
    start();
  }, [reset, start]);

  const handleReplay = useCallback(() => {
    if (lastResult?.isGameComplete) {
      setScore(0);
      setLevel(1);
      startLevel(1);
    } else {
      startLevel(level);
    }
  }, [lastResult, level, startLevel]);

  const handleNextLevel = useCallback(() => {
    const nextLvl = Math.min(level + 1, MAX_LEVEL);
    setLevel(nextLvl);
    startLevel(nextLvl);
  }, [level, startLevel]);

  return (
    <div className="app">
      <div className="app-inner">
        {gameState === "start" && <StartScreen onStart={handleStart} />}

        {gameState === "playing" && currentPattern && (
          <GameScreen
            pattern={currentPattern}
            level={level}
            score={score}
            timeLeft={timeLeft}
            onSubmit={handleSubmit}
            patternsCompleted={patternIndex}
            patternsPerLevel={PATTERNS_PER_LEVEL}
          />
        )}

        {gameState === "result" && lastResult && (
          <ResultScreen
            {...lastResult}
            onNext={handleNext}
            onReplay={handleReplay}
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
    </div>
  );
}
