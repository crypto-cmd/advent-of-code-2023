import { readFile } from "fs/promises";
import { parseInput } from "./part1";

(async () => {
  const lines = (await readFile("./day2/input.txt")).toString().split("\n");
  let sum = 0;
  const colours = parseInput(lines);

  for (const gameId in colours) {
    const { red, green, blue } = colours[gameId];
    const power = red * blue * green
    sum += power;
  }

  console.log(sum);
})();
