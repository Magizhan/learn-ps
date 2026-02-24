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
// BASIC SHAPE PRIMITIVES
// ═══════════════════════════════════════════════════════════════

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
// REGULAR POLYGON PRIMITIVES
// ═══════════════════════════════════════════════════════════════

function regularPolygon(cx, cy, r, n) {
  const sticks = [];
  const startAngle = -Math.PI / 2;
  for (let i = 0; i < n; i++) {
    const a1 = startAngle + (2 * Math.PI * i) / n;
    const a2 = startAngle + (2 * Math.PI * (i + 1)) / n;
    sticks.push(
      m(
        cx + r * Math.cos(a1), cy + r * Math.sin(a1),
        cx + r * Math.cos(a2), cy + r * Math.sin(a2)
      )
    );
  }
  return sticks;
}

function pentagon(cx, cy, r) {
  return regularPolygon(cx, cy, r || G * 0.7, 5);
}

function hexagon(cx, cy, r) {
  return regularPolygon(cx, cy, r || G * 0.7, 6);
}

function septagon(cx, cy, r) {
  return regularPolygon(cx, cy, r || G * 0.7, 7);
}

function octagon(cx, cy, r) {
  return regularPolygon(cx, cy, r || G * 0.7, 8);
}

// ═══════════════════════════════════════════════════════════════
// CONNECTED STRUCTURE BUILDERS
// ═══════════════════════════════════════════════════════════════

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

function stairs(ox, oy, steps) {
  const sticks = [];
  for (let i = 0; i < steps; i++) {
    sticks.push(m(ox + i * G, oy + i * G, ox + i * G, oy + (i + 1) * G));
    sticks.push(m(ox + i * G, oy + (i + 1) * G, ox + (i + 1) * G, oy + (i + 1) * G));
  }
  return sticks;
}

function squaresL(ox, oy, hLen, vLen) {
  return dedup([
    ...connectedSquaresRow(ox, oy, hLen),
    ...connectedSquaresCol(ox + (hLen - 1) * G, oy, vLen),
  ]);
}

function squaresT(ox, oy, hLen, vLen) {
  const centerIdx = Math.floor(hLen / 2);
  return dedup([
    ...connectedSquaresRow(ox, oy, hLen),
    ...connectedSquaresCol(ox + centerIdx * G, oy, vLen),
  ]);
}

function squaresCross(ox, oy, armLen) {
  const center = armLen * G;
  return dedup([
    ...connectedSquaresRow(ox, oy + center, armLen * 2 + 1),
    ...connectedSquaresCol(ox + center, oy, armLen * 2 + 1),
  ]);
}

function squaresZ(ox, oy, topLen, bottomLen) {
  return dedup([
    ...connectedSquaresRow(ox + (bottomLen - 1) * G, oy, topLen),
    ...connectedSquaresCol(ox + (bottomLen - 1) * G, oy, 2),
    ...connectedSquaresRow(ox, oy + G, bottomLen),
  ]);
}

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

function squaresH(ox, oy, colHeight, bridgeWidth) {
  const midRow = Math.floor(colHeight / 2);
  return dedup([
    ...connectedSquaresCol(ox, oy, colHeight),
    ...connectedSquaresCol(ox + (bridgeWidth + 1) * G, oy, colHeight),
    ...connectedSquaresRow(ox, oy + midRow * G, bridgeWidth + 2),
  ]);
}

// ═══════════════════════════════════════════════════════════════
// POLYGON COMPOUND BUILDERS
// ═══════════════════════════════════════════════════════════════

// Chain of hexagons in a row sharing edges
function hexChain(ox, oy, n, r) {
  r = r || G * 0.55;
  const sticks = [];
  const w = r * Math.sqrt(3);
  for (let i = 0; i < n; i++) {
    sticks.push(...hexagon(ox + i * w, oy, r));
  }
  return dedup(sticks);
}

// Honeycomb grid
function honeycomb(ox, oy, cols, rows, r) {
  r = r || G * 0.55;
  const sticks = [];
  const w = r * Math.sqrt(3);
  for (let row = 0; row < rows; row++) {
    const offsetX = row % 2 === 0 ? 0 : w / 2;
    for (let col = 0; col < cols; col++) {
      sticks.push(...hexagon(ox + col * w + offsetX, oy + row * r * 1.5, r));
    }
  }
  return dedup(sticks);
}

// Pentagon with a triangle hat on top
function pentagonWithHat(cx, cy, r) {
  r = r || G * 0.7;
  const pent = pentagon(cx, cy, r);
  const startAngle = -Math.PI / 2;
  const a1 = startAngle + (2 * Math.PI * 1) / 5;
  const a4 = startAngle + (2 * Math.PI * 4) / 5;
  const v1x = cx + r * Math.cos(a1);
  const v1y = cy + r * Math.sin(a1);
  const v4x = cx + r * Math.cos(a4);
  const v4y = cy + r * Math.sin(a4);
  const hatTip = cy - r * 1.8;
  return dedup([...pent, m(v4x, v4y, cx, hatTip), m(cx, hatTip, v1x, v1y)]);
}

