import { InputReader } from "../../helpers/input-reader";

type PositionsRecord = Record<number, number>;

function getPositionsRecord(positions: number[]): PositionsRecord {
  const positionsRecord: PositionsRecord = {};

  for (const position of positions) {
    if (!(position in positionsRecord)) {
      positionsRecord[position] = 0;
    }

    positionsRecord[position]++;
  }

  return positionsRecord;
}

function getFuelCostMap(positionsRecord: PositionsRecord): number[] {
  const positionKeys = Object.keys(positionsRecord).map((v) => parseInt(v, 10));

  const minPosition = Math.min(...positionKeys);
  const maxPosition = Math.max(...positionKeys);

  const costMap = Array.from({ length: maxPosition - minPosition }, () => 0);

  let currentElements = 0;
  let leftElements = 0;
  let rightElements = 0;

  // calculate cost to the leftmost element, and count how many elements are on the right
  for (const position in positionsRecord) {
    const positionNumber = parseInt(position, 10);

    if (positionNumber === minPosition) {
      currentElements = positionsRecord[position];
      continue;
    }

    const distance = Math.abs(minPosition - positionNumber);
    const elements = positionsRecord[position];

    costMap[0] += Math.abs(distance * elements);
    rightElements += elements;
  }

  // perform a left-to-right pass keeping track of elements on the left and right
  for (let i = minPosition + 1; i < maxPosition + 1; i++) {
    leftElements += currentElements;
    currentElements = positionsRecord[i] || 0;
    rightElements -= currentElements;

    costMap[i - minPosition] =
      costMap[i - minPosition - 1] +
      leftElements -
      rightElements -
      currentElements;
  }

  return costMap;
}

function getLowestFuelConsumptionAlignment(input: number[]): number {
  const positionsRecord = getPositionsRecord(input);
  const costMap = getFuelCostMap(positionsRecord);

  return costMap.reduce((acc, cur) => {
    return Math.min(acc, cur);
  }, Infinity);
}

const input = InputReader.getDayReader<number[]>("7").read((line) => {
  return line.split(",").map((value) => parseInt(value, 10));
});

console.log(getLowestFuelConsumptionAlignment(input[0]));
