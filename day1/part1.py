def solve(lines):
    # return lines
    uncorrected_digits = []
    for line in lines:
        digits = [x for x in line.strip() if x.isdigit()]
        uncorrected_digits.append(digits)
    corrected_nums = [ (digits[0] + digits[-1]) for digits in uncorrected_digits]
    return sum([int(x) for x in corrected_nums])

if __name__ == "__main__":
    with open("test_input.txt") as f:
        solution = solve([line for line in f])
        print(solution)


        
