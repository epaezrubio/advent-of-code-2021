import { InputReader } from "../../helpers/input-reader";

interface Command {
  type: "down" | "forward" | "up";
  distance: number;
}

function getFinalPositionMultiplication(input: Command[]): number {
  let xPosition = 0;
  let yPosition = 0;

  for (const command of input) {
    switch (command.type) {
      case "down":
        yPosition += command.distance;
        break;
      case "up":
        yPosition -= command.distance;
        break;
      case "forward":
        xPosition += command.distance;
        break;
    }
  }

  return xPosition * yPosition;
}

const input = InputReader.getDayReader<Command>("2").read((value) => {
  const parsedValue = value.split(" ");

  const type = parsedValue[0] as Command["type"];
  const distance = parseInt(parsedValue[1], 10);

  return {
    type,
    distance,
  };
});

console.log(getFinalPositionMultiplication(input));
