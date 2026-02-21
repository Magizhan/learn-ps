// Matchstick pattern definitions
// Each pattern has:
//   - name: display name
//   - description: hint about the pattern
//   - matchsticks: array of {x1,y1,x2,y2} line segments (normalized 0-100 coordinate space)
//   - totalMatchsticks: correct answer
//   - repetitions: how the pattern is structured (for description)

const GRID = 20; // grid unit size

function makeLine(x1, y1, x2, y2) {
  return { x1, y1, x2, y2 };
}

// L-shape: 2 matchsticks
function lShape(ox, oy) {
  return [
    makeLine(ox, oy, ox, oy + GRID),           // vertical
    makeLine(ox, oy + GRID, ox + GRID, oy + GRID), // horizontal
  ];
}

// T-shape: 3 matchsticks
function tShape(ox, oy) {
  return [
    makeLine(ox, oy, ox + GRID * 2, oy),       // top horizontal
    makeLine(ox + GRID, oy, ox + GRID, oy + GRID), // vertical down from center
  ];
}

// Square: 4 matchsticks
function square(ox, oy) {
  return [
    makeLine(ox, oy, ox + GRID, oy),
    makeLine(ox + GRID, oy, ox + GRID, oy + GRID),
    makeLine(ox + GRID, oy + GRID, ox, oy + GRID),
    makeLine(ox, oy + GRID, ox, oy),
  ];
}

// Triangle: 3 matchsticks
function triangle(ox, oy) {
  return [
    makeLine(ox, oy + GRID, ox + GRID / 2, oy),
    makeLine(ox + GRID / 2, oy, ox + GRID, oy + GRID),
    makeLine(ox + GRID, oy + GRID, ox, oy + GRID),
  ];
}

// Diamond: 4 matchsticks
function diamond(ox, oy) {
  const half = GRID / 2;
  return [
    makeLine(ox + half, oy, ox + GRID, oy + half),
    makeLine(ox + GRID, oy + half, ox + half, oy + GRID),
    makeLine(ox + half, oy + GRID, ox, oy + half),
    makeLine(ox, oy + half, ox + half, oy),
  ];
}

// Zigzag segment: 2 matchsticks
function zigzag(ox, oy, right = true) {
  if (right) {
    return [
      makeLine(ox, oy, ox + GRID, oy + GRID / 2),
      makeLine(ox + GRID, oy + GRID / 2, ox, oy + GRID),
    ];
  }
  return [
    makeLine(ox, oy, ox + GRID, oy - GRID / 2),
    makeLine(ox + GRID, oy - GRID / 2, ox, oy - GRID),
  ];
}

// Horizontal line
function hLine(ox, oy, len = GRID) {
  return [makeLine(ox, oy, ox + len, oy)];
}

// Vertical line
function vLine(ox, oy, len = GRID) {
  return [makeLine(ox, oy, ox, oy + len)];
}

// Connected squares in a row (share edges)
function connectedSquares(ox, oy, count) {
  const sticks = [];
  // Top edge segments
  for (let i = 0; i < count; i++) {
    sticks.push(makeLine(ox + i * GRID, oy, ox + (i + 1) * GRID, oy));
  }
  // Bottom edge segments
  for (let i = 0; i < count; i++) {
    sticks.push(makeLine(ox + i * GRID, oy + GRID, ox + (i + 1) * GRID, oy + GRID));
  }
  // Vertical segments (count + 1)
  for (let i = 0; i <= count; i++) {
    sticks.push(makeLine(ox + i * GRID, oy, ox + i * GRID, oy + GRID));
  }
  return sticks;
}

// Connected triangles in a row (alternating up/down)
function connectedTriangles(ox, oy, count) {
  const sticks = [];
  // Base line
  sticks.push(makeLine(ox, oy + GRID, ox + count * GRID, oy + GRID));
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      // Up triangle
      sticks.push(makeLine(ox + i * GRID, oy + GRID, ox + i * GRID + GRID / 2, oy));
      sticks.push(makeLine(ox + i * GRID + GRID / 2, oy, ox + (i + 1) * GRID, oy + GRID));
    } else {
      // Down triangle
      sticks.push(makeLine(ox + i * GRID, oy + GRID, ox + i * GRID + GRID / 2, oy + GRID * 2));
      sticks.push(makeLine(ox + i * GRID + GRID / 2, oy + GRID * 2, ox + (i + 1) * GRID, oy + GRID));
    }
  }
  return sticks;
}

