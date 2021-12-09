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

function getBasinRecursively(
  grid: number[][],
  visitedBasins: boolean[][],
  i: number,
  j: number
): number {
  const cellValue = safeGridGet(grid, i, j);

  if (cellValue === undefined) {
    // out of bounds
    return 0;
  }

  if (visitedBasins[i][j]) {
    // cell already visited
    return 0;
  }

  visitedBasins[i][j] = true;

  if (cellValue === 9) {
    // limit of basin
    return 0;
  }

  const top = getBasinRecursively(grid, visitedBasins, i, j - 1);
  const right = getBasinRecursively(grid, visitedBasins, i + 1, j);
  const bottom = getBasinRecursively(grid, visitedBasins, i, j + 1);
  const left = getBasinRecursively(grid, visitedBasins, i - 1, j);

  return 1 + top + right + bottom + left;
}

function multiplyLargestBasinSizes(input: number[][], n: number): number {
  const visitedBasins = Array.from(input, () => {
    return Array.from(input[0], () => false);
  });

  const basinsTotalSizes = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const basinSize = getBasinRecursively(input, visitedBasins, i, j);

      if (basinSize > 0) {
        basinsTotalSizes.push(basinSize);
      }
    }
  }

  basinsTotalSizes.sort((a, b) => a - b);

  return basinsTotalSizes
    .slice(basinsTotalSizes.length - n, basinsTotalSizes.length)
    .reduce((acc, cur) => {
      return acc * cur;
    }, 1);
}

const input = InputReader.getDayReader<number[]>("9").read((line) => {
  return line.split("").map((v) => parseInt(v, 10));
});

const MULTIPLY_LARGEST = 3;

console.log(multiplyLargestBasinSizes(input, MULTIPLY_LARGEST));