// Hexagon with triangles on each side (star)
function hexagonStar(cx, cy, r) {
  r = r || G * 0.65;
  const sticks = [...hexagon(cx, cy, r)];
  const startAngle = -Math.PI / 2;
  for (let i = 0; i < 6; i++) {
    const a1 = startAngle + (2 * Math.PI * i) / 6;
    const a2 = startAngle + (2 * Math.PI * (i + 1)) / 6;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const midA = (a1 + a2) / 2;
    const outerR = r * 1.6;
    const ox = cx + outerR * Math.cos(midA);
    const oy = cy + outerR * Math.sin(midA);
    sticks.push(m(x1, y1, ox, oy));
    sticks.push(m(ox, oy, x2, y2));
  }
  return dedup(sticks);
}

// Octagon with internal cross-braces
function octagonWithCross(cx, cy, r) {
  r = r || G * 0.8;
  const oct = octagon(cx, cy, r);
  const startAngle = -Math.PI / 2;
  const v = [];
  for (let i = 0; i < 8; i++) {
    const a = startAngle + (2 * Math.PI * i) / 8;
    v.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return dedup([...oct, m(v[0].x, v[0].y, v[4].x, v[4].y), m(v[2].x, v[2].y, v[6].x, v[6].y)]);
}

// Octagon with squares on 4 cardinal sides
function octagonWithSquares(cx, cy, r) {
  r = r || G * 0.65;
  const oct = octagon(cx, cy, r);
  const sticks = [...oct];
  const startAngle = -Math.PI / 2;
  const cardinalPairs = [[7, 0], [1, 2], [3, 4], [5, 6]];
  for (const [i1, i2] of cardinalPairs) {
    const a1 = startAngle + (2 * Math.PI * i1) / 8;
    const a2 = startAngle + (2 * Math.PI * i2) / 8;
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2);
    const y2 = cy + r * Math.sin(a2);
    const midA = (a1 + a2) / 2;
    const edgeLen = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const outX1 = x1 + edgeLen * Math.cos(midA);
    const outY1 = y1 + edgeLen * Math.sin(midA);
    const outX2 = x2 + edgeLen * Math.cos(midA);
    const outY2 = y2 + edgeLen * Math.sin(midA);
    sticks.push(m(x1, y1, outX1, outY1));
    sticks.push(m(outX1, outY1, outX2, outY2));
    sticks.push(m(outX2, outY2, x2, y2));
  }
  return dedup(sticks);
}

