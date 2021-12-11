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

function nextFlashIteration(grid: number[][]): number {
  let iterationFlashCount = 0;

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      iterationFlashCount += increaseCountersRecursively(grid, i, j);
    }
  }

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] > 9) {
        grid[i][j] = 0;
      }
    }
  }

  return iterationFlashCount;
}

function getFlashesCount(input: number[][], iterations: number): number {
  let flashCount = 0;

  for (let i = 0; i < iterations; i++) {
    flashCount += nextFlashIteration(input);
  }

  return flashCount;
}

const input = InputReader.getDayReader<number[]>("11").read((line) => {
  return line.split("").map((v) => parseInt(v, 10));
});

const ITERATIONS = 100;

console.log(getFlashesCount(input, ITERATIONS));
