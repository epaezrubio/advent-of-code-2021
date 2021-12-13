import { InputReader } from "../../helpers/input-reader";

interface DotCoordinates {
  x: number;
  y: number;
}

interface FoldInstruction {
  axis: "x" | "y";
  position: number;
}

interface ParsedInput {
  dotsCoordinates: DotCoordinates[];
  foldInstructions: FoldInstruction[];
}

function printGrid(grid: boolean[][]): void {
  console.log(
    grid
      .map((row) => row.map((cell) => `${cell ? "#" : "."}`).join(" "))
      .join("\n")
  );
}

function getParsedInput(input: string[]): ParsedInput {
  const dotsCoordinates: DotCoordinates[] = [];
  const foldInstructions: FoldInstruction[] = [];

  let currentParseBlock: "dots" | "fold" = "dots";

  for (const line of input) {
    if (line.length === 0) {
      currentParseBlock = "fold";
      continue;
    }

    switch (currentParseBlock) {
      case "dots": {
        const [x, y] = line.split(",").map((v) => parseInt(v));

        dotsCoordinates.push({ x, y });
        break;
      }
      case "fold": {
        const foldInstruction = line.split("=");

        const axis = foldInstruction[0][foldInstruction[0].length - 1] as
          | "x"
          | "y";
        const position = parseInt(foldInstruction[1]);

        foldInstructions.push({ axis, position });
        break;
      }
    }
  }

  return {
    dotsCoordinates,
    foldInstructions,
  };
}

function getDotsGrid(dots: DotCoordinates[]): boolean[][] {
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const dot of dots) {
    maxX = Math.max(maxX, dot.x);
    maxY = Math.max(maxY, dot.y);
  }

  const dotsGrid: boolean[][] = Array.from({ length: maxY + 1 }, () => {
    return Array.from({ length: maxX + 1 }, () => {
      return false;
    });
  });

  for (const dot of dots) {
    dotsGrid[dot.y][dot.x] = true;
  }

  return dotsGrid;
}

function foldAlongX(dotsGrid: boolean[][], position: number): boolean[][] {
  const newGrid: boolean[][] = [];

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < dotsGrid.length; i++) {
    const newRow: boolean[] = [];

    for (let j = 0; j < position; j++) {
      newRow[j] = dotsGrid[i][j] || dotsGrid[i][position * 2 - j];
    }

    newGrid.push(newRow);
  }

  return newGrid;
}

function foldAlongY(dotsGrid: boolean[][], position: number): boolean[][] {
  const newGrid: boolean[][] = [];

  for (let i = 0; i < position; i++) {
    const newRow: boolean[] = [];

    for (let j = 0; j < dotsGrid[i].length; j++) {
      newRow[j] = dotsGrid[i][j] || dotsGrid[position * 2 - i][j];
    }

    newGrid.push(newRow);
  }

  return newGrid;
}

function printVisibleDotsCountAfterFolds(input: ParsedInput): void {
  let dotsGrid = getDotsGrid(input.dotsCoordinates);

  for (const foldInstruction of input.foldInstructions) {
    if (foldInstruction.axis === "x") {
      dotsGrid = foldAlongX(dotsGrid, foldInstruction.position);
    } else {
      dotsGrid = foldAlongY(dotsGrid, foldInstruction.position);
    }
  }

  printGrid(dotsGrid);
}

const input = InputReader.getDayReader<string>("13").read();
const parsedInput = getParsedInput(input);

printVisibleDotsCountAfterFolds(parsedInput);
