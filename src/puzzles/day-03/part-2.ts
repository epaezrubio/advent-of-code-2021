import { InputReader } from "../../helpers/input-reader";

type RatingComparisorFunction = (
  bitsCounters: number[],
  currentBit: number,
  totalReadings: number
) => "0" | "1";

function toBitsArray(bits: string): number[] {
  return bits.split("").map((bit) => {
    return parseInt(bit, 10);
  });
}

function toDecimal(bits: number[]): number {
  return bits.reduce((acc, cur, index) => {
    return acc + cur * Math.pow(2, bits.length - index - 1);
  }, 0);
}

function getBitsCounters(readings: string[]): number[] {
  const bitsCounters = Array.from(readings[0], () => 0);

  for (const reading of readings) {
    for (let i = 0; i < reading.length; i++) {
      if (reading[i] === "1") {
        bitsCounters[i]++;
      }
    }
  }

  return bitsCounters;
}

function getMostCommonBit(
  bitsCounters: number[],
  currentBit: number,
  totalReadings: number,
  tieValue: "0" | "1"
): "0" | "1" {
  const activeBitsCount = bitsCounters[currentBit] - totalReadings / 2;

  if (activeBitsCount === 0) {
    return tieValue;
  }

  return activeBitsCount > 0 ? "1" : "0";
}

function getLeastCommonBit(
  bitsCounters: number[],
  currentBit: number,
  totalReadings: number,
  tieValue: "0" | "1"
): "0" | "1" {
  const activeBitsCount = bitsCounters[currentBit] - totalReadings / 2;

  if (activeBitsCount === 0) {
    return tieValue;
  }

  return activeBitsCount < 0 ? "1" : "0";
}

function getRatingRecursive(
  readings: string[],
  bitsCounters: number[],
  currentBit: number,
  comparisor: RatingComparisorFunction
): string {
  if (readings.length === 1) {
    return readings[0];
  }

  const mostCommonBit = comparisor(bitsCounters, currentBit, readings.length);

  const nextReadings: string[] = [];
  const discardedReadings: string[] = [];

  for (const reading of readings) {
    if (reading[currentBit] === mostCommonBit) {
      nextReadings.push(reading);
    } else {
      discardedReadings.push(reading);
    }
  }

  const nextBitsCounters = [];
  const discardedReadingbitsCounters = getBitsCounters(discardedReadings);

  for (let i = 0; i < bitsCounters.length; i++) {
    nextBitsCounters.push(bitsCounters[i] - discardedReadingbitsCounters[i]);
  }

  return getRatingRecursive(
    nextReadings,
    nextBitsCounters,
    currentBit + 1,
    comparisor
  );
}

function oxygenRatingComparisor(
  bitsCounters: number[],
  currentBit: number,
  totalReadings: number
): "0" | "1" {
  return getMostCommonBit(bitsCounters, currentBit, totalReadings, "1");
}

function co2ScubberComparisor(
  bitsCounters: number[],
  currentBit: number,
  totalReadings: number
): "0" | "1" {
  return getLeastCommonBit(bitsCounters, currentBit, totalReadings, "0");
}

function getOxygenGeneratorRating(
  readings: string[],
  bitsCounters: number[]
): number {
  const oxygenGeneratorRating = getRatingRecursive(
    readings,
    bitsCounters,
    0,
    oxygenRatingComparisor
  );

  return toDecimal(toBitsArray(oxygenGeneratorRating));
}

function getCO2ScrubberRating(
  readings: string[],
  bitsCounters: number[]
): number {
  const co2ScrubberRating = getRatingRecursive(
    readings,
    bitsCounters,
    0,
    co2ScubberComparisor
  );

  return toDecimal(toBitsArray(co2ScrubberRating));
}

function getLifeSupportRating(readings: string[]): number {
  const initialBitsCounters = getBitsCounters(readings);

  return (
    getOxygenGeneratorRating(readings, initialBitsCounters) *
    getCO2ScrubberRating(readings, initialBitsCounters)
  );
}

const input = InputReader.getDayReader<string>("3").read();

console.log(getLifeSupportRating(input));
