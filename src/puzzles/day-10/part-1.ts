import { InputReader } from "../../helpers/input-reader";

type OpeningBrackets = "(" | "[" | "{" | "<";
type ClosingBrackets = ")" | "]" | "}" | ">";
type Brackets = ClosingBrackets | OpeningBrackets;

const syntaxErrorScores: Record<ClosingBrackets, number> = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
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
  return (
    (openingBracket === "(" && closingBracket === ")") ||
    (openingBracket === "[" && closingBracket === "]") ||
    (openingBracket === "{" && closingBracket === "}") ||
    (openingBracket === "<" && closingBracket === ">")
  );
}

function getSyntaxErrorScore(line: Brackets[]): number {
  const bracketsStack: OpeningBrackets[] = [];

  for (const bracket of line) {
    if (isOpeningBracket(bracket)) {
      bracketsStack.push(bracket);
      continue;
    }

    if (
      !areMatchingBrackets(bracketsStack[bracketsStack.length - 1], bracket)
    ) {
      return syntaxErrorScores[bracket];
    }

    // closing bracket matches with last in stack
    bracketsStack.pop();
  }

  return 0;
}

function sumSyntaxErrorScores(input: Brackets[][]): number {
  const totalErrorScores = input.reduce((acc, cur) => {
    return acc + getSyntaxErrorScore(cur);
  }, 0);

  return totalErrorScores;
}

const input = InputReader.getDayReader<Brackets[]>("10").read((line) => {
  return line.split("") as Brackets[];
});

console.log(sumSyntaxErrorScores(input));
