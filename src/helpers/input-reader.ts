import fs from "fs";
import path from "path";

export class InputReader<T = string> {
  private data: string | null = null;

  private lines: string[] = [];

  private parsedLines: T[] = [];

  constructor(private readonly filePath: string) {}

  static getDayReader<T>(day: string, fileName = "input"): InputReader<T> {
    return new InputReader(
      path.join(__dirname, `../puzzles/day-${day.padStart(2, "0")}/${fileName}`)
    );
  }

  read(parser?: (value: string) => T): T[] {
    try {
      this.data = fs.readFileSync(this.filePath, "utf8");

      this.lines = this.data.split("\n");

      if (parser) {
        this.parsedLines = this.lines.map((l) => parser(l));
      } else {
        this.parsedLines = this.lines as unknown as T[];
      }
    } catch (err) {
      console.error(err);
    }

    return this.parsedLines;
  }
}
