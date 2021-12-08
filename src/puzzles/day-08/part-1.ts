import { InputReader } from "../../helpers/input-reader";

function countEasyDigitsOccurences(input: string[][]): number {
  const totalEasyDigitsCount = input.reduce((acc, cur) => {
    const easyDigitsCount = cur.filter((digit) => {
      return (
        digit.length === 2 ||
        digit.length === 3 ||
        digit.length === 4 ||
        digit.length === 7
      );
    }).length;

    return acc + easyDigitsCount;
  }, 0);

  return totalEasyDigitsCount;
}

const input = InputReader.getDayReader<string[]>("8").read((line) => {
  return line.split(" | ")[1].split(" ");
});

console.log(countEasyDigitsOccurences(input));
