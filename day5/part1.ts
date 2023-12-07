import { readFile } from "fs/promises";
async function part1() {
  const data = await readFile("input.txt", "utf-8");
  const [seedsData, ...mapData] = data.split("\n\n") as string[];

  const seeds: Number[] = seedsData
    .split(":")[1]
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map(Number);

  const map = {};
  mapData.forEach((element, idx) => {
    const [name, _ranges] = element.split(":");
    const rangeFns = _ranges
      .split("\n")
      .map((line) => {
        const [destRangeStart, sourceRangeStart, rangeLen] = line
          .split(" ")
          .map((x: string) => x.trim())
          .filter((x) => x.length > 0)
          .map(Number);
        return { destRangeStart, sourceRangeStart, rangeLen };
      })
      .map(({ destRangeStart, rangeLen, sourceRangeStart }) => {
        return (x: number) => {
          // Takes number x as a source and transforms into the expected destination
          const isWithinSourceRange =
            x >= sourceRangeStart && x <= sourceRangeStart + rangeLen;
          if (!isWithinSourceRange) return null;
          const dist = x - sourceRangeStart;
          return destRangeStart + dist;
        };
      });

    map[name] = (x: number) => {
      let dest: number | null = null;
      for (const fn of rangeFns) {
        dest = fn(x);
        if (dest != null) return dest;
      }
      return x;
    };
  });

  const dest = seeds.map( (seed) => {
    // console.log("Seed #", seed)
    // let s = "" + seed;
    let cur = seed;
    for (const key in map) {
      cur = map[key](cur);
    //   s += `-> ${cur}`
    }
    // console.log(s)
    return cur as number;
  });
  console.log(Math.min(...dest))
}
await part1();
