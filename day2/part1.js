import { readFile } from "fs/promises";

export const parseInput = (lines) => {
  const colours = {};
  lines.forEach((line) => {
    const [gamePhrase, data] = line.split(":");
    const gameId = Number(gamePhrase.split(" ")[1]);
    data.split(";").forEach((set) => {
      set
        .split(",")
        .map((grab) => grab.split(" ").filter((x) => x.length))
        .forEach(([num, colour]) => {
          colours[gameId] ??= {};
          colours[gameId][colour] = Math.max(
            +num,
            colours[gameId][colour] ?? 0
          );
        });
    });
  });
  return colours;
};

  (async () => {
    const lines = (await readFile("./day2/input.txt")).toString().split("\n");
    let sum = 0;
    const colours = parseInput(lines);

    for (const gameId in colours) {
      const { red, green, blue } = colours[gameId];
      const isRedPossible = 12 >= (red ?? 0);
      const isGreenPossible = 13 >= (green ?? 0);
      const isBluePossible = 14 >= (blue ?? 0);
      const isPossible = isRedPossible && isGreenPossible && isBluePossible;
      if (isPossible) {
        sum += Number(gameId);
      }
    }

    console.log(sum);
  })();

