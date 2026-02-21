// Matchstick pattern definitions
// Each matchstick is {x1, y1, x2, y2} — head is at (x1,y1)
// Coordinate space is arbitrary; the canvas auto-fits with padding.

const G = 30; // one matchstick length

function m(x1, y1, x2, y2) {
  return { x1, y1, x2, y2 };
}

// ═══════════════════════════════════════════════════════════════
// SHAPE PRIMITIVES
// ═══════════════════════════════════════════════════════════════

function lShape(ox, oy) {
  return [
    m(ox, oy, ox, oy + G),
    m(ox, oy + G, ox + G, oy + G),
  ];
}

function vShape(ox, oy) {
  return [
    m(ox, oy, ox + G * 0.5, oy + G * 0.7),
    m(ox + G, oy, ox + G * 0.5, oy + G * 0.7),
  ];
}

function triangle(ox, oy) {
  return [
    m(ox, oy + G, ox + G * 0.5, oy),
    m(ox + G, oy + G, ox + G * 0.5, oy),
    m(ox, oy + G, ox + G, oy + G),
  ];
}

function triDown(ox, oy) {
  return [
    m(ox, oy, ox + G * 0.5, oy + G),
    m(ox + G, oy, ox + G * 0.5, oy + G),
    m(ox, oy, ox + G, oy),
  ];
}

function square(ox, oy) {
  return [
    m(ox, oy, ox + G, oy),
    m(ox + G, oy, ox + G, oy + G),
    m(ox + G, oy + G, ox, oy + G),
    m(ox, oy + G, ox, oy),
  ];
}

function pentagon(ox, oy) {
  const w = G;
  const h = G;
  const cx = ox + w / 2;
  const midY = oy + h * 0.38;
  const botY = oy + h;
  return [
    m(cx, oy, ox + w, midY),
    m(ox + w, midY, ox + w * 0.82, botY),
    m(ox + w * 0.82, botY, ox + w * 0.18, botY),
    m(ox + w * 0.18, botY, ox, midY),
    m(ox, midY, cx, oy),
  ];
}

function hexagon(ox, oy) {
  const w = G;
  const h = G * 0.866;
  const q = w * 0.25;
  return [
    m(ox + q, oy, ox + w - q, oy),
    m(ox + w - q, oy, ox + w, oy + h / 2),
    m(ox + w, oy + h / 2, ox + w - q, oy + h),
    m(ox + w - q, oy + h, ox + q, oy + h),
    m(ox + q, oy + h, ox, oy + h / 2),
    m(ox, oy + h / 2, ox + q, oy),
  ];
}

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

function plus(ox, oy) {
  const cx = ox + G / 2;
  const cy = oy + G / 2;
  const half = G / 2;
  return [
    m(cx, cy - half, cx, cy),
    m(cx, cy, cx, cy + half),
    m(cx - half, cy, cx, cy),
    m(cx, cy, cx + half, cy),
  ];
}

function arrowRight(ox, oy) {
  return [
    m(ox, oy + G * 0.5, ox + G * 0.65, oy + G * 0.5),
    m(ox + G, oy + G * 0.5, ox + G * 0.65, oy),
    m(ox + G, oy + G * 0.5, ox + G * 0.65, oy + G),
  ];
}

// ═══════════════════════════════════════════════════════════════
// CONNECTED / SHARED-EDGE SHAPES
// ═══════════════════════════════════════════════════════════════

// n squares in a row sharing vertical edges => 3n+1 sticks
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

// n squares in a column sharing horizontal edges => 3n+1 sticks
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

// n triangles in a row sharing base segments => n base + 2n slopes = 3n sticks
function triangleRow(ox, oy, n) {
  const sticks = [];
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox + i * G, oy + G, ox + (i + 1) * G, oy + G));
  }
  for (let i = 0; i < n; i++) {
    const cx = ox + i * G + G * 0.5;
    sticks.push(m(ox + i * G, oy + G, cx, oy));
    sticks.push(m(cx, oy, ox + (i + 1) * G, oy + G));
  }
  return sticks;
}

// Grid of squares (rows x cols) sharing all edges
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

// ═══════════════════════════════════════════════════════════════
// COMPOUND SHAPES
// ═══════════════════════════════════════════════════════════════

