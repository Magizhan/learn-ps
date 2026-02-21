import { useMemo } from "react";

const BG_COLOR = "#1a1a2e";

export default function MatchstickCanvas({ matchsticks, width = 500, height = 350 }) {
  const { viewBox } = useMemo(() => {
    if (!matchsticks || matchsticks.length === 0) {
      return { viewBox: "0 0 100 100" };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of matchsticks) {
      minX = Math.min(minX, s.x1, s.x2);
      minY = Math.min(minY, s.y1, s.y2);
      maxX = Math.max(maxX, s.x1, s.x2);
      maxY = Math.max(maxY, s.y1, s.y2);
    }

    const padding = 15;
    const vbX = minX - padding;
    const vbY = minY - padding;
    const vbW = maxX - minX + padding * 2;
    const vbH = maxY - minY + padding * 2;

    return { viewBox: `${vbX} ${vbY} ${vbW} ${vbH}` };
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
        <defs>
          {/* Matchstick body gradient - wooden look */}
          <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5d89a" />
            <stop offset="30%" stopColor="#e8c46e" />
            <stop offset="70%" stopColor="#d4a84a" />
            <stop offset="100%" stopColor="#c89838" />
          </linearGradient>
          {/* Match head gradient */}
          <radialGradient id="headGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e84040" />
            <stop offset="60%" stopColor="#c02020" />
            <stop offset="100%" stopColor="#8b1a1a" />
          </radialGradient>
          {/* Subtle glow for matchsticks */}
          <filter id="stickShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.3" dy="0.5" stdDeviation="0.4" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {matchsticks.map((stick, i) => {
          const dx = stick.x2 - stick.x1;
          const dy = stick.y2 - stick.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) return null;

          // Unit direction
          const ux = dx / len;
          const uy = dy / len;

          // Head is at x1,y1 — occupy ~15% of the stick length
          const headLen = Math.min(len * 0.18, 5);
          const headEndX = stick.x1 + ux * headLen;
          const headEndY = stick.y1 + uy * headLen;

          // Body thickness
          const bodyWidth = 2.8;
          const headWidth = 3.6;

          return (
            <g key={i} filter="url(#stickShadow)">
              {/* Matchstick wooden body */}
              <line
                x1={headEndX}
                y1={headEndY}
                x2={stick.x2}
                y2={stick.y2}
                stroke="url(#woodGrad)"
                strokeWidth={bodyWidth}
                strokeLinecap="round"
              />
              {/* Match head (red tip) */}
              <line
                x1={stick.x1}
                y1={stick.y1}
                x2={headEndX}
                y2={headEndY}
                stroke="url(#headGrad)"
                strokeWidth={headWidth}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
