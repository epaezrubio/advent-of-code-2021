import { InputReader } from "../../helpers/input-reader";

function getMeasurementIncreasesCount(input: number[]): number {
  let increases = 0;

  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      increases++;
    }
  }

  return increases;
}

const input = InputReader.getDayReader<number>("1").read((value) =>
  parseInt(value, 10)
);

console.log(getMeasurementIncreasesCount(input));
