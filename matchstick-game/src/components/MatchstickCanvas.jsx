import { useMemo } from "react";

const BG_COLOR = "#1a1a2e";
const WOOD_COLOR = "#e0b050";
const WOOD_DARK = "#c89838";
const HEAD_COLOR = "#cc2222";
const HEAD_HIGHLIGHT = "#e84040";

export default function MatchstickCanvas({ matchsticks, width = 500, height = 350, compact = false }) {
  // Collect unique vertex positions so we only draw ONE head per shared vertex
  const { viewBox, uniqueHeads, stickBodies } = useMemo(() => {
    if (!matchsticks || matchsticks.length === 0) {
      return { viewBox: "0 0 100 100", uniqueHeads: [], stickBodies: [] };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const s of matchsticks) {
      minX = Math.min(minX, s.x1, s.x2);
      minY = Math.min(minY, s.y1, s.y2);
      maxX = Math.max(maxX, s.x1, s.x2);
      maxY = Math.max(maxY, s.y1, s.y2);
    }

    const padding = compact ? 8 : 12;
    const vbX = minX - padding;
    const vbY = minY - padding;
    const vbW = Math.max(maxX - minX + padding * 2, 1);
    const vbH = Math.max(maxY - minY + padding * 2, 1);
    const vb = `${vbX} ${vbY} ${vbW} ${vbH}`;

    // Build stick body data
    const bodies = [];
    // Track unique vertex positions using rounded keys
    const headMap = new Map();

    for (let i = 0; i < matchsticks.length; i++) {
      const stick = matchsticks[i];
      const dx = stick.x2 - stick.x1;
      const dy = stick.y2 - stick.y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) continue;

      bodies.push({ stick, len, idx: i });

      // Register head vertex (x1,y1) — deduplicate by rounded position
      const hKey = `${Math.round(stick.x1 * 10)},${Math.round(stick.y1 * 10)}`;
      if (!headMap.has(hKey)) {
        headMap.set(hKey, { x: stick.x1, y: stick.y1, len });
      }
      // Register tail vertex (x2,y2) too
      const tKey = `${Math.round(stick.x2 * 10)},${Math.round(stick.y2 * 10)}`;
      if (!headMap.has(tKey)) {
        headMap.set(tKey, { x: stick.x2, y: stick.y2, len });
      }
    }

    return {
      viewBox: vb,
      uniqueHeads: Array.from(headMap.values()),
      stickBodies: bodies,
    };
  }, [matchsticks, compact]);

  const bodyWidth = compact ? 1.8 : 2.2;

  return (
    <div className="canvas-container">
      <svg
        viewBox={viewBox}
        width={width}
        height={height}
        style={{
          background: BG_COLOR,
          borderRadius: compact ? "8px" : "12px",
          border: `2px solid #333`,
          maxWidth: "100%",
        }}
      >
        <defs>
          <filter id="stickShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.4" dy="0.6" stdDeviation="0.5" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Draw all stick bodies first (below heads) */}
        {stickBodies.map(({ stick, len, idx }) => {
          const dx = stick.x2 - stick.x1;
          const dy = stick.y2 - stick.y1;
          const ux = dx / len;
          const uy = dy / len;
          const headRadius = Math.min(len * 0.09, 2.8);
          const bodyStartX = stick.x1 + ux * headRadius * 1.3;
          const bodyStartY = stick.y1 + uy * headRadius * 1.3;

          return (
            <g key={`body-${idx}`} filter="url(#stickShadow)">
              <line
                x1={bodyStartX} y1={bodyStartY}
                x2={stick.x2} y2={stick.y2}
                stroke={WOOD_DARK}
                strokeWidth={bodyWidth + 0.6}
                strokeLinecap="round"
              />
              <line
                x1={bodyStartX} y1={bodyStartY}
                x2={stick.x2} y2={stick.y2}
                stroke={WOOD_COLOR}
                strokeWidth={bodyWidth}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Draw unique vertex dots on top — no overlapping */}
        {uniqueHeads.map((h, i) => {
          const headRadius = Math.min(h.len * 0.09, 2.8);
          return (
            <g key={`head-${i}`}>
              <circle cx={h.x} cy={h.y} r={headRadius + 0.3} fill={HEAD_COLOR} />
              <circle cx={h.x} cy={h.y} r={headRadius * 0.6} fill={HEAD_HIGHLIGHT} opacity="0.6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