// House: triangle roof + square body + roof base line = 6 sticks
function house(ox, oy) {
  return [
    m(ox, oy + G, ox + G * 0.5, oy),
    m(ox + G * 0.5, oy, ox + G, oy + G),
    m(ox + G, oy + G, ox + G, oy + G * 2),
    m(ox + G, oy + G * 2, ox, oy + G * 2),
    m(ox, oy + G * 2, ox, oy + G),
    m(ox, oy + G, ox + G, oy + G),
  ];
}

// Bow-tie / hourglass: 6 sticks
function bowTie(ox, oy) {
  const cx = ox + G;
  const cy = oy + G * 0.5;
  return [
    m(ox, oy, cx, cy),
    m(ox, oy + G, cx, cy),
    m(ox, oy, ox, oy + G),
    m(cx, cy, ox + G * 2, oy),
    m(cx, cy, ox + G * 2, oy + G),
    m(ox + G * 2, oy, ox + G * 2, oy + G),
  ];
}

// Tree: triangle canopy + trunk = 4 sticks
function tree(ox, oy) {
  return [
    m(ox, oy + G, ox + G * 0.5, oy),
    m(ox + G * 0.5, oy, ox + G, oy + G),
    m(ox, oy + G, ox + G, oy + G),
    m(ox + G * 0.5, oy + G, ox + G * 0.5, oy + G * 1.6),
  ];
}

// Star of David: 2 overlapping triangles = 6 sticks
function starOfDavid(ox, oy) {
  const w = G * 1.2;
  const h = G;
  const cx = ox + w / 2;
  return [
    m(ox, oy + h * 0.7, cx, oy),
    m(cx, oy, ox + w, oy + h * 0.7),
    m(ox + w, oy + h * 0.7, ox, oy + h * 0.7),
    m(ox, oy + h * 0.3, cx, oy + h),
    m(cx, oy + h, ox + w, oy + h * 0.3),
    m(ox + w, oy + h * 0.3, ox, oy + h * 0.3),
  ];
}

// Windmill: 8 sticks radiating from center
function windmill(ox, oy) {
  const cx = ox + G;
  const cy = oy + G;
  return [
    m(cx, cy, cx - G * 0.3, cy - G),
    m(cx, cy, cx + G * 0.3, cy - G),
    m(cx, cy, cx + G, cy - G * 0.3),
    m(cx, cy, cx + G, cy + G * 0.3),
    m(cx, cy, cx + G * 0.3, cy + G),
    m(cx, cy, cx - G * 0.3, cy + G),
    m(cx, cy, cx - G, cy + G * 0.3),
    m(cx, cy, cx - G, cy - G * 0.3),
  ];
}

// Crown: 9 sticks
function crown(ox, oy) {
  const w = G * 2;
  return [
    m(ox, oy + G, ox + w, oy + G),
    m(ox, oy + G, ox, oy + G * 0.4),
    m(ox + w, oy + G, ox + w, oy + G * 0.4),
    m(ox, oy + G * 0.4, ox + w * 0.2, oy),
    m(ox + w * 0.2, oy, ox + w * 0.4, oy + G * 0.4),
    m(ox + w * 0.4, oy + G * 0.4, ox + w * 0.5, oy),
    m(ox + w * 0.5, oy, ox + w * 0.6, oy + G * 0.4),
    m(ox + w * 0.6, oy + G * 0.4, ox + w * 0.8, oy),
    m(ox + w * 0.8, oy, ox + w, oy + G * 0.4),
  ];
}

// Fence: posts + 2 horizontal rails
function fence(ox, oy, posts) {
  const sticks = [];
  const spacing = G * 0.6;
  for (let i = 0; i < posts; i++) {
    sticks.push(m(ox + i * spacing, oy, ox + i * spacing, oy + G));
  }
  const railY1 = oy + G * 0.3;
  const railY2 = oy + G * 0.7;
  for (let i = 0; i < posts - 1; i++) {
    sticks.push(m(ox + i * spacing, railY1, ox + (i + 1) * spacing, railY1));
    sticks.push(m(ox + i * spacing, railY2, ox + (i + 1) * spacing, railY2));
  }
  return sticks;
}

