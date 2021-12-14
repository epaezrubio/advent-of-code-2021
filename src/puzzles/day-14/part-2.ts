import { InputReader } from "../../helpers/input-reader";

type PairInsertions = Record<string, string>;
type ElementsCounts = Record<string, number>;

interface ParsedInput {
  pairCounts: ElementsCounts;
  letterCounts: ElementsCounts;
  pairInsertions: PairInsertions;
}

function putCount(
  countRecord: Record<string, number>,
  key: string,
  count = 1
): void {
  if (!(key in countRecord)) {
    countRecord[key] = 0;
  }

  countRecord[key] += count;
}

function getParsedInput(input: string[]): ParsedInput {
  const pairInsertions: PairInsertions = {};
  const pairCounts: ElementsCounts = {};
  const letterCounts: ElementsCounts = {};

  for (let i = 0; i < input[0].length - 1; i++) {
    const ab = input[0].substring(i, i + 2);
    const a = ab[0];

    putCount(letterCounts, a);
    putCount(pairCounts, ab);
  }

  putCount(letterCounts, input[0][input[0].length - 1]);

  for (let i = 2; i < input.length; i++) {
    const [ab, result] = input[i].split(" -> ");

    pairInsertions[ab] = result;
  }

  return {
    pairCounts,
    letterCounts,
    pairInsertions,
  };
}

function getNewCounts(
  pairCounts: ElementsCounts,
  letterCounts: ElementsCounts,
  pairInsertions: PairInsertions
): { pairCounts: ElementsCounts; letterCounts: ElementsCounts } {
  const newPairCounts = { ...pairCounts };
  const newLetterCounts = { ...letterCounts };

  for (const ab in pairCounts) {
    const [a, b] = ab.split("");

    const count = pairCounts[ab];
    const newInsertion = pairInsertions[ab];

    const ab1 = `${a}${newInsertion}`;
    const ab2 = `${newInsertion}${b}`;

    putCount(newPairCounts, ab, -count);
    putCount(newPairCounts, ab1, count);
    putCount(newPairCounts, ab2, count);

    putCount(newLetterCounts, newInsertion, count);
  }

  return {
    pairCounts: newPairCounts,
    letterCounts: newLetterCounts,
  };
}

function getPolymerIterationRecursive(
  pairCounts: ElementsCounts,
  letterCounts: ElementsCounts,
  pairInsertions: PairInsertions,
  iterations: number
): ElementsCounts {
  if (iterations === 0) {
    return letterCounts;
  }

  const newCounts = getNewCounts(pairCounts, letterCounts, pairInsertions);

  return getPolymerIterationRecursive(
    newCounts.pairCounts,
    newCounts.letterCounts,
    pairInsertions,
    iterations - 1
  );
}

function getPolymerElementCounts(
  letterCounts: ElementsCounts
): { element: string; count: number }[] {
  const elementsCountEntries = Object.entries(letterCounts).map(
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
  const polymerLetterCounts = getPolymerIterationRecursive(
    input.pairCounts,
    input.letterCounts,
    input.pairInsertions,
    iterations
  );

  const polymerElementCounts = getPolymerElementCounts(polymerLetterCounts);

  const leastFrequentElement = polymerElementCounts[0];
  const mostFrequentElement =
    polymerElementCounts[polymerElementCounts.length - 1];

  return mostFrequentElement.count - leastFrequentElement.count;
}

const input = InputReader.getDayReader<string>("14").read();
const parsedInput = getParsedInput(input);

const ITERATIONS = 40;

console.log(getPolymerCalculationAfterIterations(parsedInput, ITERATIONS));
