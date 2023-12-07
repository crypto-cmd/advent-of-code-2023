package day6;

import java.nio.file.Files;
import java.util.ArrayList;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.io.File;
import java.io.IOException;

/**
 * part1
 */
public class part1 {

    class Race {
        int time;
        int dist;
    }

    public static void main(String[] args) throws IOException {
        String[] r = Files.lines(new File("./day6/input.txt").toPath())
                .map(s -> s.trim().split(":")[1])
                .toArray(String[]::new);
        Integer[] times = Stream.of(r[0].split(" "))
                .map(s -> s.trim())
                .filter(s -> !s.isEmpty())
                .map(s -> Integer.parseInt(s))
                .toArray(Integer[]::new);
        Integer[] dists = Stream.of(r[1].split(" "))
                .map(s -> s.trim())
                .filter(s -> !s.isEmpty())
                .map(s -> Integer.parseInt(s))
                .toArray(Integer[]::new);

        int ways = 1;
        for (int i = 0; i < times.length; i++) {
            var time = times[i];
            var dist = dists[i];

            int[] roots = solveQuadratic(time, dist);
            System.out.println(roots[0] + ", " + roots[1]);
            var start = roots[0];
            var end = Math.min(roots[1], time);
            var way=(end - start + 1);
            System.out.println(way);
            ways *= way;
        }
        System.out.println(ways);
        // System.out.println(r[0]);
    }

    static int[] solveQuadratic(int total, int c) {
        // dist(t): speed(t) * ( total - t) -> -(total)*t^2 + t
        // find x where dist(x) = total
        int a = 1;
        int b = -total;
        // int c = -fakeC;

        int[] roots = new int[2];
        var alpha = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
        var beta = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);

        System.out.println("For equation " + a + "x^2 + " + b + "x + " + c + " = 0, roots are " + alpha + ", "
                + beta + ".");
        roots[1] = (int) (alpha - 0.0000001); // We need to subtract a small value to get the correct integer part.
        roots[0] = (int) (beta + 1);
        return roots;

    }
}