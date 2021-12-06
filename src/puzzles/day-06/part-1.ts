import { InputReader } from "../../helpers/input-reader";

const NEW_FISH_AGE = 8;
const FISH_RESET_AGE = 6;

function getNextDayFishAges(fishAges: number[]): number[] {
  let newFishes = 0;
  const nextDayAges = [];

  for (const fishAge of fishAges) {
    if (fishAge === 0) {
      newFishes++;
      nextDayAges.push(FISH_RESET_AGE);
    } else {
      nextDayAges.push(fishAge - 1);
    }
  }

  const newFishesAges = Array.from({ length: newFishes }, () => NEW_FISH_AGE);

  return nextDayAges.concat(newFishesAges);
}

function recursiveGetFishesAges(fishesAges: number[], day: number): number[] {
  const nextDayFishesAges = getNextDayFishAges(fishesAges);

  if (day === 1) {
    return nextDayFishesAges;
  }

  return recursiveGetFishesAges(nextDayFishesAges, day - 1);
}

function getFishCountAfterDays(input: number[], days: number): number {
  const fishesAges = recursiveGetFishesAges(input, days);

  return fishesAges.length;
}

const input = InputReader.getDayReader<number[]>("6").read((line) => {
  return line.split(",").map((value) => parseInt(value, 10));
});

const SIMULATE_DAYS = 80;

console.log(getFishCountAfterDays(input[0], SIMULATE_DAYS));
