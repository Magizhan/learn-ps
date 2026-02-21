import { useMemo } from "react";

const STICK_COLOR = "#e8a640";
const STICK_TIP_COLOR = "#d44";
const BG_COLOR = "#1a1a2e";

export default function MatchstickCanvas({ matchsticks, width = 400, height = 300 }) {
  // Compute bounding box and scale
  const { scaledSticks, viewBox } = useMemo(() => {
    if (!matchsticks || matchsticks.length === 0) {
      return { scaledSticks: [], viewBox: "0 0 100 100" };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of matchsticks) {
      minX = Math.min(minX, s.x1, s.x2);
      minY = Math.min(minY, s.y1, s.y2);
      maxX = Math.max(maxX, s.x1, s.x2);
      maxY = Math.max(maxY, s.y1, s.y2);
    }

    const padding = 8;
    const vbX = minX - padding;
    const vbY = minY - padding;
    const vbW = maxX - minX + padding * 2;
    const vbH = maxY - minY + padding * 2;

    return {
      scaledSticks: matchsticks,
      viewBox: `${vbX} ${vbY} ${vbW} ${vbH}`,
    };
  }, [matchsticks]);

  return (
    <div className="canvas-container">
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        style={{
          background: BG_COLOR,
          borderRadius: "12px",
          border: "2px solid #333",
          maxWidth: "100%",
        }}
      >
        {/* Matchstick glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="stickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0c060" />
            <stop offset="100%" stopColor="#c87830" />
          </linearGradient>
        </defs>

        {scaledSticks.map((stick, i) => {
          const dx = stick.x2 - stick.x1;
          const dy = stick.y2 - stick.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = (dx / len) * 0.8;
          const ny = (dy / len) * 0.8;

          return (
            <g key={i}>
              {/* Matchstick body */}
              <line
                x1={stick.x1}
                y1={stick.y1}
                x2={stick.x2}
                y2={stick.y2}
                stroke="url(#stickGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              {/* Match head (red tip) */}
              <circle
                cx={stick.x1}
                cy={stick.y1}
                r="1.5"
                fill={STICK_TIP_COLOR}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
