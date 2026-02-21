// Matchstick pattern definitions — ALL CONNECTED patterns
// Each matchstick is {x1, y1, x2, y2} — head is at (x1,y1)
// Every pattern is a single connected structure (shared edges).

const G = 30; // one matchstick length

function m(x1, y1, x2, y2) {
  return { x1, y1, x2, y2 };
}

// Deduplicate overlapping matchsticks (shared edges counted once)
function dedup(sticks) {
  const seen = new Set();
  const result = [];
  for (const s of sticks) {
    const x1 = Math.round(s.x1 * 100) / 100;
    const y1 = Math.round(s.y1 * 100) / 100;
    const x2 = Math.round(s.x2 * 100) / 100;
    const y2 = Math.round(s.y2 * 100) / 100;
    // Normalize direction so both orientations produce the same key
    const key =
      x1 < x2 || (x1 === x2 && y1 <= y2)
        ? `${x1},${y1}-${x2},${y2}`
        : `${x2},${y2}-${x1},${y1}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(s);
    }
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════
// SHAPE PRIMITIVES (used as building blocks, composed via dedup)
// ═══════════════════════════════════════════════════════════════

// Triangle: apex at top, base at bottom. Base at y=oy+G.
function triangle(ox, oy) {
  return [
    m(ox, oy + G, ox + G * 0.5, oy),
    m(ox + G, oy + G, ox + G * 0.5, oy),
    m(ox, oy + G, ox + G, oy + G),
  ];
}

// Inverted triangle: top edge at y=oy, point at y=oy+G.
function triDown(ox, oy) {
  return [
    m(ox, oy, ox + G * 0.5, oy + G),
    m(ox + G, oy, ox + G * 0.5, oy + G),
    m(ox, oy, ox + G, oy),
  ];
}

// Square at (ox, oy), size G x G
function square(ox, oy) {
  return [
    m(ox, oy, ox + G, oy),
    m(ox + G, oy, ox + G, oy + G),
    m(ox + G, oy + G, ox, oy + G),
    m(ox, oy + G, ox, oy),
  ];
}

// Diamond at (ox, oy)
function diamond(ox, oy) {
  const cx = ox + G / 2;
  const cy = oy + G / 2;
  return [
    m(cx, oy, ox + G, cy),
    m(ox + G, cy, cx, oy + G),
    m(cx, oy + G, ox, cy),
    m(ox, cy, cx, oy),
  ];
}

// ═══════════════════════════════════════════════════════════════
// CONNECTED STRUCTURE BUILDERS
// ═══════════════════════════════════════════════════════════════

// Row of n connected squares sharing vertical edges => 3n+1 sticks
function connectedSquaresRow(ox, oy, n) {
  const sticks = [];
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox + i * G, oy, ox + (i + 1) * G, oy));
    sticks.push(m(ox + i * G, oy + G, ox + (i + 1) * G, oy + G));
  }
  for (let i = 0; i <= n; i++) {
    sticks.push(m(ox + i * G, oy, ox + i * G, oy + G));
  }
  return sticks;
}

// Column of n connected squares sharing horizontal edges => 3n+1 sticks
function connectedSquaresCol(ox, oy, n) {
  const sticks = [];
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox, oy + i * G, ox, oy + (i + 1) * G));
    sticks.push(m(ox + G, oy + i * G, ox + G, oy + (i + 1) * G));
  }
  for (let i = 0; i <= n; i++) {
    sticks.push(m(ox, oy + i * G, ox + G, oy + i * G));
  }
  return sticks;
}

// Row of n triangles sharing base (zigzag). Connected at vertices. => 3n sticks
function triangleRow(ox, oy, n) {
  const sticks = [];
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox + i * G, oy + G, ox + (i + 1) * G, oy + G));
    const cx = ox + i * G + G * 0.5;
    sticks.push(m(ox + i * G, oy + G, cx, oy));
    sticks.push(m(cx, oy, ox + (i + 1) * G, oy + G));
  }
  return sticks;
}

// Grid of squares (cols x rows) sharing all edges
function squareGrid(ox, oy, cols, rows) {
  const sticks = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      sticks.push(m(ox + c * G, oy + r * G, ox + (c + 1) * G, oy + r * G));
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols; c++) {
      sticks.push(m(ox + c * G, oy + r * G, ox + c * G, oy + (r + 1) * G));
    }
  }
  return sticks;
}

// Staircase: n steps, each step = 2 sticks. Connected.
function stairs(ox, oy, steps) {
  const sticks = [];
  for (let i = 0; i < steps; i++) {
    sticks.push(m(ox + i * G, oy + i * G, ox + i * G, oy + (i + 1) * G));
    sticks.push(m(ox + i * G, oy + (i + 1) * G, ox + (i + 1) * G, oy + (i + 1) * G));
  }
  return sticks;
}

// L-shape: hLen squares going right, vLen squares going down from right end
function squaresL(ox, oy, hLen, vLen) {
  return dedup([
    ...connectedSquaresRow(ox, oy, hLen),
    ...connectedSquaresCol(ox + (hLen - 1) * G, oy, vLen),
  ]);
}

// T-shape: hLen squares horizontal, vLen squares down from center
function squaresT(ox, oy, hLen, vLen) {
  const centerIdx = Math.floor(hLen / 2);
  return dedup([
    ...connectedSquaresRow(ox, oy, hLen),
    ...connectedSquaresCol(ox + centerIdx * G, oy, vLen),
  ]);
}

// Cross/plus: center square with arms extending in 4 directions
function squaresCross(ox, oy, armLen) {
  const center = armLen * G;
  return dedup([
    // Horizontal bar
    ...connectedSquaresRow(ox, oy + center, armLen * 2 + 1),
    // Vertical bar
    ...connectedSquaresCol(ox + center, oy, armLen * 2 + 1),
  ]);
}

// Z-shape: topLen squares on top row, bottomLen on bottom row, connected by 1 square offset
function squaresZ(ox, oy, topLen, bottomLen) {
  return dedup([
    ...connectedSquaresRow(ox + (bottomLen - 1) * G, oy, topLen),
    ...connectedSquaresCol(ox + (bottomLen - 1) * G, oy, 2),
    ...connectedSquaresRow(ox, oy + G, bottomLen),
  ]);
}

// Pyramid: rows of connected squares, each row shorter and centered
function squaresPyramid(ox, oy, baseWidth) {
  const allSticks = [];
  for (let row = 0; row < baseWidth; row++) {
    const width = baseWidth - row;
    const offsetX = ox + row * G * 0.5;
    const offsetY = oy + (baseWidth - 1 - row) * G;
    allSticks.push(...connectedSquaresRow(offsetX, offsetY, width));
  }
  return dedup(allSticks);
}

// H-shape: two vertical columns connected by a horizontal bridge in the middle
function squaresH(ox, oy, colHeight, bridgeWidth) {
  const midRow = Math.floor(colHeight / 2);
  return dedup([
    ...connectedSquaresCol(ox, oy, colHeight),
    ...connectedSquaresCol(ox + (bridgeWidth + 1) * G, oy, colHeight),
    ...connectedSquaresRow(ox, oy + midRow * G, bridgeWidth + 2),
  ]);
}

// ═══════════════════════════════════════════════════════════════
// LEVEL DEFINITIONS — ALL CONNECTED, building complexity
// ═══════════════════════════════════════════════════════════════

export const levels = [
  // ━━━ LEVEL 1: Basic connected structures ━━━
  {
    level: 1,
    patterns: [
      {
        name: "Three Connected Squares",
        description: "Three squares sharing edges in a row.",
        matchsticks: connectedSquaresRow(0, 20, 3),
      },
      {
        name: "Square Column",
        description: "Three squares stacked vertically, sharing edges.",
        matchsticks: connectedSquaresCol(20, 0, 3),
      },
      {
        name: "Staircase",
        description: "A connected staircase of four steps.",
        matchsticks: stairs(0, 0, 4),
      },
      {
        name: "Triangle Wave",
        description: "Four triangles connected along a shared base line.",
        matchsticks: triangleRow(0, 15, 4),
      },
      {
        name: "Two-by-One Grid",
        description: "Two squares side by side sharing one wall.",
        matchsticks: squareGrid(10, 20, 2, 1),
      },
    ],
  },

  // ━━━ LEVEL 2: Larger connected structures ━━━
  {
    level: 2,
    patterns: [
      {
        name: "Five Connected Squares",
        description: "Five squares sharing edges in a long row.",
        matchsticks: connectedSquaresRow(0, 20, 5),
      },
      {
        name: "Tall Tower",
        description: "Five squares stacked in a column sharing edges.",
        matchsticks: connectedSquaresCol(20, 0, 5),
      },
      {
        name: "Triangle Wave (6)",
        description: "Six triangles connected along a shared base.",
        matchsticks: triangleRow(0, 15, 6),
      },
      {
        name: "Square Grid 2x2",
        description: "A 2x2 grid of squares sharing all internal edges.",
        matchsticks: squareGrid(10, 10, 2, 2),
      },
      {
        name: "Long Staircase",
        description: "A connected staircase of six steps.",
        matchsticks: stairs(0, 0, 6),
      },
    ],
  },

  // ━━━ LEVEL 3: Compound connected shapes ━━━
  {
    level: 3,
    patterns: [
      {
        name: "The L-shape",
        description: "An L made of connected squares: 3 across and 3 down.",
        matchsticks: squaresL(0, 0, 3, 3),
      },
      {
        name: "The T-shape",
        description: "A T made of connected squares: 5 across with 3 hanging down from center.",
        matchsticks: squaresT(0, 0, 5, 3),
      },
      {
        name: "Square Grid 3x2",
        description: "A 3x2 grid of squares sharing all edges.",
        matchsticks: squareGrid(0, 10, 3, 2),
      },
      {
        name: "The Z-shape",
        description: "A Z made of connected squares: 3 on top, offset to 3 on bottom.",
        matchsticks: squaresZ(0, 0, 3, 3),
      },
      {
        name: "Tower with Hat",
        description: "A column of 4 squares topped with a connected triangle.",
        matchsticks: dedup([
          ...connectedSquaresCol(0, G, 4),
          ...triangle(0, 0), // triangle base at y=G shares with square top
        ]),
      },
    ],
  },

  // ━━━ LEVEL 4: Connected + attached non-repeating elements ━━━
  {
    level: 4,
    patterns: [
      {
        name: "Battlements",
        description: "Four connected squares topped with four triangles. Shared edges!",
        matchsticks: dedup([
          ...connectedSquaresRow(0, G, 4),
          // Triangles on top, sharing the squares' top edge as their base
          ...triangle(0, 0),
          ...triangle(G, 0),
          ...triangle(G * 2, 0),
          ...triangle(G * 3, 0),
        ]),
      },
      {
        name: "The Cross",
        description: "A plus-sign shape made of connected squares.",
        matchsticks: squaresCross(0, 0, 1),
      },
      {
        name: "The H-shape",
        description: "Two columns of 3 squares connected by a horizontal bridge.",
        matchsticks: squaresH(0, 0, 3, 1),
      },
      {
        name: "Pyramid (3 base)",
        description: "A pyramid of connected squares: 3 on bottom, 2 in middle, 1 on top.",
        matchsticks: squaresPyramid(0, 0, 3),
      },
      {
        name: "Row with Teeth",
        description: "Five connected squares with inverted triangles hanging below. Shared edges!",
        matchsticks: dedup([
          ...connectedSquaresRow(0, 0, 5),
          // Inverted triangles below, sharing the squares' bottom edge
          ...triDown(0, G),
          ...triDown(G, G),
          ...triDown(G * 2, G),
          ...triDown(G * 3, G),
          ...triDown(G * 4, G),
        ]),
      },
    ],
  },

  // ━━━ LEVEL 5: Complex connected compounds ━━━
  {
    level: 5,
    patterns: [
      {
        name: "Castle Wall",
        description:
          "Six connected squares with six triangles on top and a diamond flag. All connected!",
        matchsticks: dedup([
          ...connectedSquaresRow(0, G, 6),
          ...triangle(0, 0),
          ...triangle(G, 0),
          ...triangle(G * 2, 0),
          ...triangle(G * 3, 0),
          ...triangle(G * 4, 0),
          ...triangle(G * 5, 0),
          // Non-repeating: diamond flag on rightmost triangle tip
          ...diamond(G * 5, -G * 1.3),
        ]),
      },
      {
        name: "The Rocket",
        description:
          "A column of 4 connected squares with a nose triangle, side fins, and exhaust.",
        matchsticks: dedup([
          // Body: 4 connected squares vertically
          ...connectedSquaresCol(0, G, 4),
          // Nose cone: triangle on top sharing the top edge
          ...triangle(0, 0),
          // Left fin: 2 sticks attached to bottom-left
          m(0, G * 4, -G * 0.5, G * 4 + G * 0.7),
          m(-G * 0.5, G * 4 + G * 0.7, 0, G * 5),
          // Right fin: 2 sticks attached to bottom-right
          m(G, G * 4, G + G * 0.5, G * 4 + G * 0.7),
          m(G + G * 0.5, G * 4 + G * 0.7, G, G * 5),
          // Exhaust: inverted V at the bottom, sharing bottom edge
          m(0, G * 5, G * 0.5, G * 5 + G * 0.6),
          m(G, G * 5, G * 0.5, G * 5 + G * 0.6),
        ]),
      },
      {
        name: "Square Grid 4x3",
        description: "A large 4x3 grid of connected squares. Count every stick!",
        matchsticks: squareGrid(0, 0, 4, 3),
      },
      {
        name: "Fortress",
        description:
          "A 3x2 grid base with 3 triangles on top and 3 inverted triangles below. All connected!",
        matchsticks: dedup([
          ...squareGrid(0, G, 3, 2),
          // Triangles on top (bases shared with grid top edge)
          ...triangle(0, 0),
          ...triangle(G, 0),
          ...triangle(G * 2, 0),
          // Inverted triangles below (tops shared with grid bottom edge)
          ...triDown(0, G * 3),
          ...triDown(G, G * 3),
          ...triDown(G * 2, G * 3),
        ]),
      },
      {
        name: "Arrow",
        description:
          "Six connected squares in a row with a large triangle arrowhead at the right end.",
        matchsticks: dedup([
          ...connectedSquaresRow(0, G * 0.5, 6),
          // Large triangle arrowhead on the right — triangle slopes attached to right edge
          m(G * 6, 0, G * 7, G),
          m(G * 7, G, G * 6, G * 2),
          m(G * 6, 0, G * 6, G * 0.5),
          m(G * 6, G * 1.5, G * 6, G * 2),
        ]),
      },
    ],
  },
];

// Auto-calculate totalMatchsticks from actual array length
for (const level of levels) {
  for (const pattern of level.patterns) {
    pattern.totalMatchsticks = pattern.matchsticks.length;
  }
}

export function getLevel(levelNum) {
  return levels.find((l) => l.level === levelNum) || levels[0];
}

export const MAX_LEVEL = levels.length;
