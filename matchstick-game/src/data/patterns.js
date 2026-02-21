// Matchstick pattern definitions
// Each matchstick is {x1, y1, x2, y2} — head is at (x1,y1)
// Coordinate space is arbitrary; the canvas auto-fits with padding.
// GRID = standard matchstick length

const G = 30; // one matchstick length

function m(x1, y1, x2, y2) {
  return { x1, y1, x2, y2 };
}

// ═══════════════════════════════════════════════════════════════
// SHAPE PRIMITIVES
// ═══════════════════════════════════════════════════════════════

// L-shape (2 sticks): vertical down, horizontal right
function lShape(ox, oy) {
  return [
    m(ox, oy, ox, oy + G),
    m(ox, oy + G, ox + G, oy + G),
  ];
}

// V-shape / chevron (2 sticks)
function vShape(ox, oy) {
  return [
    m(ox, oy, ox + G * 0.5, oy + G * 0.7),
    m(ox + G, oy, ox + G * 0.5, oy + G * 0.7),
  ];
}

// Triangle (3 sticks)
function triangle(ox, oy) {
  return [
    m(ox, oy + G, ox + G * 0.5, oy),           // left slope up
    m(ox + G, oy + G, ox + G * 0.5, oy),        // right slope up
    m(ox, oy + G, ox + G, oy + G),              // base
  ];
}

// Inverted triangle (3 sticks)
function triDown(ox, oy) {
  return [
    m(ox, oy, ox + G * 0.5, oy + G),            // left slope down
    m(ox + G, oy, ox + G * 0.5, oy + G),        // right slope down
    m(ox, oy, ox + G, oy),                       // top
  ];
}

// Square (4 sticks)
function square(ox, oy) {
  return [
    m(ox, oy, ox + G, oy),         // top
    m(ox + G, oy, ox + G, oy + G), // right
    m(ox + G, oy + G, ox, oy + G), // bottom
    m(ox, oy + G, ox, oy),         // left
  ];
}

// Pentagon (5 sticks) — flat bottom
function pentagon(ox, oy) {
  const w = G;
  const h = G * 1.0;
  const topY = oy;
  const midY = oy + h * 0.38;
  const botY = oy + h;
  const cx = ox + w / 2;
  return [
    m(cx, topY, ox + w, midY),        // top-right slope
    m(ox + w, midY, ox + w * 0.82, botY),  // right side
    m(ox + w * 0.82, botY, ox + w * 0.18, botY), // bottom
    m(ox + w * 0.18, botY, ox, midY),  // left side
    m(ox, midY, cx, topY),            // top-left slope
  ];
}

// Hexagon (6 sticks)
function hexagon(ox, oy) {
  const w = G;
  const h = G * 0.866;
  const q = w * 0.25;
  return [
    m(ox + q, oy, ox + w - q, oy),                 // top
    m(ox + w - q, oy, ox + w, oy + h / 2),         // top-right
    m(ox + w, oy + h / 2, ox + w - q, oy + h),     // bottom-right
    m(ox + w - q, oy + h, ox + q, oy + h),         // bottom
    m(ox + q, oy + h, ox, oy + h / 2),             // bottom-left
    m(ox, oy + h / 2, ox + q, oy),                 // top-left
  ];
}

// Diamond (4 sticks)
function diamond(ox, oy) {
  const cx = ox + G / 2;
  const cy = oy + G / 2;
  const rx = G / 2;
  const ry = G / 2;
  return [
    m(cx, oy, ox + G, cy),
    m(ox + G, cy, cx, oy + G),
    m(cx, oy + G, ox, cy),
    m(ox, cy, cx, oy),
  ];
}

// T-shape (3 sticks)
function tShape(ox, oy) {
  return [
    m(ox, oy, ox + G, oy),                             // horizontal top-left
    m(ox + G, oy, ox + G * 2, oy),                     // horizontal top-right
    m(ox + G, oy, ox + G, oy + G),                     // vertical down
  ];
}

// Plus/cross shape (4 sticks)
function plus(ox, oy) {
  const cx = ox + G / 2;
  const cy = oy + G / 2;
  const half = G / 2;
  return [
    m(cx, cy - half, cx, cy),       // top
    m(cx, cy, cx, cy + half),       // bottom
    m(cx - half, cy, cx, cy),       // left
    m(cx, cy, cx + half, cy),       // right
  ];
}

