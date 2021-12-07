import { InputReader } from "../../helpers/input-reader";

type FishesAgesRecord = Record<number, number>;

const NEW_FISH_AGE = 8;
const FISH_RESET_AGE = 6;

function getNewFishesAgesRecord(): FishesAgesRecord {
  const fishesAgesRecord: FishesAgesRecord = {};

  for (let i = 0; i < NEW_FISH_AGE + 1; i++) {
    fishesAgesRecord[i] = 0;
  }

  return fishesAgesRecord;
}

function getInitialFishesAgesRecord(initialFishes: number[]): FishesAgesRecord {
  const fishesAgesRecord = getNewFishesAgesRecord();

  for (const initialFish of initialFishes) {
    fishesAgesRecord[initialFish]++;
  }

  return fishesAgesRecord;
}

function getNextDayFishAges(fishAges: FishesAgesRecord): FishesAgesRecord {
  const newFishesAges = getNewFishesAgesRecord();

  for (let i = 1; i < NEW_FISH_AGE + 1; i++) {
    newFishesAges[i - 1] = fishAges[i];
  }

  newFishesAges[NEW_FISH_AGE] = fishAges[0];
  newFishesAges[FISH_RESET_AGE] += fishAges[0];

  return newFishesAges;
}

function recursiveGetFishesAges(
  fishesAgesRecord: FishesAgesRecord,
  day: number
): FishesAgesRecord {
  const nextDayFishesAges = getNextDayFishAges(fishesAgesRecord);

  if (day === 1) {
    return nextDayFishesAges;
  }

  return recursiveGetFishesAges(nextDayFishesAges, day - 1);
}

function getFishCountAfterDays(input: number[], days: number): number {
  const fishesAgesRecord = getInitialFishesAgesRecord(input);
  const fishesAges = recursiveGetFishesAges(fishesAgesRecord, days);

  return Object.values(fishesAges).reduce((acc, cur) => {
    return acc + cur;
  }, 0);
}

const input = InputReader.getDayReader<number[]>("6").read((line) => {
  return line.split(",").map((value) => parseInt(value, 10));
});

const SIMULATE_DAYS = 256;

console.log(getFishCountAfterDays(input[0], SIMULATE_DAYS));
