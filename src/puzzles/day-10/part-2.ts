import { InputReader } from "../../helpers/input-reader";

type OpeningBrackets = "(" | "[" | "{" | "<";
type ClosingBrackets = ")" | "]" | "}" | ">";
type Brackets = ClosingBrackets | OpeningBrackets;

const matchingClosingBracket: Record<OpeningBrackets, ClosingBrackets> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
} as const;

const missingBracketScores: Record<ClosingBrackets, number> = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
} as const;

function isOpeningBracket(bracket: string): bracket is OpeningBrackets {
  return (
    bracket === "(" || bracket === "[" || bracket === "{" || bracket === "<"
  );
}

function areMatchingBrackets(
  openingBracket: OpeningBrackets,
  closingBracket: ClosingBrackets
): boolean {
  return matchingClosingBracket[openingBracket] === closingBracket;
}

function getIncompleteLineScore(line: Brackets[]): number {
  const bracketsStack: OpeningBrackets[] = [];

  for (const bracket of line) {
    if (isOpeningBracket(bracket)) {
      bracketsStack.push(bracket);
      continue;
    }

    if (
      !areMatchingBrackets(bracketsStack[bracketsStack.length - 1], bracket)
    ) {
      return 0;
    }

    // closing bracket matches with last in stack
    bracketsStack.pop();
  }

  let incompleteLineScore = 0;

  for (let i = bracketsStack.length - 1; i >= 0; i--) {
    const missingBracket = matchingClosingBracket[bracketsStack[i]];
    const missingBracketScore = missingBracketScores[missingBracket];

    incompleteLineScore = incompleteLineScore * 5 + missingBracketScore;
  }

  return incompleteLineScore;
}

function getIncompleteLinesScore(lines: Brackets[][]): number[] {
  const incompleteLinesScores = [];

  for (const line of lines) {
    const incompleteLineScore = getIncompleteLineScore(line);

    if (incompleteLineScore !== 0) {
      incompleteLinesScores.push(incompleteLineScore);
    }
  }

  return incompleteLinesScores;
}

function getMiddleIncompleteScore(input: Brackets[][]): number {
  const incompleteLinesScores = getIncompleteLinesScore(input);

  incompleteLinesScores.sort((a, b) => a - b);

  return incompleteLinesScores[(incompleteLinesScores.length / 2) >> 0];
}

const input = InputReader.getDayReader<Brackets[]>("10").read((line) => {
  return line.split("") as Brackets[];
});

console.log(getMiddleIncompleteScore(input));
