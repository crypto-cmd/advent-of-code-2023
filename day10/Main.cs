using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class AOC
{
    static Dictionary<char, string> PIPES = new Dictionary<char, string>
    {
        {'L', "NE"},
        {'J', "NW"},
        {'7', "SW"},
        {'F', "SE"},
        {'|', "NS"},
        {'-', "EW"},
        {'S', "NSEW"},
    };

    static Dictionary<(int, int), (char pipe, bool visited)> grid = new Dictionary<(int, int), (char, bool)>();

    static void Main()
    {
        int i = 0;
        foreach (var line in File.ReadLines("day10/input.txt"))
        {
            var chars = line.ToCharArray();
            for (int j = 0; j < chars.Length; j++)
            {
                grid[(i, j)] = (chars[j], false);
            }
            i++;
        }
        var (path, farthestPoint) = Part1();
        Console.WriteLine($"Part 1: {farthestPoint}");
    }
    static (List<((int, int) position, (char pipe, bool visited) data)>, int) Part1()
    {
        var start = FindStart();
        var path = new List<((int, int) position, (char pipe, bool visited) data)>();
        FindPath(start, path);

        // Find the distance between the start and end
        int lengthOfLoop = path.Count;

        int farthestPoint = lengthOfLoop / 2;
        return (path, farthestPoint);
    }

    static ((int, int) position, (char pipe, bool visited) data) FindStart()
    {
        foreach (var kvp in grid)
        {
            if (kvp.Value.pipe == 'S')
            {
                return (kvp.Key, kvp.Value);
            }
        }
        throw new Exception("No start found");
    }

    static List<((int, int) position, (char pipe, bool visited) data)> FindNext(((int, int) position, (char pipe, bool visited) data) current)
    {
        var next = new List<((int, int) position, (char pipe, bool visited) data)>();
        var (row, col) = current.position;
        var (_, currentData) = current;

        foreach (var kvp in grid)
        {
            var (nextRow, nextCol) = kvp.Key;
            var nextData = kvp.Value;

            if (nextData.visited || nextData.pipe == '.')
                continue;

            if (nextRow == row + 1
                && nextCol == col
                && PIPES[nextData.pipe].Contains("N")
                && PIPES[currentData.pipe].Contains("S"))
            {
                next.Add((kvp.Key, nextData));
            }

            if (nextRow == row - 1
                && nextCol == col
                && PIPES[nextData.pipe].Contains("S")
                && PIPES[currentData.pipe].Contains("N"))
            {
                next.Add((kvp.Key, nextData));
            }

            if (nextRow == row
                && nextCol == col + 1
                && PIPES[nextData.pipe].Contains("W")
                && PIPES[currentData.pipe].Contains("E"))
            {
                next.Add((kvp.Key, nextData));
            }

            if (nextRow == row
                && nextCol == col - 1
                && PIPES[nextData.pipe].Contains("E")
                && PIPES[currentData.pipe].Contains("W"))
            {
                next.Add((kvp.Key, nextData));
            }
        }

        return next;
    }
    static void FindPath(((int, int) position, (char pipe, bool visited) data) current, List<((int, int) position, (char pipe, bool visited) data)> path)
    {
        var stack = new Stack<((int, int) position, (char pipe, bool visited) data)>();
        stack.Push(current);

        while (stack.Count > 0)
        {
            current = stack.Pop();
            path.Add(current);

            // Get the value from the dictionary, modify it, and put it back
            var currentData = grid[current.position];
            currentData.visited = true;
            grid[current.position] = currentData;

            var next = FindNext(current);

            foreach (var n in next)
            {
                stack.Push(n);
            }
        }
    }
}
