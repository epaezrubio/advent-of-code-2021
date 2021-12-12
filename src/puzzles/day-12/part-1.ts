import { InputReader } from "../../helpers/input-reader";

interface GraphConnection {
  from: string;
  to: string;
}

class Cave {
  public readonly connections: Cave[] = [];

  constructor(public readonly name: string, public readonly small: boolean) {}
}

class CaveGraph {
  private readonly cavesMap: Map<Cave["name"], Cave> = new Map();

  private readonly startCave: Cave;

  private readonly endCave: Cave;

  constructor(private readonly unparsedConnections: GraphConnection[]) {
    // pre instantiate start and end
    this.startCave = this.getCave("start");
    this.endCave = this.getCave("end");

    // create graph nodes
    for (const connection of this.unparsedConnections) {
      const from = this.getCave(connection.from);
      const to = this.getCave(connection.to);

      from.connections.push(to);
      to.connections.push(from);
    }
  }

  public getAllRoutes(
    source: Cave = this.startCave,
    visitedCaves: Cave[] = []
  ): Cave[][] {
    // small caves cannot be visited twice
    if (source.small && visitedCaves.includes(source)) {
      return [];
    }

    if (source.name === "end") {
      return [[...visitedCaves, source]];
    }

    const routes: Cave[][] = [];

    for (const connection of source.connections) {
      const newVisitedCaves = visitedCaves.concat(source);

      routes.push(...this.getAllRoutes(connection, newVisitedCaves));
    }

    return routes;
  }

  private getCave(name: string): Cave {
    const indexedCave = this.cavesMap.get(name);

    if (indexedCave) {
      return indexedCave;
    }

    const newCave = this.createCave(name);

    this.cavesMap.set(newCave.name, newCave);

    return newCave;
  }

  private createCave(name: string): Cave {
    const isSmall = name[0].toLowerCase() === name[0];

    return new Cave(name, isSmall);
  }
}

function getUniqueRoutesCount(graphConnections: GraphConnection[]): number {
  const graph = new CaveGraph(graphConnections);
  const routes = graph.getAllRoutes();

  return routes.length;
}

const input = InputReader.getDayReader<GraphConnection>("12").read((line) => {
  const [from, to] = line.split("-");

  return { from, to };
});

console.log(getUniqueRoutesCount(input));
