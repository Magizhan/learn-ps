import { useMemo } from "react";

const BG_COLOR = "#1a1a2e";
const WOOD_COLOR = "#e0b050";
const WOOD_DARK = "#c89838";
const HEAD_COLOR = "#cc2222";
const HEAD_HIGHLIGHT = "#e84040";

export default function MatchstickCanvas({ matchsticks, width = 500, height = 350, compact = false }) {
  const { viewBox, uniqueHeads } = useMemo(() => {
    if (!matchsticks || matchsticks.length === 0) {
      return { viewBox: "0 0 100 100", uniqueHeads: [] };
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

    // Deduplicate vertex positions for heads
    const headMap = new Map();
    for (const stick of matchsticks) {
      const dx = stick.x2 - stick.x1;
      const dy = stick.y2 - stick.y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) continue;

      for (const [px, py] of [[stick.x1, stick.y1], [stick.x2, stick.y2]]) {
        const key = `${Math.round(px * 10)},${Math.round(py * 10)}`;
        if (!headMap.has(key)) {
          headMap.set(key, { x: px, y: py, len });
        }
      }
    }

    return {
      viewBox: `${vbX} ${vbY} ${vbW} ${vbH}`,
      uniqueHeads: Array.from(headMap.values()),
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
          border: "2px solid #333",
          maxWidth: "100%",
        }}
      >
        {/* Layer 1: Draw all matchstick wooden bodies */}
        {matchsticks.map((stick, i) => {
          const dx = stick.x2 - stick.x1;
          const dy = stick.y2 - stick.y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) return null;

          return (
            <g key={`b-${i}`}>
              <line
                x1={stick.x1} y1={stick.y1}
                x2={stick.x2} y2={stick.y2}
                stroke={WOOD_DARK}
                strokeWidth={bodyWidth + 0.6}
                strokeLinecap="round"
              />
              <line
                x1={stick.x1} y1={stick.y1}
                x2={stick.x2} y2={stick.y2}
                stroke={WOOD_COLOR}
                strokeWidth={bodyWidth}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Layer 2: Draw ONE dot per unique vertex — no overlapping */}
        {uniqueHeads.map((h, i) => {
          const headRadius = Math.min(h.len * 0.09, 2.8);
          return (
            <g key={`h-${i}`}>
              <circle cx={h.x} cy={h.y} r={headRadius + 0.3} fill={HEAD_COLOR} />
              <circle cx={h.x} cy={h.y} r={headRadius * 0.6} fill={HEAD_HIGHLIGHT} opacity="0.6" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
