package main

import (
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
)

func readEntireNum(line string, idx int) (num string, newIdx int) {
	num = ""
	newIdx = idx
	for newIdx < len(line) {
		c := string(line[newIdx])
		_, err := strconv.ParseInt(c, 10, 64)
		if err != nil {
			return
		}
		newIdx++
		num = num + c
		// fmt.Println(newIdx)
	}

	return
}
func isSymbol(c string) bool {
	_, err := strconv.ParseInt(c, 10, 64)

	if err == nil {
		return false
	}
	return c != "."

}
func isPossibleGear(c string) bool {
	return c == "*"
}
func isPartNumber(lines []string, row int, startCol int, endCol int, numInQuestion string) bool {
	startRow := int(math.Max(0, float64(row-1)))
	endRow := int(math.Min(float64(len(lines)-1), float64(row+1)))

	newStartCol := int(math.Max(float64(startCol-1), 0))
	newEndCol := int(math.Min(float64(endCol), float64(len(lines[row])-1)))

	for i := startRow; i <= endRow; i++ {
		for j := newStartCol; j <= newEndCol; j++ {
			if isSymbol(string(lines[i][j])) {
				if isPossibleGear(string(lines[i][j])) {
					key := i*len(lines) + j
					currentValue := possibleGear[key]
					numInQuestionAsInt, err := strconv.ParseInt(numInQuestion, 10, 64)
					if err != nil {
						panic(err)
					}
					if currentValue == 0 {
						possibleGear[key] = int(numInQuestionAsInt)
					} else {
						possibleGear[key] = possibleGear[key] * int(numInQuestionAsInt)
						isGear = append(isGear, key)
					}
				}
				return true
			}
		}
	}
	return false
}

var possibleGear map[int]int
var isGear []int

func main() {

	data, err := os.ReadFile("./day3/input.txt")
	if err != nil {
		panic(err)
	}
	lines := strings.Split(string(data), "\n")

	possibleGear = make(map[int]int)
	isGear = make([]int, 0, len(lines)*len(lines[0]))

	sum := 0
	for i := 0; i < len(lines); i++ {
		line := lines[i]

		for j := 0; j < len(line); j++ {
			c := string(line[j])
			if c == "." {
				continue
			}
			_, err := strconv.ParseInt(c, 10, 64)
			if err != nil {
				continue
			}

			num, newJ := readEntireNum(line, j)
			isPartNumber(lines, i, j, newJ, num)

		
			j = newJ - 1 // Go to end of string
		}
	}


	for _, key := range(isGear) {
		sum += possibleGear[key]
	}
	fmt.Println(sum)


}