// Hexagon: 6 matchsticks
function hexagon(ox, oy) {
  const w = GRID;
  const h = GRID * 0.866;
  return [
    makeLine(ox + w * 0.25, oy, ox + w * 0.75, oy),
    makeLine(ox + w * 0.75, oy, ox + w, oy + h / 2),
    makeLine(ox + w, oy + h / 2, ox + w * 0.75, oy + h),
    makeLine(ox + w * 0.75, oy + h, ox + w * 0.25, oy + h),
    makeLine(ox + w * 0.25, oy + h, ox, oy + h / 2),
    makeLine(ox, oy + h / 2, ox + w * 0.25, oy),
  ];
}

// Star shape (6-pointed): 12 matchsticks
function star(ox, oy) {
  const cx = ox + GRID;
  const cy = oy + GRID;
  const outerR = GRID;
  const innerR = GRID * 0.5;
  const sticks = [];
  for (let i = 0; i < 6; i++) {
    const outerAngle = (Math.PI / 3) * i - Math.PI / 2;
    const innerAngle1 = outerAngle - Math.PI / 6;
    const innerAngle2 = outerAngle + Math.PI / 6;
    const px = cx + outerR * Math.cos(outerAngle);
    const py = cy + outerR * Math.sin(outerAngle);
    const ix1 = cx + innerR * Math.cos(innerAngle1);
    const iy1 = cy + innerR * Math.sin(innerAngle1);
    const ix2 = cx + innerR * Math.cos(innerAngle2);
    const iy2 = cy + innerR * Math.sin(innerAngle2);
    sticks.push(makeLine(ix1, iy1, px, py));
    sticks.push(makeLine(px, py, ix2, iy2));
  }
  return sticks;
}

// House shape (square + triangle roof): 7 matchsticks
function house(ox, oy) {
  return [
    // Square body
    makeLine(ox, oy + GRID, ox + GRID, oy + GRID),
    makeLine(ox + GRID, oy + GRID, ox + GRID, oy + GRID * 2),
    makeLine(ox + GRID, oy + GRID * 2, ox, oy + GRID * 2),
    makeLine(ox, oy + GRID * 2, ox, oy + GRID),
    // Triangle roof
    makeLine(ox, oy + GRID, ox + GRID / 2, oy),
    makeLine(ox + GRID / 2, oy, ox + GRID, oy + GRID),
  ];
}

// Arrow shape: 5 matchsticks
function arrow(ox, oy) {
  return [
    makeLine(ox, oy + GRID / 2, ox + GRID, oy + GRID / 2), // shaft
    makeLine(ox + GRID, oy + GRID / 2, ox + GRID * 0.7, oy),   // upper head
    makeLine(ox + GRID, oy + GRID / 2, ox + GRID * 0.7, oy + GRID), // lower head
  ];
}

// Cross/plus shape: 4 matchsticks
function cross(ox, oy) {
  const cx = ox + GRID / 2;
  const cy = oy + GRID / 2;
  const half = GRID / 2;
  return [
    makeLine(cx - half, cy, cx + half, cy),
    makeLine(cx, cy - half, cx, cy + half),
  ];
}

// ─── LEVEL DEFINITIONS ──────────────────────────────────────────────