// Arrow pointing right (3 sticks)
function arrowRight(ox, oy) {
  return [
    m(ox, oy + G * 0.5, ox + G * 0.65, oy + G * 0.5), // shaft
    m(ox + G, oy + G * 0.5, ox + G * 0.65, oy),        // upper head
    m(ox + G, oy + G * 0.5, ox + G * 0.65, oy + G),    // lower head
  ];
}

// ═══════════════════════════════════════════════════════════════
// CONNECTED / SHARED-EDGE SHAPES
// ═══════════════════════════════════════════════════════════════

// Row of connected squares sharing vertical edges
// n squares => 2n + (n+1) = 3n+1 sticks
function connectedSquaresRow(ox, oy, n) {
  const sticks = [];
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox + i * G, oy, ox + (i + 1) * G, oy));         // top
    sticks.push(m(ox + i * G, oy + G, ox + (i + 1) * G, oy + G)); // bottom
  }
  for (let i = 0; i <= n; i++) {
    sticks.push(m(ox + i * G, oy, ox + i * G, oy + G));           // verticals
  }
  return sticks;
}

// Column of connected squares sharing horizontal edges
// n squares => 2n + (n+1) = 3n+1 sticks
function connectedSquaresCol(ox, oy, n) {
  const sticks = [];
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox, oy + i * G, ox, oy + (i + 1) * G));         // left
    sticks.push(m(ox + G, oy + i * G, ox + G, oy + (i + 1) * G)); // right
  }
  for (let i = 0; i <= n; i++) {
    sticks.push(m(ox, oy + i * G, ox + G, oy + i * G));           // horizontals
  }
  return sticks;
}

// Row of triangles sharing sides (zigzag pattern)
// n triangles => 1 base + 2n slopes = 2n+1 sticks
function triangleRow(ox, oy, n) {
  const sticks = [];
  // Base line split into n segments
  for (let i = 0; i < n; i++) {
    sticks.push(m(ox + i * G, oy + G, ox + (i + 1) * G, oy + G));
  }
  // Slopes
  for (let i = 0; i < n; i++) {
    const cx = ox + i * G + G * 0.5;
    sticks.push(m(ox + i * G, oy + G, cx, oy));
    sticks.push(m(cx, oy, ox + (i + 1) * G, oy + G));
  }
  return sticks;
}

// Grid of squares (rows x cols) sharing all edges
// sticks = rows*(cols+1) + cols*(rows+1)
function squareGrid(ox, oy, cols, rows) {
  const sticks = [];
  // Horizontal lines
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      sticks.push(m(ox + c * G, oy + r * G, ox + (c + 1) * G, oy + r * G));
    }
  }
  // Vertical lines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= cols; c++) {
      sticks.push(m(ox + c * G, oy + r * G, ox + c * G, oy + (r + 1) * G));
    }
  }
  return sticks;
}

// ═══════════════════════════════════════════════════════════════
// COMPOUND / CREATIVE SHAPES
// ═══════════════════════════════════════════════════════════════

// House: square body + triangle roof (6 sticks — shared top edge)
function house(ox, oy) {
  return [
    // Triangle roof
    m(ox, oy + G, ox + G * 0.5, oy),
    m(ox + G * 0.5, oy, ox + G, oy + G),
    // Square body (3 sides, top shared with roof base)
    m(ox + G, oy + G, ox + G, oy + G * 2),
    m(ox + G, oy + G * 2, ox, oy + G * 2),
    m(ox, oy + G * 2, ox, oy + G),
    // Roof base line (visible structural line)
    m(ox, oy + G, ox + G, oy + G),
  ];
}

// Bow-tie / hourglass: two triangles point-to-point (6 sticks)
function bowTie(ox, oy) {
  const cx = ox + G;
  const cy = oy + G * 0.5;
  return [
    // Left triangle
    m(ox, oy, cx, cy),
    m(ox, oy + G, cx, cy),
    m(ox, oy, ox, oy + G),
    // Right triangle
    m(cx, cy, ox + G * 2, oy),
    m(cx, cy, ox + G * 2, oy + G),
    m(ox + G * 2, oy, ox + G * 2, oy + G),
  ];
}

