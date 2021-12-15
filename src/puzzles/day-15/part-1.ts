import { InputReader } from "../../helpers/input-reader";

interface GridPosition {
  i: number;
  j: number;
}

function serializePosition(pos: GridPosition): string {
  return `${pos.j}-${pos.i}`;
}

function safeGridGet<T>(grid: T[][], i: number, j: number): T | undefined {
  if (i >= 0 && i < grid.length) {
    return grid[i][j];
  }

  return undefined;
}

function binarySearchInsertionIndex<T>(
  arr: T[],
  searchElement: number,
  predicate: (el: T) => number
): number {
  let leftPad = 0;
  let rightPad = arr.length;
  let mid = Math.floor((rightPad - leftPad) / 2);

  while (leftPad < rightPad) {
    const v = predicate(arr[mid]);

    if (v === searchElement) {
      return mid;
    }

    if (v < searchElement) {
      leftPad = mid + 1;
    } else if (v > searchElement) {
      rightPad = mid;
    }

    mid = leftPad + Math.floor((rightPad - leftPad) / 2);
  }

  return mid;
}

class Path {
  currentPath: Map<string, boolean>;

  constructor(
    public readonly grid: number[][],
    public target: GridPosition,
    currentPath: Map<string, boolean>,
    public currentPaths: Path[],
    public readonly lastPosition: GridPosition = { i: 0, j: 0 },
    public cost: number = 0
  ) {
    this.currentPath = new Map(currentPath);
    this.currentPath.set(serializePosition(lastPosition), true);
  }

  public hasVisitedPosition(position: GridPosition): boolean {
    return this.currentPath.has(serializePosition(position));
  }

  public hasOtherPathWithLowerCost(position: GridPosition): boolean {
    for (const otherPath of this.currentPaths) {
      if (otherPath === this) {
        continue;
      }

      if (otherPath.currentPath.has(serializePosition(position))) {
        return true;
      }
    }

    return false;
  }

  public putNextPath(nextPaths: Path[], position: GridPosition): void {
    if (this.hasVisitedPosition(position)) {
      return;
    }

    if (this.hasOtherPathWithLowerCost(position)) {
      return;
    }

    const cost = safeGridGet(this.grid, position.i, position.j);

    if (cost === undefined) {
      return;
    }

    const nextPath = new Path(
      this.grid,
      this.target,
      this.currentPath,
      this.currentPaths,
      position,
      this.cost + cost
    );

    nextPaths.push(nextPath);
  }

  public getNextPaths(): Path[] {
    const nextPaths: Path[] = [];

    this.putNextPath(nextPaths, {
      i: this.lastPosition.i + 1,
      j: this.lastPosition.j,
    });

    this.putNextPath(nextPaths, {
      i: this.lastPosition.i,
      j: this.lastPosition.j + 1,
    });

    this.putNextPath(nextPaths, {
      i: this.lastPosition.i,
      j: this.lastPosition.j - 1,
    });

    this.putNextPath(nextPaths, {
      i: this.lastPosition.i - 1,
      j: this.lastPosition.j,
    });

    return nextPaths;
  }
}

/**
 * Removes currentPath from the list of currentPaths and puts the nextPaths in
 * the position based on the cost, keeping the lowest cost in the leftmost
 */
function putExpandedBestPath(currentPaths: Path[]): void {
  const currentPath = currentPaths.splice(0, 1)[0];
  const nextPaths = currentPath.getNextPaths();

  for (const nextPath of nextPaths) {
    const index = binarySearchInsertionIndex(
      currentPaths,
      nextPath.cost,
      (el) => el.cost
    );

    currentPaths.splice(index, 0, nextPath);
  }
}

function getBestPathRecursive(
  currentPaths: Path[],
  target: GridPosition
): Path | undefined {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  while (currentPaths[0]) {
    if (
      currentPaths[0].lastPosition.i === target.i &&
      currentPaths[0].lastPosition.j === target.j
    ) {
      return currentPaths[0];
    }

    putExpandedBestPath(currentPaths);
  }

  return undefined;
}

function getLowestRiskPath(input: number[][]): number {
  const target: GridPosition = { i: input.length - 1, j: input[0].length - 1 };

  const initialPosition = { i: 0, j: 0 };
  const currentPaths: Path[] = [];
  const initialPath = new Path(
    input,
    target,
    new Map(),
    currentPaths,
    initialPosition,
    0
  );

  currentPaths.push(initialPath);

  const bestPath = getBestPathRecursive(currentPaths, target);

  if (!bestPath) {
    return -1;
  }

  return bestPath.cost;
}

const input = InputReader.getDayReader<number[]>("15").read((line) => {
  return line.split("").map((cell) => {
    return parseInt(cell, 10);
  });
});

console.log(getLowestRiskPath(input));
