package day6;

import java.nio.file.Files;
import java.util.ArrayList;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.io.File;
import java.io.IOException;
import java.math.BigInteger;

/**
 * part1
 */
public class part2 {

    class Race {
        int time;
        int dist;
    }

    public static void main(String[] args) throws IOException {
        String[] r = Files.lines(new File("./day6/input.txt").toPath())
                .map(s -> s.trim().split(":")[1])
                .toArray(String[]::new);
        var time = new BigInteger(Stream.of(r[0].split(" "))
                .map(s -> s.trim())
                .filter(s -> !s.isEmpty())
                .reduce("", (a, b) -> a + b));
        var dist = new BigInteger(Stream.of(r[1].split(" "))
                .map(s -> s.trim())
                .filter(s -> !s.isEmpty())
                .reduce("", (a, b) -> a + b));

        double[] roots = solveQuadratic(BigInteger.valueOf(1), time, dist);
        System.out.println(roots[0] + ", " + roots[1]);
        var start = (int)(roots[0] + 1);
        var end = (int)(roots[1] < time.doubleValue() ? roots[1] : time.doubleValue());
        int way = Math.abs((int) (end - start + 1));
        System.out.println(way);

        // System.out.println(ways);
        // System.out.println(r[0]);
    }

    public static double[] solveQuadratic(BigInteger a, BigInteger b, BigInteger c) {

        double[] roots = new double[2];
        BigInteger four = BigInteger.valueOf(4);
        BigInteger discriminant;

        // Calculate discriminant
        BigInteger bb = b.multiply(b);
        BigInteger fourac = four.multiply(a).multiply(c);
        if (bb.subtract(fourac).bitLength() > 62) { // Check if discriminant is too large
            System.out.println("The discriminant is too large to calculate.");
            return null;
        } else {
            discriminant = bb.subtract(fourac);
        }

        if (discriminant.compareTo(BigInteger.ZERO) >= 0) {
            double sqrtDiscriminant = Math.sqrt(discriminant.doubleValue());
            roots[0] = (b.negate().doubleValue() + sqrtDiscriminant) / (2 * a.doubleValue());
            roots[1] = (b.negate().doubleValue() - sqrtDiscriminant) / (2 * a.doubleValue());
        } else {
            System.out.println("The equation has no real roots.");
        }

        return roots;
    }
}