export const levels = [
  // ─── LEVEL 1: Simple shapes ───
  {
    level: 1,
    patterns: [
      {
        name: "Row of L-shapes",
        description: "Count all matchsticks in the L-shapes",
        matchsticks: [
          ...lShape(10, 40),
          ...lShape(35, 40),
          ...lShape(60, 40),
        ],
        totalMatchsticks: 6,
      },
      {
        name: "Three Triangles",
        description: "Count every matchstick in the triangles",
        matchsticks: [
          ...triangle(10, 35),
          ...triangle(35, 35),
          ...triangle(60, 35),
        ],
        totalMatchsticks: 9,
      },
      {
        name: "Simple Crosses",
        description: "Count the matchsticks forming the crosses",
        matchsticks: [
          ...cross(15, 30),
          ...cross(45, 30),
          ...cross(15, 60),
          ...cross(45, 60),
        ],
        totalMatchsticks: 8,
      },
      {
        name: "Arrows in a Row",
        description: "Count all matchsticks making up the arrows",
        matchsticks: [
          ...arrow(5, 35),
          ...arrow(30, 35),
          ...arrow(55, 35),
        ],
        totalMatchsticks: 9,
      },
    ],
  },

  // ─── LEVEL 2: Repeated basic shapes ───
  {
    level: 2,
    patterns: [
      {
        name: "Four Squares",
        description: "Count each matchstick in the four squares",
        matchsticks: [
          ...square(10, 15),
          ...square(40, 15),
          ...square(10, 55),
          ...square(40, 55),
        ],
        totalMatchsticks: 16,
      },
      {
        name: "Diamond Chain",
        description: "Count all matchsticks in the diamonds",
        matchsticks: [
          ...diamond(10, 35),
          ...diamond(35, 35),
          ...diamond(60, 35),
        ],
        totalMatchsticks: 12,
      },
      {
        name: "T-shape Parade",
        description: "Count every matchstick in the T-shapes",
        matchsticks: [
          ...tShape(5, 30),
          ...tShape(35, 30),
          ...tShape(5, 60),
          ...tShape(35, 60),
        ],
        totalMatchsticks: 8,
      },
      {
        name: "Zigzag Line",
        description: "Count all the matchsticks in the zigzag",
        matchsticks: [
          ...zigzag(10, 30),
          ...zigzag(30, 30),
          ...zigzag(50, 30),
          ...zigzag(70, 30),
        ],
        totalMatchsticks: 8,
      },
    ],
  },

  // ─── LEVEL 3: Connected shapes (shared edges) ───
  {
    level: 3,
    patterns: [
      {
        name: "Connected Squares (3)",
        description: "Shared edges mean fewer total sticks — count carefully!",
        matchsticks: connectedSquares(15, 35, 3),
        totalMatchsticks: 10,
      },
      {
        name: "Connected Squares (5)",
        description: "Five squares in a row share vertical edges",
        matchsticks: connectedSquares(5, 35, 5),
        totalMatchsticks: 16,
      },
      {
        name: "Triangle Wave",
        description: "Alternating triangles share a base — count all sticks",
        matchsticks: connectedTriangles(10, 25, 4),
        totalMatchsticks: 9,
      },
      {
        name: "Houses in a Row",
        description: "Count all matchsticks in the houses",
        matchsticks: [
          ...house(5, 20),
          ...house(30, 20),
          ...house(55, 20),
        ],
        totalMatchsticks: 18,
      },
    ],
  },

  // ─── LEVEL 4: Compound shapes ───
  {
    level: 4,
    patterns: [
      {
        name: "Square with Triangle Flag",
        description: "A square with a triangle on top — count them all",
        matchsticks: [
          ...square(25, 45),
          ...triangle(25, 25),
          ...hLine(50, 45, GRID),
        ],
        totalMatchsticks: 8,
      },
      {
        name: "Hexagons",
        description: "Two hexagons side by side",
        matchsticks: [
          ...hexagon(15, 35),
          ...hexagon(50, 35),
        ],
        totalMatchsticks: 12,
      },
      {
        name: "Stars and Diamonds",
        description: "A star and two diamonds — count every stick",
        matchsticks: [
          ...star(30, 25),
          ...diamond(10, 40),
          ...diamond(65, 40),
        ],
        totalMatchsticks: 20,
      },
      {
        name: "Mixed Grid",
        description: "Squares, triangles, and diamonds mixed together",
        matchsticks: [
          ...square(10, 15),
          ...triangle(40, 15),
          ...diamond(65, 15),
          ...square(10, 55),
          ...diamond(40, 55),
          ...triangle(65, 55),
        ],
        totalMatchsticks: 22,
      },
    ],
  },

  // ─── LEVEL 5: Complex compound patterns ───
  {
    level: 5,
    patterns: [
      {
        name: "Village",
        description: "Houses with a fence of connected squares below",
        matchsticks: [
          ...house(5, 5),
          ...house(30, 5),
          ...house(55, 5),
          ...connectedSquares(5, 55, 4),
        ],
        totalMatchsticks: 31,
      },
      {
        name: "Star Grid",
        description: "Four stars arranged in a grid — count every matchstick",
        matchsticks: [
          ...star(5, 5),
          ...star(50, 5),
          ...star(5, 50),
          ...star(50, 50),
        ],
        totalMatchsticks: 48,
      },
      {
        name: "Mega Pattern",
        description: "Connected squares topped with triangles and flanked by diamonds",
        matchsticks: [
          ...connectedSquares(10, 45, 4),
          ...triangle(10, 25),
          ...triangle(30, 25),
          ...triangle(50, 25),
          ...triangle(70, 25),
          ...diamond(5, 10),
          ...diamond(80, 10),
        ],
        totalMatchsticks: 33,
      },
      {
        name: "Castle",
        description: "A castle made of squares, triangles, and lines",
        matchsticks: [
          // Base wall
          ...connectedSquares(10, 60, 4),
          // Towers
          ...square(10, 40),
          ...square(70, 40),
          // Tower roofs
          ...triangle(10, 20),
          ...triangle(70, 20),
          // Center tower
          ...square(35, 35),
          ...triangle(35, 15),
          // Flag
          ...vLine(45, 5, 10),
        ],
        totalMatchsticks: 34,
      },
    ],
  },
];

export function getLevel(levelNum) {
  return levels.find((l) => l.level === levelNum) || levels[0];
}

export function getRandomPattern(levelNum) {
  const level = getLevel(levelNum);
  const idx = Math.floor(Math.random() * level.patterns.length);
  return level.patterns[idx];
}

export const MAX_LEVEL = levels.length;