// Fish: diamond body + V tail + eye = 7 sticks
function fish(ox, oy) {
  const w = G * 1.5;
  const h = G;
  return [
    m(ox + w * 0.3, oy, ox + w * 0.7, oy + h * 0.5),
    m(ox + w * 0.7, oy + h * 0.5, ox + w * 0.3, oy + h),
    m(ox + w * 0.3, oy + h, ox, oy + h * 0.5),
    m(ox, oy + h * 0.5, ox + w * 0.3, oy),
    m(ox + w * 0.7, oy + h * 0.5, ox + w, oy),
    m(ox + w * 0.7, oy + h * 0.5, ox + w, oy + h),
    m(ox + w * 0.1, oy + h * 0.4, ox + w * 0.1, oy + h * 0.6),
  ];
}

// Staircase: n steps, each step = 2 sticks
function stairs(ox, oy, steps) {
  const sticks = [];
  for (let i = 0; i < steps; i++) {
    sticks.push(m(ox + i * G, oy + i * G, ox + i * G, oy + (i + 1) * G));
    sticks.push(m(ox + i * G, oy + (i + 1) * G, ox + (i + 1) * G, oy + (i + 1) * G));
  }
  return sticks;
}

// Boat: hull + mast + sail = 6 sticks
function boat(ox, oy) {
  return [
    m(ox + G * 0.3, oy + G, ox + G * 1.7, oy + G),
    m(ox + G * 0.3, oy + G, ox + G * 0.6, oy + G * 1.4),
    m(ox + G * 1.7, oy + G, ox + G * 1.4, oy + G * 1.4),
    m(ox + G * 0.6, oy + G * 1.4, ox + G * 1.4, oy + G * 1.4),
    m(ox + G, oy + G, ox + G, oy),
    m(ox + G, oy, ox + G * 1.6, oy + G),
  ];
}

// Rocket: nose + 3 body squares + 2 fins + exhaust = 18 sticks
function rocket(ox, oy) {
  const sticks = [];
  sticks.push(m(ox, oy + G, ox + G * 0.5, oy));
  sticks.push(m(ox + G * 0.5, oy, ox + G, oy + G));
  for (let i = 0; i < 3; i++) {
    const sy = oy + G + i * G;
    sticks.push(m(ox, sy, ox, sy + G));
    sticks.push(m(ox + G, sy, ox + G, sy + G));
  }
  for (let i = 0; i <= 3; i++) {
    sticks.push(m(ox, oy + G + i * G, ox + G, oy + G + i * G));
  }
  const finY = oy + G * 3;
  sticks.push(m(ox, finY, ox - G * 0.5, finY + G * 0.7));
  sticks.push(m(ox - G * 0.5, finY + G * 0.7, ox, finY + G));
  sticks.push(m(ox + G, finY, ox + G + G * 0.5, finY + G * 0.7));
  sticks.push(m(ox + G + G * 0.5, finY + G * 0.7, ox + G, finY + G));
  const exY = oy + G * 4;
  sticks.push(m(ox, exY, ox + G * 0.5, exY + G * 0.6));
  sticks.push(m(ox + G, exY, ox + G * 0.5, exY + G * 0.6));
  return sticks;
}

// ═══════════════════════════════════════════════════════════════
// LEVEL DEFINITIONS — emphasizing REPETITIVE patterns
// with non-repeating extras appended in higher levels
// ═══════════════════════════════════════════════════════════════

const SP = G + 10; // spacing between separate shapes

