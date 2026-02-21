import { useMemo } from "react";

const BG_COLOR = "#1a1a2e";
const WOOD_COLOR = "#e0b050";
const WOOD_DARK = "#c89838";
const HEAD_COLOR = "#cc2222";
const HEAD_HIGHLIGHT = "#e84040";

export default function MatchstickCanvas({ matchsticks, width = 500, height = 350 }) {
  const viewBox = useMemo(() => {
    if (!matchsticks || matchsticks.length === 0) {
      return "0 0 100 100";
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of matchsticks) {
      minX = Math.min(minX, s.x1, s.x2);
      minY = Math.min(minY, s.y1, s.y2);
      maxX = Math.max(maxX, s.x1, s.x2);
      maxY = Math.max(maxY, s.y1, s.y2);
    }

    const padding = 12;
    const vbX = minX - padding;
    const vbY = minY - padding;
    const vbW = Math.max(maxX - minX + padding * 2, 1);
    const vbH = Math.max(maxY - minY + padding * 2, 1);

    return `${vbX} ${vbY} ${vbW} ${vbH}`;
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
          <filter id="stickShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.4" dy="0.6" stdDeviation="0.5" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {matchsticks.map((stick, i) => {
          const dx = stick.x2 - stick.x1;
          const dy = stick.y2 - stick.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) return null;

          // Unit direction vector
          const ux = dx / len;
          const uy = dy / len;

          // Head position: match head is at (x1,y1), extends ~15% of stick length
          const headRadius = Math.min(len * 0.09, 2.8);
          const headCenterX = stick.x1 + ux * headRadius;
          const headCenterY = stick.y1 + uy * headRadius;

          // Body starts just past the head
          const bodyStartX = stick.x1 + ux * headRadius * 1.3;
          const bodyStartY = stick.y1 + uy * headRadius * 1.3;

          const bodyWidth = 2.2;

          return (
            <g key={i} filter="url(#stickShadow)">
              {/* Matchstick wooden body — dark edge for depth */}
              <line
                x1={bodyStartX}
                y1={bodyStartY}
                x2={stick.x2}
                y2={stick.y2}
                stroke={WOOD_DARK}
                strokeWidth={bodyWidth + 0.6}
                strokeLinecap="round"
              />
              {/* Matchstick wooden body — lighter core */}
              <line
                x1={bodyStartX}
                y1={bodyStartY}
                x2={stick.x2}
                y2={stick.y2}
                stroke={WOOD_COLOR}
                strokeWidth={bodyWidth}
                strokeLinecap="round"
              />
              {/* Match head — outer dark ring */}
              <circle
                cx={headCenterX}
                cy={headCenterY}
                r={headRadius + 0.3}
                fill={HEAD_COLOR}
              />
              {/* Match head — inner highlight */}
              <circle
                cx={headCenterX - ux * 0.3}
                cy={headCenterY - uy * 0.3}
                r={headRadius * 0.6}
                fill={HEAD_HIGHLIGHT}
                opacity="0.6"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
