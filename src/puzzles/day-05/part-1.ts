import { InputReader } from "../../helpers/input-reader";

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function isOrthogonalLine(line: Line): boolean {
  return line.x1 === line.x2 || line.y1 === line.y2;
}

function getComponentIncrement(c1: number, c2: number): -1 | 0 | 1 {
  if (c1 < c2) {
    return 1;
  }

  if (c1 > c2) {
    return -1;
  }

  return 0;
}

function getMaxComponent(lines: Line[]): number {
  return lines.reduce((acc, cur) => {
    if (cur.x1 > acc) {
      return cur.x1;
    }

    if (cur.x2 > acc) {
      return cur.x2;
    }

    if (cur.y1 > acc) {
      return cur.y1;
    }

    if (cur.y2 > acc) {
      return cur.y2;
    }

    return acc;
  }, 0);
}

function getLinesGrid(size: number): number[][] {
  return Array.from({ length: size + 1 }, () => {
    return Array.from({ length: size + 1 }, () => 0);
  });
}

function markLinesOverlap(grid: number[][], lines: Line[]): void {
  for (const line of lines) {
    if (!isOrthogonalLine(line)) {
      continue;
    }

    const xIncrement = getComponentIncrement(line.x1, line.x2);
    const yIncrement = getComponentIncrement(line.y1, line.y2);

    let i = line.x1;
    let j = line.y1;

    grid[i][j]++;

    if (xIncrement === 0 && yIncrement === 0) {
      return;
    }

    do {
      i += xIncrement;
      j += yIncrement;

      grid[i][j]++;
    } while (i !== line.x2 || j !== line.y2);
  }
}

function countOverlappingLines(grid: number[][]): number {
  return grid.reduce((acc, cur) => {
    return (
      acc +
      cur.reduce((acc2, cur2) => {
        if (cur2 > 1) {
          return acc2 + 1;
        }

        return acc2;
      }, 0)
    );
  }, 0);
}

function getLinesOverlapCount(input: Line[]): number {
  const maxComponent = getMaxComponent(input);
  const linesGrid = getLinesGrid(maxComponent);

  markLinesOverlap(linesGrid, input);

  return countOverlappingLines(linesGrid);
}

const input = InputReader.getDayReader<Line>("5").read((line) => {
  const [p1, p2] = line.split(" -> ");

  const [x1, y1] = p1.split(",").map((component) => parseInt(component, 10));
  const [x2, y2] = p2.split(",").map((component) => parseInt(component, 10));

  return {
    x1,
    y1,
    x2,
    y2,
  };
});

console.log(getLinesOverlapCount(input));