// Kite shape (4 sticks) — tall diamond
function kite(ox, oy) {
  const cx = ox + G * 0.5;
  return [
    m(cx, oy, ox + G, oy + G * 0.4),
    m(ox + G, oy + G * 0.4, cx, oy + G),
    m(cx, oy + G, ox, oy + G * 0.4),
    m(ox, oy + G * 0.4, cx, oy),
  ];
}

// Rocket: column of squares with triangle nose + triangle fins
function rocket(ox, oy) {
  const sticks = [];
  // Nose cone (triangle on top)
  sticks.push(m(ox, oy + G, ox + G * 0.5, oy));
  sticks.push(m(ox + G * 0.5, oy, ox + G, oy + G));

  // Body: 3 connected squares vertically (sharing horizontals)
  for (let i = 0; i < 3; i++) {
    const sy = oy + G + i * G;
    sticks.push(m(ox, sy, ox, sy + G));       // left
    sticks.push(m(ox + G, sy, ox + G, sy + G)); // right
  }
  // Horizontal lines (4 lines for 3 squares)
  for (let i = 0; i <= 3; i++) {
    sticks.push(m(ox, oy + G + i * G, ox + G, oy + G + i * G));
  }

  // Left fin (triangle pointing left)
  const finY = oy + G * 3;
  sticks.push(m(ox, finY, ox - G * 0.5, finY + G * 0.7));
  sticks.push(m(ox - G * 0.5, finY + G * 0.7, ox, finY + G));

  // Right fin (triangle pointing right)
  sticks.push(m(ox + G, finY, ox + G + G * 0.5, finY + G * 0.7));
  sticks.push(m(ox + G + G * 0.5, finY + G * 0.7, ox + G, finY + G));

  // Exhaust (inverted triangle at bottom)
  const exY = oy + G * 4;
  sticks.push(m(ox, exY, ox + G * 0.5, exY + G * 0.6));
  sticks.push(m(ox + G, exY, ox + G * 0.5, exY + G * 0.6));

  return sticks;
}

// Star of David (2 overlapping triangles = 6 sticks)
function starOfDavid(ox, oy) {
  const w = G * 1.2;
  const h = G * 1.0;
  const cx = ox + w / 2;
  return [
    // Upward triangle
    m(ox, oy + h * 0.7, cx, oy),
    m(cx, oy, ox + w, oy + h * 0.7),
    m(ox + w, oy + h * 0.7, ox, oy + h * 0.7),
    // Downward triangle
    m(ox, oy + h * 0.3, cx, oy + h),
    m(cx, oy + h, ox + w, oy + h * 0.3),
    m(ox + w, oy + h * 0.3, ox, oy + h * 0.3),
  ];
}

// Windmill / pinwheel (8 sticks)
function windmill(ox, oy) {
  const cx = ox + G;
  const cy = oy + G;
  return [
    // Top blade
    m(cx, cy, cx - G * 0.3, cy - G),
    m(cx, cy, cx + G * 0.3, cy - G),
    // Right blade
    m(cx, cy, cx + G, cy - G * 0.3),
    m(cx, cy, cx + G, cy + G * 0.3),
    // Bottom blade
    m(cx, cy, cx + G * 0.3, cy + G),
    m(cx, cy, cx - G * 0.3, cy + G),
    // Left blade
    m(cx, cy, cx - G, cy + G * 0.3),
    m(cx, cy, cx - G, cy - G * 0.3),
  ];
}

// Fence: repeated vertical posts with horizontal rails
function fence(ox, oy, posts) {
  const sticks = [];
  const spacing = G * 0.6;
  for (let i = 0; i < posts; i++) {
    sticks.push(m(ox + i * spacing, oy, ox + i * spacing, oy + G)); // post
  }
  // Two horizontal rails
  const railY1 = oy + G * 0.3;
  const railY2 = oy + G * 0.7;
  for (let i = 0; i < posts - 1; i++) {
    sticks.push(m(ox + i * spacing, railY1, ox + (i + 1) * spacing, railY1));
    sticks.push(m(ox + i * spacing, railY2, ox + (i + 1) * spacing, railY2));
  }
  return sticks;
}