// ═══════════════════════════════════════════════════════════════
// LEVEL DEFINITIONS — 7 levels, building complexity
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

  // ━━━ LEVEL 2: Larger structures + intro polygons ━━━
  {
    level: 2,
    patterns: [
      {
        name: "Five Connected Squares",
        description: "Five squares sharing edges in a long row.",
        matchsticks: connectedSquaresRow(0, 20, 5),
      },
      {
        name: "Pentagon",
        description: "A single regular pentagon — five sides.",
        matchsticks: pentagon(G * 1.5, G * 1.5, G * 0.9),
      },
      {
        name: "Hexagon",
        description: "A single regular hexagon — six sides.",
        matchsticks: hexagon(G * 1.5, G * 1.5, G * 0.9),
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

  // ━━━ LEVEL 3: More polygons + compound shapes ━━━
  {
    level: 3,
    patterns: [
      {
        name: "The L-shape",
        description: "An L made of connected squares: 3 across and 3 down.",
        matchsticks: squaresL(0, 0, 3, 3),
      },
      {
        name: "Septagon",
        description: "A single regular septagon — seven sides.",
        matchsticks: septagon(G * 1.5, G * 1.5, G * 0.9),
      },
      {
        name: "Octagon",
        description: "A single regular octagon — eight sides.",
        matchsticks: octagon(G * 1.5, G * 1.5, G * 0.9),
      },
      {
        name: "The Z-shape",
        description: "A Z of connected squares: 3 on top, offset to 3 on bottom.",
        matchsticks: squaresZ(0, 0, 3, 3),
      },
      {
        name: "Tower with Hat",
        description: "A column of 4 squares topped with a triangle.",
        matchsticks: dedup([
          ...connectedSquaresCol(0, G, 4),
          ...triangle(0, 0),
        ]),
      },
    ],
  },

  // ━━━ LEVEL 4: Compound polygon patterns ━━━
  {
    level: 4,
    patterns: [
      {
        name: "Hexagon Chain",
        description: "Three hexagons sharing edges in a row.",
        matchsticks: hexChain(G, G, 3, G * 0.55),
      },
      {
        name: "Pentagon with Hat",
        description: "A pentagon topped with a triangle hat extending upward.",
        matchsticks: pentagonWithHat(G * 2, G * 2.5, G * 0.85),
      },
      {
        name: "The T-shape",
        description: "A T of connected squares: 5 across with 3 down from center.",
        matchsticks: squaresT(0, 0, 5, 3),
      },
      {
        name: "Pyramid (3 base)",
        description: "A pyramid of squares: 3 bottom, 2 middle, 1 top.",
        matchsticks: squaresPyramid(0, 0, 3),
      },
      {
        name: "Triangle Wave (6)",
        description: "Six triangles connected along a shared base.",
        matchsticks: triangleRow(0, 15, 6),
      },
    ],
  },

  // ━━━ LEVEL 5: Mixed shape compounds ━━━
  {
    level: 5,
    patterns: [
      {
        name: "Battlements",
        description: "Four connected squares topped with four triangles.",
        matchsticks: dedup([
          ...connectedSquaresRow(0, G, 4),
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
        name: "Honeycomb Patch",
        description: "A 3x2 honeycomb of hexagons sharing edges.",
        matchsticks: honeycomb(G * 0.5, G * 0.3, 3, 2, G * 0.5),
      },
      {
        name: "Row with Teeth",
        description: "Five connected squares with inverted triangles hanging below.",
        matchsticks: dedup([
          ...connectedSquaresRow(0, 0, 5),
          ...triDown(0, G),
          ...triDown(G, G),
          ...triDown(G * 2, G),
          ...triDown(G * 3, G),
          ...triDown(G * 4, G),
        ]),
      },
    ],
  },

  // ━━━ LEVEL 6: Complex polygon compounds ━━━
  {
    level: 6,
    patterns: [
      {
        name: "Hexagon Star",
        description: "A hexagon surrounded by 6 triangles — like a star!",
        matchsticks: hexagonStar(G * 2.2, G * 2.2, G * 0.7),
      },
      {
        name: "Octagon with Cross",
        description: "An octagon with two internal cross-braces.",
        matchsticks: octagonWithCross(G * 2, G * 2, G * 0.9),
      },
      {
        name: "Hexagon Chain (4)",
        description: "Four hexagons sharing edges in a row.",
        matchsticks: hexChain(G, G, 4, G * 0.5),
      },
      {
        name: "Castle Wall",
        description: "Six squares with six triangles on top and a diamond flag.",
        matchsticks: dedup([
          ...connectedSquaresRow(0, G, 6),
          ...triangle(0, 0),
          ...triangle(G, 0),
          ...triangle(G * 2, 0),
          ...triangle(G * 3, 0),
          ...triangle(G * 4, 0),
          ...triangle(G * 5, 0),
          ...diamond(G * 5, -G * 1.3),
        ]),
      },
      {
        name: "Square Grid 3x3",
        description: "A 3x3 grid of squares sharing all edges.",
        matchsticks: squareGrid(0, 0, 3, 3),
      },
    ],
  },

  // ━━━ LEVEL 7: Master-level compounds ━━━
  {
    level: 7,
    patterns: [
      {
        name: "Octagon Fortress",
        description: "An octagon with squares on all 4 cardinal sides.",
        matchsticks: octagonWithSquares(G * 2.5, G * 2.5, G * 0.7),
      },
      {
        name: "The Rocket",
        description: "4 connected squares with nose cone, fins, and exhaust.",
        matchsticks: dedup([
          ...connectedSquaresCol(0, G, 4),
          ...triangle(0, 0),
          m(0, G * 4, -G * 0.5, G * 4 + G * 0.7),
          m(-G * 0.5, G * 4 + G * 0.7, 0, G * 5),
          m(G, G * 4, G + G * 0.5, G * 4 + G * 0.7),
          m(G + G * 0.5, G * 4 + G * 0.7, G, G * 5),
          m(0, G * 5, G * 0.5, G * 5 + G * 0.6),
          m(G, G * 5, G * 0.5, G * 5 + G * 0.6),
        ]),
      },
      {
        name: "Honeycomb (3x3)",
        description: "A 3x3 honeycomb cluster. Count every edge!",
        matchsticks: honeycomb(G * 0.5, G * 0.3, 3, 3, G * 0.45),
      },
      {
        name: "Fortress",
        description: "A 3x2 grid base with triangles on top and below.",
        matchsticks: dedup([
          ...squareGrid(0, G, 3, 2),
          ...triangle(0, 0),
          ...triangle(G, 0),
          ...triangle(G * 2, 0),
          ...triDown(0, G * 3),
          ...triDown(G, G * 3),
          ...triDown(G * 2, G * 3),
        ]),
      },
      {
        name: "Arrow",
        description: "Six connected squares with a large triangle arrowhead.",
        matchsticks: dedup([
          ...connectedSquaresRow(0, G * 0.5, 6),
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
