import { InputReader } from "../../helpers/input-reader";

function sum(numbers: number[]): number {
  return numbers.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
}

function getMeasurementWindowIncreasesCount(
  input: number[],
  windowSize: number
): number {
  let increases = 0;

  for (let i = windowSize; i < input.length; i++) {
    const sharedWindow = sum(input.slice(i - windowSize + 1, i));

    const lastWindow = input[i - windowSize] + sharedWindow;
    const currentWindow = sharedWindow + input[i];

    if (lastWindow < currentWindow) {
      increases++;
    }
  }

  return increases;
}

const input = InputReader.getDayReader<number>("1").read((value) =>
  parseInt(value, 10)
);

const WINDOW_SIZE = 3;

console.log(getMeasurementWindowIncreasesCount(input, WINDOW_SIZE));
