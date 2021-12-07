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

function calculatePositionCost(items: number, distance: number): number {
  if (distance === 0) {
    return 0;
  }

  return items * distance + calculatePositionCost(items, distance - 1);
}

function calculateLeftCost(numbers: number[]): number {
  return numbers.reduce((acc, cur, index) => {
    const rightIndex = numbers.length - index + 1;

    return acc + calculatePositionCost(cur, rightIndex);
  }, 0);
}

function calculateRightCost(numbers: number[]): number {
  return numbers.reduce((acc, cur, index) => {
    return acc + calculatePositionCost(cur, index);
  }, 0);
}

function getFuelCostMap(positionsRecord: PositionsRecord): number[] {
  const positionKeys = Object.keys(positionsRecord).map((v) => parseInt(v, 10));

  const minPosition = Math.min(...positionKeys);
  const maxPosition = Math.max(...positionKeys);

  const positionsValues = Array.from(
    { length: maxPosition - minPosition + 1 },
    (v, i) => {
      return positionsRecord[i - minPosition] || 0;
    }
  );

  const costMap = Array.from({ length: maxPosition - minPosition }, (v, i) => {
    const leftValues = positionsValues.slice(0, i);
    const rightValues = positionsValues.slice(
      i + 1,
      maxPosition - minPosition + 1
    );

    return calculateLeftCost(leftValues) + calculateRightCost(rightValues);
  });

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
