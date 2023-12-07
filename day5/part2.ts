import { write } from "fs";
import { readFile, writeFile } from "fs/promises";

type Range = { a: number; b: number };
type RangeTransform = { sourceRange: Range; destRange: Range };

async function part2() {
  const data = await readFile("input.txt", "utf-8");
  const [seedsData, ...mapData] = data.split("\n\n") as string[];

  const seeds: number[] = seedsData
    .split(":")[1]
    .split(" ")
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map(Number);

  const seedRanges: Range[] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    const [a, range] = [seeds[i], seeds[i + 1]];
    seedRanges.push({ a: a, b: a + range - 1 });
  }

  const transforms = mapData.map((element, idx) => {
    const [name, _ranges] = element.split(":");
    const transform: RangeTransform[] = _ranges
      .split("\n")
      .filter((x) => x.trim().length > 0)
      .map((line) => {
        const [destRangea, sourceRangea, rangeLen] = line
          .split(" ")
          .map((x: string) => x.trim())
          .filter((x) => x.length > 0)
          .map(Number);
        return {
          sourceRange: {
            a: sourceRangea,
            b: sourceRangea + rangeLen - 1,
          },
          destRange: { a: destRangea, b: destRangea + rangeLen - 1 },
        };
      });
    return { name, transform };
  });

  let input = seedRanges;

  for (const key in transforms) {
    const value = transforms[key];
    const destRanges = {};

    for (const transform of value.transform) {
      input = input.reduce((running, currentSeedRange) => {
        const { after, before, inside } = findRangeRelationship(
          currentSeedRange,
          transform.sourceRange
        );
        // Store the inside away
        if (inside && !destRanges[rangeToString(inside)]) {
          const destOutput = runTransform(inside, transform);
          destRanges[rangeToString(inside)] = destOutput;
        }
        running.push(...([before, after].filter((x) => x != null) as Range[]));
        return running;
      }, [] as Range[]);
    }
    input.forEach((input) => (destRanges[rangeToString(input)] = input)); // unique it
    input = Object.values(destRanges);
  }
  console.log(Math.min(...input.map((input) => input.a)));
}

function rangeToString(r: Range | null) {
  return r ? `${r.a}<->${r.b}` : "null";
}
function runTransform(input: Range, transform: RangeTransform): Range {
  const shift = transform.destRange.a - transform.sourceRange.a;
  return {
    a: input.a + shift,
    b: input.b + shift,
  };
}

function findRangeRelationship(X: Range, sub: Range) {
  interface Result {
    before: Range | null;
    inside: Range | null;
    after: Range | null;
  }
  const before: Range = { a: X.a, b: Math.min(X.b, sub.a) };
  const inside: Range = { a: Math.max(X.a, sub.a), b: Math.min(X.b, sub.b) };
  const after: Range = { a: Math.max(X.a, sub.b), b: X.b };

  const result: Result = {
    before: null,
    inside: null,
    after: null,
  };

  if (before.a < before.b && before.a <= X.a && before.b <= X.b) {
    result.before = before;
  }

  if (inside.a < inside.b && inside.a >= X.a && inside.b <= X.b) {
    result.inside = inside;
  }

  if (after.a < after.b && after.a >= X.a && after.b <= X.b) {
    result.after = after;
  }

  return result;
}
part2();
