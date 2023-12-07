use std::collections::HashSet;
use std::iter::FromIterator;
use std::convert::TryInto;
fn main() {
    part1();
    part2();
}
fn part2(){
    let lines:Vec<String> = std::fs::read_to_string("input.txt")
        .unwrap()
        .lines()
        .map(String::from)
        .collect();
    let     n                     = lines.capacity();
    let mut cards_total: Vec<i32> = vec![0; n ];
    let mut game_number:usize     = 1;
    for line in lines {
       let card_numbers = &line
            .split(":")
            .nth(1)
            .unwrap()
            .split("|")
            .map(String::from)
            .collect::<Vec<String>>();
        let winning_numbers: HashSet<i32> = HashSet::from_iter(card_numbers[0]
            .split_whitespace()
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| s.parse::<i32>().unwrap())
            .collect::<Vec<i32>>());
        let numbers_that_won:i32 =card_numbers[1]
            .split_whitespace()
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| s.parse::<i32>().unwrap())
            .filter(|num| winning_numbers.contains(num))
            .count()
            .try_into()
            .unwrap();
        let actual_idx = game_number - 1;
        let  curr_num_of_cards =  cards_total[actual_idx] + 1;
        cards_total[actual_idx] += 1;
        for idx in (game_number+1)..=(game_number + numbers_that_won as usize) { cards_total[idx-1] += 1 *curr_num_of_cards;}
        game_number = game_number + 1;
    }
    // println!("{:?}", cards_total);
    let mut total = 0;
    for i in &cards_total {
        total += i
    }
    println!("{}", total)
}

fn part1(){
    let lines:Vec<String> = std::fs::read_to_string("input.txt")
        .unwrap()
        .lines()
        .map(String::from)
        .collect();

    let mut total:i32 = 0;
    
    for line in lines {
       let card_numbers = &line
            .split(":")
            .nth(1)
            .unwrap()
            .split("|")
            .map(String::from)
            .collect::<Vec<String>>();
        let winning_numbers: HashSet<i32> = HashSet::from_iter(card_numbers[0]
            .split_whitespace()
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| s.parse::<i32>().unwrap())
            .collect::<Vec<i32>>());
        let numbers_that_won =card_numbers[1]
            .split_whitespace()
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| s.parse::<i32>().unwrap())
            .filter(|num| winning_numbers.contains(num))
            .count();
        let score = (1 << numbers_that_won) / 2; // 2 ^ numbers_that_won
        total = total + score
    }
    println!("{}", total)
}
