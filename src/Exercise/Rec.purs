module Exercise.Rec where

import Prelude

import Data.Array (null, filter)
import Data.Array.Partial (head, tail)

import Partial.Unsafe (unsafePartial)


fact :: Int -> Int
fact 0 = 1
fact n = n * fact (n - 1)


fib :: Int -> Int
fib 0 = 1
fib 1 = 1
fib n = fib (n - 1) + fib (n - 2)

isEven :: Int -> Boolean
isEven 0 = true
isEven 1 = false
isEven n = not isEven(n-1)


length :: forall a. Array a -> Int
length arr =
  if null arr
    then 0
    else 1 + length (unsafePartial tail arr)



countOfEven::forall a. Array Int -> Int
countOfEven arr =
  if null arr
  then 0
  else if isEven (unsafePartial head arr) then (1 + countOfEven(unsafePartial tail arr)) else countOfEven(unsafePartial tail arr)


square::forall a. Int -> Int
square a = a*a

filterNegative::forall a. Array Int -> Array Int
filterNegative= filter (\n -> n >=0)
infixr 0 filterNegative as <$?>
  

