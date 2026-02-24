export default function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <div className="logo">
        <span className="logo-icon">🔥</span>
        <h1>Matchstick Patterns</h1>
      </div>
      <p className="tagline">
        Count the matchsticks. Beat the clock. Rise through the levels.
      </p>
      <div className="rules">
        <h3>How to Play</h3>
        <ul>
          <li>A pattern made of matchsticks will appear</li>
          <li>Count the total number of matchsticks</li>
          <li>Submit your answer before the 60-second timer runs out</li>
          <li>Earn points for correct answers — bonus for speed!</li>
          <li>Complete patterns to advance through 7 levels of difficulty</li>
          <li>Shapes include squares, triangles, pentagons, hexagons, and more!</li>
        </ul>
      </div>
      <button className="btn btn-primary btn-large" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}
