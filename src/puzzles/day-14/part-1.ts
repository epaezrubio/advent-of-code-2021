import { InputReader } from "../../helpers/input-reader";

type PairInsertions = Record<string, Record<string, string>>;

interface ParsedInput {
  polymerTemplate: string;
  pairInsertions: PairInsertions;
}

function getParsedInput(input: string[]): ParsedInput {
  const polymerTemplate = input[0];
  const pairInsertions: PairInsertions = {};

  for (let i = 2; i < input.length; i++) {
    const [ab, result] = input[i].split(" -> ");

    const a = ab[0];
    const b = ab[1];

    if (!(a in pairInsertions)) {
      pairInsertions[a] = {};
    }

    pairInsertions[a][b] = result;
  }

  return {
    polymerTemplate,
    pairInsertions,
  };
}

function getExpandedPolymerTemplate(
  polymerTemplate: string,
  pairInsertions: PairInsertions
): string {
  let newPolymerTemplate = polymerTemplate;
  let currentIndex = 0;

  while (currentIndex < newPolymerTemplate.length - 1) {
    const a = newPolymerTemplate[currentIndex];
    const b = newPolymerTemplate[currentIndex + 1];

    newPolymerTemplate =
      newPolymerTemplate.substring(0, currentIndex + 1) +
      pairInsertions[a][b] +
      newPolymerTemplate.substring(currentIndex + 1, newPolymerTemplate.length);

    currentIndex += 2;
  }

  return newPolymerTemplate;
}

function getPolymerIterationRecursive(
  polymerTemplate: string,
  pairInsertions: PairInsertions,
  iterations: number
): string {
  if (iterations === 0) {
    return polymerTemplate;
  }

  const newPolymerTemplate = getExpandedPolymerTemplate(
    polymerTemplate,
    pairInsertions
  );

  return getPolymerIterationRecursive(
    newPolymerTemplate,
    pairInsertions,
    iterations - 1
  );
}

function getPolymerElementCounts(
  polymerTemplate: string
): { element: string; count: number }[] {
  const elementsCount = polymerTemplate
    .split("")
    .reduce<Record<string, number>>((acc, cur) => {
      if (!(cur in acc)) {
        acc[cur] = 0;
      }

      acc[cur]++;

      return acc;
    }, {});

  const elementsCountEntries = Object.entries(elementsCount).map(
    ([element, count]) => {
      return {
        element,
        count,
      };
    }
  );

  elementsCountEntries.sort((a, b) => {
    return a.count - b.count;
  });

  return elementsCountEntries;
}

function getPolymerCalculationAfterIterations(
  input: ParsedInput,
  iterations: number
): number {
  const newPolymerTemplate = getPolymerIterationRecursive(
    input.polymerTemplate,
    input.pairInsertions,
    iterations
  );

  const polymerElementCounts = getPolymerElementCounts(newPolymerTemplate);

  const leastFrequentElement = polymerElementCounts[0];
  const mostFrequentElement =
    polymerElementCounts[polymerElementCounts.length - 1];

  return mostFrequentElement.count - leastFrequentElement.count;
}

const input = InputReader.getDayReader<string>("14").read();
const parsedInput = getParsedInput(input);

const ITERATIONS = 10;

console.log(getPolymerCalculationAfterIterations(parsedInput, ITERATIONS));
