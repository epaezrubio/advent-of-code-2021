import { InputReader } from "../../helpers/input-reader";

type SegmentLetters = "a" | "b" | "c" | "d" | "e" | "f" | "g";

interface DisplayReading {
  input: SegmentLetters[][];
  output: SegmentLetters[][];
}

enum SegmentsValues {
  t = 1,
  tr = 2,
  br = 4,
  b = 8,
  bl = 16,
  tl = 32,
  c = 64,
}

const numberSegments = [
  SegmentsValues.t +
    SegmentsValues.tr +
    SegmentsValues.br +
    SegmentsValues.b +
    SegmentsValues.bl +
    SegmentsValues.tl, // 0 (6 segments)
  SegmentsValues.tr + SegmentsValues.br, // 1 (2 segments)
  SegmentsValues.t +
    SegmentsValues.tr +
    SegmentsValues.b +
    SegmentsValues.bl +
    SegmentsValues.c, // 2 (5 segments)
  SegmentsValues.t +
    SegmentsValues.tr +
    SegmentsValues.br +
    SegmentsValues.b +
    SegmentsValues.c, // 3 (5 segments)
  SegmentsValues.tr + SegmentsValues.br + SegmentsValues.tl + SegmentsValues.c, // 4 (4 segments)
  SegmentsValues.t +
    SegmentsValues.br +
    SegmentsValues.b +
    SegmentsValues.tl +
    SegmentsValues.c, // 5 (5 segments)
  SegmentsValues.t +
    SegmentsValues.br +
    SegmentsValues.b +
    SegmentsValues.bl +
    SegmentsValues.tl +
    SegmentsValues.c, // 6 (6 segments)
  SegmentsValues.t + SegmentsValues.tr + SegmentsValues.br, // 7 (3 segments)
  SegmentsValues.t +
    SegmentsValues.tr +
    SegmentsValues.br +
    SegmentsValues.b +
    SegmentsValues.bl +
    SegmentsValues.tl +
    SegmentsValues.c, // 8 (7 segments)
  SegmentsValues.t +
    SegmentsValues.tr +
    SegmentsValues.br +
    SegmentsValues.b +
    SegmentsValues.tl +
    SegmentsValues.c, // 9 (6 segments)
];

const numberSegmentsMap = numberSegments.reduce<Record<number, number>>(
  (acc, cur, index) => {
    acc[cur] = index;

    return acc;
  },
  {}
);

const ALL_SEGMENTS_CANDIDATE = (1 << 7) - 1;

class DisplayValue {
  private readonly displaySegmentCandidates: Record<SegmentLetters, number> = {
    a: ALL_SEGMENTS_CANDIDATE,
    b: ALL_SEGMENTS_CANDIDATE,
    c: ALL_SEGMENTS_CANDIDATE,
    d: ALL_SEGMENTS_CANDIDATE,
    e: ALL_SEGMENTS_CANDIDATE,
    f: ALL_SEGMENTS_CANDIDATE,
    g: ALL_SEGMENTS_CANDIDATE,
  };

  private readonly digits: SegmentLetters[][];

  constructor(private readonly displayReading: DisplayReading) {
    this.digits = [...displayReading.input, ...displayReading.output];
  }

  public determineDigitSegments(): void {
    // determine first the easy digits
    for (const digit of this.digits) {
      if (digit.length === 2) {
        this.determineNumberSegments(digit, 1);
      } else if (digit.length === 3) {
        this.determineNumberSegments(digit, 7);
      } else if (digit.length === 4) {
        this.determineNumberSegments(digit, 4);
      }
    }

    // at this point we have discarded some possible segment values, and we are certain
    // about 't', now we can find '3': the only digit with 5 segments, and 't', 'tr',
    // and 'br' on
    const t = Object.entries(this.displaySegmentCandidates).filter((entry) => {
      return entry[1] === SegmentsValues.t;
    });

    const r = Object.entries(this.displaySegmentCandidates).filter((entry) => {
      return entry[1] & SegmentsValues.tr || entry[1] & SegmentsValues.br;
    });

    const digitThreeKnownBits = t[0][1] + r[0][1];

    for (const digit of this.digits) {
      if (digit.length !== 5) {
        continue;
      }

      let segmentCandidatesMatching = 0;

      for (const segment of digit) {
        if (this.displaySegmentCandidates[segment] & digitThreeKnownBits) {
          segmentCandidatesMatching++;
        }
      }

      if (segmentCandidatesMatching === 3) {
        this.determineNumberSegments(digit, 3);
        break;
      }
    }

    // we now know the segments for 3, which determines the values for the segments
    // 'b', 't', 'c', 'bl' and 'tl', still uncertain about 'tr' and 'br'. now we can
    // look for number 6, which is a 6 segment digit where 'bl' and 'c' is activated

    const digitSixKnownBits = SegmentsValues.bl + SegmentsValues.c;

    for (const digit of this.digits) {
      if (digit.length !== 6) {
        continue;
      }

      let segmentCandidatesMatching = 0;

      for (const segment of digit) {
        if (this.displaySegmentCandidates[segment] & digitSixKnownBits) {
          segmentCandidatesMatching++;
        }
      }

      if (segmentCandidatesMatching === 2) {
        // finding 6 masks out 'tr' and determines 'tr' and 'br', now we have all values
        this.determineNumberSegments(digit, 6);
        break;
      }
    }
  }

  public getOutputValue(): number {
    return this.displayReading.output
      .map((v) => {
        return this.getDigitValue(v);
      })
      .reduce((acc, cur, index, values) => {
        return acc + Math.pow(10, values.length - index - 1) * cur;
      }, 0);
  }

  private determineNumberSegments(
    digit: SegmentLetters[],
    number: number
  ): void {
    for (const segment in this.displaySegmentCandidates) {
      const segmentLetter = segment as SegmentLetters;
      const excludedSegments = numberSegments[number];

      if (digit.includes(segmentLetter)) {
        this.displaySegmentCandidates[segmentLetter] =
          this.displaySegmentCandidates[segmentLetter] & excludedSegments;
      } else {
        this.displaySegmentCandidates[segmentLetter] =
          this.displaySegmentCandidates[segmentLetter] & ~excludedSegments;
      }
    }
  }

  private getDigitValue(digit: SegmentLetters[]): number {
    const segmentsValue = digit.reduce((acc, cur) => {
      return acc + this.displaySegmentCandidates[cur];
    }, 0);

    return numberSegmentsMap[segmentsValue];
  }
}

function getOutputSum(displayReadings: DisplayReading[]): number {
  let outputSum = 0;

  for (const displayReading of displayReadings) {
    const displayValue = new DisplayValue(displayReading);

    displayValue.determineDigitSegments();

    outputSum += displayValue.getOutputValue();
  }

  return outputSum;
}

const input = InputReader.getDayReader<DisplayReading>("8").read((line) => {
  const lineChunks = line.split(" | ");

  return {
    input: lineChunks[0].split(" ").map((v) => v.split("") as SegmentLetters[]),
    output: lineChunks[1]
      .split(" ")
      .map((v) => v.split("") as SegmentLetters[]),
  };
});

console.log(getOutputSum(input));
