import { InputReader } from "../../helpers/input-reader";

function safeGridGet(
  grid: number[][],
  i: number,
  j: number
): number | undefined {
  if (i >= 0 && i < grid.length) {
    return grid[i][j];
  }

  return undefined;
}

function increaseCountersRecursively(
  grid: number[][],
  i: number,
  j: number
): number {
  const element = safeGridGet(grid, i, j);

  if (element === undefined) {
    // out of grid bounds
    return 0;
  }

  let flashCount = 0;

  grid[i][j]++;

  if (grid[i][j] === 10) {
    flashCount++;

    // loop through all surounding cells
    for (let ii = i - 1; ii <= i + 1; ii++) {
      for (let jj = j - 1; jj <= j + 1; jj++) {
        if (ii == i && jj == j) {
          // the object itself, don't do anything with it
          continue;
        }

        flashCount = flashCount + increaseCountersRecursively(grid, ii, jj);
      }
    }
  }

  return flashCount;
}

function nextFlashIteration(grid: number[][]): boolean {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      increaseCountersRecursively(grid, i, j);
    }
  }

  let allCellsFlashed = true;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] > 9) {
        grid[i][j] = 0;
      } else {
        allCellsFlashed = false;
      }
    }
  }

  return allCellsFlashed;
}

function getFlashesCount(input: number[][]): number {
  let iteration = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,no-constant-condition
  while (true) {
    iteration++;

    const allCellsFlashed = nextFlashIteration(input);

    if (allCellsFlashed) {
      break;
    }
  }

  return iteration;
}

const input = InputReader.getDayReader<number[]>("11").read((line) => {
  return line.split("").map((v) => parseInt(v, 10));
});

console.log(getFlashesCount(input));