// Fish shape (7 sticks)
function fish(ox, oy) {
  const w = G * 1.5;
  const h = G;
  return [
    // Body (diamond)
    m(ox + w * 0.3, oy, ox + w * 0.7, oy + h * 0.5),
    m(ox + w * 0.7, oy + h * 0.5, ox + w * 0.3, oy + h),
    m(ox + w * 0.3, oy + h, ox, oy + h * 0.5),
    m(ox, oy + h * 0.5, ox + w * 0.3, oy),
    // Tail (V)
    m(ox + w * 0.7, oy + h * 0.5, ox + w, oy),
    m(ox + w * 0.7, oy + h * 0.5, ox + w, oy + h),
    // Eye line
    m(ox + w * 0.1, oy + h * 0.4, ox + w * 0.1, oy + h * 0.6),
  ];
}

// Staircase (n steps, each step = 2 sticks)
function stairs(ox, oy, steps) {
  const sticks = [];
  for (let i = 0; i < steps; i++) {
    sticks.push(m(ox + i * G, oy + i * G, ox + i * G, oy + (i + 1) * G)); // vertical
    sticks.push(m(ox + i * G, oy + (i + 1) * G, ox + (i + 1) * G, oy + (i + 1) * G)); // horizontal
  }
  return sticks;
}

// Crown shape (9 sticks)
function crown(ox, oy) {
  const w = G * 2;
  return [
    // Base
    m(ox, oy + G, ox + w, oy + G),
    // Left wall
    m(ox, oy + G, ox, oy + G * 0.4),
    // Right wall
    m(ox + w, oy + G, ox + w, oy + G * 0.4),
    // Three points
    m(ox, oy + G * 0.4, ox + w * 0.2, oy),
    m(ox + w * 0.2, oy, ox + w * 0.4, oy + G * 0.4),
    m(ox + w * 0.4, oy + G * 0.4, ox + w * 0.5, oy),
    m(ox + w * 0.5, oy, ox + w * 0.6, oy + G * 0.4),
    m(ox + w * 0.6, oy + G * 0.4, ox + w * 0.8, oy),
    m(ox + w * 0.8, oy, ox + w, oy + G * 0.4),
  ];
}

// Tree: triangle on top of vertical trunk (5 sticks)
function tree(ox, oy) {
  return [
    // Triangle canopy
    m(ox, oy + G, ox + G * 0.5, oy),
    m(ox + G * 0.5, oy, ox + G, oy + G),
    m(ox, oy + G, ox + G, oy + G),
    // Trunk (2 sticks as visible trunk width)
    m(ox + G * 0.5, oy + G, ox + G * 0.5, oy + G * 1.6),
  ];
}

// Boat: hull + mast + sail (6 sticks)
function boat(ox, oy) {
  return [
    // Hull (trapezoid bottom)
    m(ox + G * 0.3, oy + G, ox + G * 1.7, oy + G),    // deck
    m(ox + G * 0.3, oy + G, ox + G * 0.6, oy + G * 1.4), // left hull
    m(ox + G * 1.7, oy + G, ox + G * 1.4, oy + G * 1.4), // right hull
    m(ox + G * 0.6, oy + G * 1.4, ox + G * 1.4, oy + G * 1.4), // bottom
    // Mast
    m(ox + G, oy + G, ox + G, oy),
    // Sail
    m(ox + G, oy, ox + G * 1.6, oy + G),
  ];
}

// ═══════════════════════════════════════════════════════════════
// LEVEL DEFINITIONS
// 5 levels, 5 patterns each, increasing complexity
// ═══════════════════════════════════════════════════════════════

