import { InputReader } from "../../helpers/input-reader";

class BingoBoard {
  private _isWinning = false;

  private readonly numberPositions: Map<number, [number, number]> = new Map();

  private readonly numberMarks: boolean[][] = [];

  constructor(private readonly numbers: number[][]) {
    // index number positions in a map for faster access
    for (let i = 0; i < numbers.length; i++) {
      this.numberMarks.push(numbers[i].map(() => false));

      for (let j = 0; j < numbers[i].length; j++) {
        this.numberPositions.set(numbers[i][j], [i, j]);
      }
    }
  }

  public get isWinning(): boolean {
    return this._isWinning;
  }

  public static fromStringRows(rows: string[]): BingoBoard {
    const parsedNumbers = rows.map((row) => {
      return row
        .split(" ")
        .filter((stringChunk) => {
          return stringChunk.length > 0;
        })
        .map((number) => {
          return parseInt(number, 10);
        });
    });

    return new BingoBoard(parsedNumbers);
  }

  public markNumber(number: number): void {
    const numberPosition = this.numberPositions.get(number);

    if (!numberPosition) {
      return;
    }

    this.numberMarks[numberPosition[0]][numberPosition[1]] = true;

    this._isWinning =
      this.isFullRowMarked(numberPosition[0]) ||
      this.isFullColumnMarked(numberPosition[1]);
  }

  public getUnmarkedNumbers(): number[] {
    const unmarkedNumbers: number[] = [];

    for (let i = 0; i < this.numberMarks.length; i++) {
      for (let j = 0; j < this.numberMarks[i].length; j++) {
        if (this.numberMarks[i][j]) {
          continue;
        }

        unmarkedNumbers.push(this.numbers[i][j]);
      }
    }

    return unmarkedNumbers;
  }

  private isFullRowMarked(rowIndex: number): boolean {
    for (const numberMark of this.numberMarks[rowIndex]) {
      if (!numberMark) {
        return false;
      }
    }

    return true;
  }

  private isFullColumnMarked(columnIndex: number): boolean {
    for (const numberMark of this.numberMarks) {
      if (!numberMark[columnIndex]) {
        return false;
      }
    }

    return true;
  }
}

interface ParsedInput {
  numbers: number[];
  boards: BingoBoard[];
}

function parseInput(input: string[], boardSideSize: number): ParsedInput {
  const numbers = input[0].split(",").map((number) => {
    return parseInt(number, 10);
  });

  const boards: BingoBoard[] = [];

  for (let i = 2; i < input.length; i += boardSideSize + 1) {
    boards.push(BingoBoard.fromStringRows(input.slice(i, i + boardSideSize)));
  }

  return {
    numbers,
    boards,
  };
}

function getLastWinningBoardScore(input: ParsedInput): number {
  const winningBoards = input.boards.map(() => false);
  let winningBoardsCount = 0;

  for (const number of input.numbers) {
    for (let i = 0; i < input.boards.length; i++) {
      input.boards[i].markNumber(number);

      if (input.boards[i].isWinning && !winningBoards[i]) {
        winningBoards[i] = true;
        winningBoardsCount++;

        if (winningBoardsCount === input.boards.length) {
          const markedNumbersSum = input.boards[i]
            .getUnmarkedNumbers()
            .reduce((acc, cur) => {
              return acc + cur;
            }, 0);

          return markedNumbersSum * number;
        }
      }
    }
  }

  throw new Error("last winning board not found");
}

const BOARD_SIDE_SIZE = 5;

const input = InputReader.getDayReader<string>("4").read();
const parsedInput = parseInput(input, BOARD_SIDE_SIZE);

console.log(getLastWinningBoardScore(parsedInput));