export const levels = [
  // ━━━ LEVEL 1: Pure repetition of simple shapes ━━━
  {
    level: 1,
    patterns: [
      {
        name: "Row of L-shapes",
        description: "Five identical L-shapes in a row.",
        matchsticks: [
          ...lShape(0, 30),
          ...lShape(SP, 30),
          ...lShape(SP * 2, 30),
          ...lShape(SP * 3, 30),
          ...lShape(SP * 4, 30),
        ],
      },
      {
        name: "V-shape Parade",
        description: "Six V-shapes (chevrons) lined up.",
        matchsticks: [
          ...vShape(0, 30),
          ...vShape(SP, 30),
          ...vShape(SP * 2, 30),
          ...vShape(SP * 3, 30),
          ...vShape(SP * 4, 30),
          ...vShape(SP * 5, 30),
        ],
      },
      {
        name: "Triangle Row",
        description: "Four separate triangles in a line.",
        matchsticks: [
          ...triangle(0, 30),
          ...triangle(SP, 30),
          ...triangle(SP * 2, 30),
          ...triangle(SP * 3, 30),
        ],
      },
      {
        name: "Staircase",
        description: "A staircase of five steps going down.",
        matchsticks: stairs(10, 5, 5),
      },
      {
        name: "Plus Signs",
        description: "Four plus (+) shapes in a row.",
        matchsticks: [
          ...plus(0, 30),
          ...plus(SP, 30),
          ...plus(SP * 2, 30),
          ...plus(SP * 3, 30),
        ],
      },
    ],
  },

  // ━━━ LEVEL 2: Repetition of larger shapes ━━━
  {
    level: 2,
    patterns: [
      {
        name: "Square Line",
        description: "Five separate squares in a row.",
        matchsticks: [
          ...square(0, 30),
          ...square(SP, 30),
          ...square(SP * 2, 30),
          ...square(SP * 3, 30),
          ...square(SP * 4, 30),
        ],
      },
      {
        name: "Pentagon Parade",
        description: "Three pentagons side by side.",
        matchsticks: [
          ...pentagon(0, 25),
          ...pentagon(SP, 25),
          ...pentagon(SP * 2, 25),
        ],
      },
      {
        name: "Hexagon Row",
        description: "Three hexagons in a line.",
        matchsticks: [
          ...hexagon(0, 30),
          ...hexagon(SP, 30),
          ...hexagon(SP * 2, 30),
        ],
      },
      {
        name: "Diamond Chain",
        description: "Five diamonds in a row.",
        matchsticks: [
          ...diamond(0, 30),
          ...diamond(SP, 30),
          ...diamond(SP * 2, 30),
          ...diamond(SP * 3, 30),
          ...diamond(SP * 4, 30),
        ],
      },
      {
        name: "House Row",
        description: "Four houses side by side.",
        matchsticks: [
          ...house(0, 15),
          ...house(SP, 15),
          ...house(SP * 2, 15),
          ...house(SP * 3, 15),
        ],
      },
    ],
  },

  // ━━━ LEVEL 3: Connected / shared-edge repetitions ━━━
  {
    level: 3,
    patterns: [
      {
        name: "Connected Squares",
        description: "Six squares sharing edges in a row. Shared walls count once!",
        matchsticks: connectedSquaresRow(0, 30, 6),
      },
      {
        name: "Triangle Wave",
        description: "Six triangles sharing a base line.",
        matchsticks: triangleRow(0, 25, 6),
      },
      {
        name: "Square Grid",
        description: "A 3x2 grid of squares sharing all edges.",
        matchsticks: squareGrid(10, 20, 3, 2),
      },
      {
        name: "Square Tower",
        description: "Five connected squares stacked in a column.",
        matchsticks: connectedSquaresCol(30, 0, 5),
      },
      {
        name: "Bow-Tie Row",
        description: "Three bow-tie shapes in a line.",
        matchsticks: [
          ...bowTie(0, 30),
          ...bowTie(G * 2.5, 30),
          ...bowTie(G * 5, 30),
        ],
      },
    ],
  },

  // ━━━ LEVEL 4: Repetitive shapes + non-repeating extras ━━━
  {
    level: 4,
    patterns: [
      {
        name: "Triangles with a Crown",
        description: "Five triangles in a row, with a crown shape at the end.",
        matchsticks: [
          ...triangle(0, 30),
          ...triangle(SP, 30),
          ...triangle(SP * 2, 30),
          ...triangle(SP * 3, 30),
          ...triangle(SP * 4, 30),
          // Non-repeating extra
          ...crown(SP * 5 + 5, 25),
        ],
      },
      {
        name: "Squares and a Star",
        description: "Four squares in a row, followed by a Star of David.",
        matchsticks: [
          ...square(0, 30),
          ...square(SP, 30),
          ...square(SP * 2, 30),
          ...square(SP * 3, 30),
          // Non-repeating extra
          ...starOfDavid(SP * 4 + 5, 30),
        ],
      },
      {
        name: "Houses with Fence",
        description: "Three houses in a row with a fence on the right.",
        matchsticks: [
          ...house(0, 10),
          ...house(SP, 10),
          ...house(SP * 2, 10),
          // Non-repeating extra
          ...fence(SP * 3, 30, 5),
        ],
      },
      {
        name: "Connected Squares + Triangles",
        description: "Five connected squares with a triangle on top of each.",
        matchsticks: [
          ...connectedSquaresRow(0, G, 5),
          // Triangles sitting on top of each square
          ...triangle(0, -G + G),
          ...triangle(G, -G + G),
          ...triangle(G * 2, -G + G),
          ...triangle(G * 3, -G + G),
          ...triangle(G * 4, -G + G),
        ],
      },
      {
        name: "Hexagons with a Diamond",
        description: "Four hexagons in a row, and a diamond at the end.",
        matchsticks: [
          ...hexagon(0, 30),
          ...hexagon(SP, 30),
          ...hexagon(SP * 2, 30),
          ...hexagon(SP * 3, 30),
          // Non-repeating extra
          ...diamond(SP * 4 + 5, 32),
        ],
      },
    ],
  },

  // ━━━ LEVEL 5: Complex repetitive compounds + extras ━━━
  {
    level: 5,
    patterns: [
      {
        name: "House Village",
        description: "Five houses in a row flanked by two trees.",
        matchsticks: [
          ...tree(0, 10),
          ...house(SP, 10),
          ...house(SP * 2, 10),
          ...house(SP * 3, 10),
          ...house(SP * 4, 10),
          ...house(SP * 5, 10),
          ...tree(SP * 6, 10),
        ],
      },
      {
        name: "Castle Wall",
        description: "A row of connected squares topped with triangles and a flag.",
        matchsticks: [
          // 6 connected squares as wall
          ...connectedSquaresRow(0, G * 2, 6),
          // 6 triangles as battlements on top
          ...triangle(0, G * 2 - G),
          ...triangle(G, G * 2 - G),
          ...triangle(G * 2, G * 2 - G),
          ...triangle(G * 3, G * 2 - G),
          ...triangle(G * 4, G * 2 - G),
          ...triangle(G * 5, G * 2 - G),
          // Flag on the last triangle (non-repeating extra)
          m(G * 5 + G * 0.5, G * 2 - G, G * 5 + G * 0.5, G * 2 - G * 1.8),
          m(G * 5 + G * 0.5, G * 2 - G * 1.8, G * 5 + G, G * 2 - G * 1.4),
        ],
      },
      {
        name: "Boat Fleet",
        description: "Four boats in a row with a star flag at the end.",
        matchsticks: [
          ...boat(0, 15),
          ...boat(G * 2.2, 15),
          ...boat(G * 4.4, 15),
          ...boat(G * 6.6, 15),
          // Non-repeating extra — star flag
          ...starOfDavid(G * 8.8 + 5, 20),
        ],
      },
      {
        name: "Diamond Grid",
        description: "Three rows of four diamonds each — count carefully!",
        matchsticks: [
          // Row 1
          ...diamond(0, 0),
          ...diamond(SP, 0),
          ...diamond(SP * 2, 0),
          ...diamond(SP * 3, 0),
          // Row 2
          ...diamond(0, SP),
          ...diamond(SP, SP),
          ...diamond(SP * 2, SP),
          ...diamond(SP * 3, SP),
          // Row 3
          ...diamond(0, SP * 2),
          ...diamond(SP, SP * 2),
          ...diamond(SP * 2, SP * 2),
          ...diamond(SP * 3, SP * 2),
        ],
      },
      {
        name: "The Grand Pattern",
        description: "Connected squares with houses on top and a rocket at the end.",
        matchsticks: [
          // Base: 4 connected squares
          ...connectedSquaresRow(0, G * 3, 4),
          // 4 houses sitting on the base
          ...house(0, G),
          ...house(G, G),
          ...house(G * 2, G),
          ...house(G * 3, G),
          // Non-repeating rocket at the end
          ...rocket(G * 5, 0),
        ],
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

export function getRandomPattern(levelNum) {
  const level = getLevel(levelNum);
  const idx = Math.floor(Math.random() * level.patterns.length);
  return level.patterns[idx];
}

export const MAX_LEVEL = levels.length;
