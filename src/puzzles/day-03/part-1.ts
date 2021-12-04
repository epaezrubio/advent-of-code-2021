import { InputReader } from "../../helpers/input-reader";

function toDecimal(bits: number[]): number {
  return bits.reduce((acc, cur, index) => {
    return acc + cur * Math.pow(2, bits.length - index - 1);
  }, 0);
}

function getConsumption(readings: string[]): number {
  const bitsCounters = Array.from(readings[0], () => 0);

  for (const reading of readings) {
    for (let i = 0; i < reading.length; i++) {
      if (reading[i] === "1") {
        bitsCounters[i]++;
      }
    }
  }

  const gammaRate = bitsCounters.map((bit) => {
    return bit > readings.length / 2 ? 1 : 0;
  });

  const epsilonRate = bitsCounters.map((bit) => {
    return bit > readings.length / 2 ? 0 : 1;
  });

  return toDecimal(gammaRate) * toDecimal(epsilonRate);
}

const input = InputReader.getDayReader<string>("3").read();

console.log(getConsumption(input));