export const levels = [
  // ━━━ LEVEL 1: Simple repeating shapes (2-3 sticks each) ━━━
  {
    level: 1,
    patterns: [
      {
        name: "Row of L-shapes",
        description: "Three L-shapes in a row. Each L = 2 matchsticks.",
        hint: "3 x 2",
        matchsticks: [
          ...lShape(0, 30),
          ...lShape(40, 30),
          ...lShape(80, 30),
        ],
        totalMatchsticks: 6,
      },
      {
        name: "Four V-shapes",
        description: "Four V-shapes (chevrons) in a row.",
        hint: "4 x 2",
        matchsticks: [
          ...vShape(0, 30),
          ...vShape(40, 30),
          ...vShape(80, 30),
          ...vShape(120, 30),
        ],
        totalMatchsticks: 8,
      },
      {
        name: "Two Triangles",
        description: "Two separate triangles side by side.",
        hint: "2 x 3",
        matchsticks: [
          ...triangle(5, 30),
          ...triangle(50, 30),
        ],
        totalMatchsticks: 6,
      },
      {
        name: "Staircase",
        description: "A staircase of 4 steps going down.",
        hint: "4 x 2",
        matchsticks: stairs(10, 10, 4),
        totalMatchsticks: 8,
      },
      {
        name: "Three Plus Signs",
        description: "Three plus (+) shapes in a row.",
        hint: "3 x 4",
        matchsticks: [
          ...plus(5, 30),
          ...plus(50, 30),
          ...plus(95, 30),
        ],
        totalMatchsticks: 12,
      },
    ],
  },

  // ━━━ LEVEL 2: Larger repeating shapes (4-6 sticks each) ━━━
  {
    level: 2,
    patterns: [
      {
        name: "Three Squares",
        description: "Three separate squares in a row.",
        hint: "3 x 4",
        matchsticks: [
          ...square(0, 30),
          ...square(45, 30),
          ...square(90, 30),
        ],
        totalMatchsticks: 12,
      },
      {
        name: "Two Pentagons",
        description: "Two pentagons side by side.",
        hint: "2 x 5",
        matchsticks: [
          ...pentagon(5, 25),
          ...pentagon(55, 25),
        ],
        totalMatchsticks: 10,
      },
      {
        name: "Two Hexagons",
        description: "Two hexagons side by side.",
        hint: "2 x 6",
        matchsticks: [
          ...hexagon(5, 30),
          ...hexagon(55, 30),
        ],
        totalMatchsticks: 12,
      },
      {
        name: "Diamonds & Triangles",
        description: "Two diamonds with a triangle between them.",
        hint: "Think: 4 + 3 + 4",
        matchsticks: [
          ...diamond(0, 30),
          ...triangle(40, 30),
          ...diamond(80, 30),
        ],
        totalMatchsticks: 11,
      },
      {
        name: "Bow-Tie Pair",
        description: "Two bow-tie shapes side by side.",
        hint: "2 x 6",
        matchsticks: [
          ...bowTie(0, 30),
          ...bowTie(75, 30),
        ],
        totalMatchsticks: 12,
      },
    ],
  },

  // ━━━ LEVEL 3: Connected shapes (shared edges!) ━━━
  {
    level: 3,
    patterns: [
      {
        name: "Connected Squares (4)",
        description: "Four squares sharing edges in a row. Shared walls count once!",
        hint: "3n+1 where n=4",
        matchsticks: connectedSquaresRow(0, 30, 4),
        totalMatchsticks: 13,
      },
      {
        name: "Triangle Wave",
        description: "Five triangles sharing a base line. Count each stick!",
        hint: "n + 2n base segments",
        matchsticks: triangleRow(0, 25, 5),
        totalMatchsticks: 15,
      },
      {
        name: "Square Grid 2x2",
        description: "A 2x2 grid of squares sharing all edges.",
        hint: "2x3 + 3x2",
        matchsticks: squareGrid(15, 20, 2, 2),
        totalMatchsticks: 12,
      },
      {
        name: "Three Houses",
        description: "Three houses (square + triangle roof), each house is separate.",
        hint: "3 x 6",
        matchsticks: [
          ...house(0, 15),
          ...house(50, 15),
          ...house(100, 15),
        ],
        totalMatchsticks: 18,
      },
      {
        name: "L-shape Tower",
        description: "Three connected squares in a column. Shared edges count once!",
        hint: "3n+1 where n=3",
        matchsticks: connectedSquaresCol(30, 0, 3),
        totalMatchsticks: 10,
      },
    ],
  },

  // ━━━ LEVEL 4: Compound shapes (mixed repeating + fixed) ━━━
  {
    level: 4,
    patterns: [
      {
        name: "Houses with Fence",
        description: "Two houses with a fence of 5 posts and 2 rails between them.",
        hint: "Houses + fence posts + rails",
        matchsticks: [
          ...house(0, 10),
          ...fence(45, 30, 5),
          ...house(120, 10),
        ],
        totalMatchsticks: 12 + 5 + 8, // 2 houses (12) + 5 posts + 8 rails
      },
      {
        name: "Star of David Pair",
        description: "Two Stars of David with a diamond in the middle.",
        hint: "6 + 4 + 6",
        matchsticks: [
          ...starOfDavid(0, 25),
          ...diamond(50, 28),
          ...starOfDavid(90, 25),
        ],
        totalMatchsticks: 16,
      },
      {
        name: "Fish School",
        description: "Three fish swimming in a row.",
        hint: "3 x 7",
        matchsticks: [
          ...fish(0, 25),
          ...fish(55, 25),
          ...fish(110, 25),
        ],
        totalMatchsticks: 21,
      },
      {
        name: "Crown & Trees",
        description: "A crown flanked by two trees.",
        hint: "4 + 9 + 4",
        matchsticks: [
          ...tree(0, 20),
          ...crown(45, 25),
          ...tree(120, 20),
        ],
        totalMatchsticks: 17,
      },
      {
        name: "Windmill Garden",
        description: "Two windmills with a kite shape between them.",
        hint: "8 + 4 + 8",
        matchsticks: [
          ...windmill(0, 15),
          ...kite(60, 30),
          ...windmill(100, 15),
        ],
        totalMatchsticks: 20,
      },
    ],
  },

  // ━━━ LEVEL 5: Complex compound patterns ━━━
  {
    level: 5,
    patterns: [
      {
        name: "The Rocket",
        description: "A rocket: nose cone + 3 body segments + 2 fins + exhaust.",
        hint: "2 + 10 + 4 + 2 = 18",
        matchsticks: rocket(40, 0),
        totalMatchsticks: 18,
      },
      {
        name: "Village Scene",
        description: "Three houses, two trees, and a fence. Count everything!",
        hint: "3x6 + 2x4 + fence",
        matchsticks: [
          ...tree(0, 5),
          ...house(40, 5),
          ...house(90, 5),
          ...house(140, 5),
          ...tree(185, 5),
          ...fence(40, 75, 6),
        ],
        totalMatchsticks: 4 + 18 + 4 + 6 + 10, // tree + 3 houses + tree + fence(6posts+10rails)
      },
      {
        name: "Castle Wall",
        description: "A 4x2 grid of squares topped with 4 triangles.",
        hint: "Grid + separate triangles",
        matchsticks: [
          ...squareGrid(10, 40, 4, 2),
          ...triangle(10, 10),
          ...triangle(40, 10),
          ...triangle(70, 10),
          ...triangle(100, 10),
        ],
        totalMatchsticks: 24 + 12, // 4x2 grid = 4*3+5*2 = 22... wait let me recalculate
      },
      {
        name: "Fleet of Boats",
        description: "Four boats sailing with triangle flags above.",
        hint: "4x6 + 4x3",
        matchsticks: [
          ...boat(0, 20),
          ...triangle(G * 0.3, 0),
          ...boat(65, 20),
          ...triangle(65 + G * 0.3, 0),
          ...boat(130, 20),
          ...triangle(130 + G * 0.3, 0),
          ...boat(195, 20),
          ...triangle(195 + G * 0.3, 0),
        ],
        totalMatchsticks: 36,
      },
      {
        name: "Garden Party",
        description: "Crowns, windmills, and stars — the grand finale!",
        hint: "Mixed shapes everywhere",
        matchsticks: [
          ...crown(0, 5),
          ...windmill(80, 0),
          ...starOfDavid(0, 55),
          ...hexagon(55, 60),
          ...starOfDavid(95, 55),
        ],
        totalMatchsticks: 9 + 8 + 6 + 6 + 6, // 35
      },
    ],
  },
];

// ─── Fix counts by actually counting matchstick arrays ───
// This ensures totalMatchsticks always matches the actual array length
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
