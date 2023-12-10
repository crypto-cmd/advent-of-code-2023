import Data.List (group, groupBy, maximumBy, sort, sortBy, intercalate)
import Data.Set (fromList)
import Data.Ord (comparing)
import qualified Data.Map as Map

data Card = Card
  { label :: String,
    bid :: Integer,
    kind :: Float
  }
  deriving (Show)

letterize = Prelude.map (: [])

index n (x : xs)
  | n == 0 = x
  | otherwise = index (n - 1) xs

createCard :: [[Char]] -> Card
createCard [label, bid] =
  let 
      unjokerizedLabel = unjokerize label
      lst = sortBy (\(_, a) (_, b) -> compare b a) counted_letters
      counted_letters = map (\x -> (head x, length x)) . group . sort $ unjokerizedLabel
      letters = letterize label
      letter_set = fromList letters
      theoryKind d
        | snd (index 0 d) == 5 = 5 -- Five of a kind
        | snd (index 0 d) == 4 = 4 -- Four of a kind
        | snd (index 0 d) == 3 && snd (index 1 d) == 2 = 3.5 -- Full house
        | snd (index 0 d) == 3 = 3 -- Three of a Kind
        | snd (index 0 d) == 2 && snd (index 1 d) == 2 = 2 -- Two pairs
        | snd (index 0 d) == 2 = 1 -- One Pair
        | otherwise = 0 -- High card
      cardValue (l : ls) count
        | null ls = 0
        | otherwise = (cardLetterValue l*(10^(5-count))) + cardValue ls (count+1)
   in Card
        { label = label,
          bid = read bid,
          kind = theoryKind lst
        }
countInstances :: String -> Map.Map Char Int
countInstances = Map.fromList . map (\x -> (head x, length x)) . group . sort

unjokerize label = 
    let 
        jokerLessLable = filter (\l -> l /= 'J') label
        instances = countInstances jokerLessLable
        maxLetter = if Map.null instances then 'J'
                    else fst $ maximumBy (comparing snd) $ Map.toList instances
    in
        map (\c -> if c == 'J' then maxLetter else c) label


cardLetterValue c
        | c == 'T' = 10
        | c == 'J' = 1 -- jokers not jack
        | c == 'Q' = 12
        | c == 'K' = 13
        | c == 'A' = 14
        | otherwise = read [c] :: Int

sortFn :: Card -> Card -> Ordering
sortFn a b
  | kind a == kind b = sortLabel (label a) (label b)
  | otherwise = compare (kind b) (kind a)

sortLabel (a:as) (b:bs)
  | a == b = sortLabel as bs
  | otherwise = compare (cardLetterValue b) (cardLetterValue a)

main :: IO ()
main = do
  file_contents <- readFile "./day7/input.txt"
  let file_lines = lines file_contents
  let cards = map (createCard . words) file_lines
  let sorted = sortBy (flip sortFn) cards

  let winnings = zipWith (\rank a -> (rank + 1) * bid a) [0 ..] sorted

  print (sum winnings)