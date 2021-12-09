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

function getAdjacentNumbers(grid: number[][], i: number, j: number): number[] {
  const adjacentNumbers = [
    safeGridGet(grid, i + 1, j),
    safeGridGet(grid, i - 1, j),
    safeGridGet(grid, i, j + 1),
    safeGridGet(grid, i, j - 1),
  ];

  return adjacentNumbers.filter((number) => {
    return number !== undefined;
  }) as number[];
}

function allGreaterThan(numbers: number[], number: number): boolean {
  return numbers.every((v) => {
    return v > number;
  });
}

function sumLowPoints(input: number[][]): number {
  const lowPoints = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      const number = input[i][j];
      const adjacentNumbers = getAdjacentNumbers(input, i, j);

      if (allGreaterThan(adjacentNumbers, number)) {
        lowPoints.push(number);
      }
    }
  }

  return lowPoints.reduce((acc, cur) => {
    return acc + cur + 1;
  }, 0);
}

const input = InputReader.getDayReader<number[]>("9").read((line) => {
  return line.split("").map((v) => parseInt(v, 10));
});

console.log(sumLowPoints(input));
