from part1 import solve as part1_solve

digits_to_consider = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
}
digit_starting_letters = {
    digit_name[0:2]: digit_name for digit_name in digits_to_consider}


def convert_stringed_digits(line: str):
    idx = 0
    new_line_data = []
    while idx < len(line):
        current_starting_prefix = line[idx:idx+2]
        possible_digit_name = digit_starting_letters.get(current_starting_prefix)
        len_to_look = len(possible_digit_name or "")

        if (possible_digit_name is None or not possible_digit_name == line[idx: idx + len_to_look]):
            letter = line[idx]
            if(letter.isdigit()):
                new_line_data.append(letter)
            idx += 1
            continue
        digit = digits_to_consider.get(possible_digit_name)
        new_line_data.append(digit)
        idx += 1 
            
    new_line = "".join(new_line_data)
    return new_line


def solve(lines: list[str]):
    converted_lines = [convert_stringed_digits(line) for line in lines]
    return part1_solve(converted_lines)


if __name__ == "__main__":
    with open("input.txt") as f:
        solution = solve([line for line in f])
        print(solution)
