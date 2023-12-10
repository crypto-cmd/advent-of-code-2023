#!/bin/bash

solve() {
    local nums=("$@")
    
    if [ $(printf "%s\n" "${nums[@]}" | sort -u | wc -l) -eq 1 ] && [ "${nums[0]}" -eq 0 ]; then
        echo 0
        return
    fi
    
    local last_num=${nums[-1]}
    local diff=()
    
    for ((i = 0; i < ${#nums[@]} - 1; i++)); do
        diff+=( $((nums[i+1] - nums[i])) )
    done
    
    local x=$((last_num + $(solve "${diff[@]}")))
    echo $x
}

_sum=0

while IFS= read -r line || [ -n "$line" ]; do
    nums=($line)
    _sum=$(( _sum + $(solve "${nums[@]}") ))
done < "day9/input.txt"

echo $_sum
