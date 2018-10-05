module Exercise.Patterns where
  
import Prelude
import Control.Monad.Eff.Console
import Control.Plus (empty)
import Data.List (List(..), filter, head, null, nubBy)
import Data.Array
import Data.Maybe
import Partial.Unsafe (unsafePartial)

import Exercise.AddressBook



-- Record Pattern matching

gcd :: Int -> Int -> Int
gcd n 0 = n
gcd 0 m = m
gcd n m = if n > m
            then gcd (n - m) m
            else gcd n (m - n)
            
gcdG :: Int -> Int -> Int
gcdG n 0 = n
gcdG 0 n = n
gcdG n m | n > m     = gcdG (n - m) m
         | otherwise = gcdG n (m - n)


type Addr = { street :: String, city :: String }

type Person = { name :: String, address :: Addr }

addr1= {street:"9th Cross, Kodihalli", city:"Bangalore"}
addr2 = {street:"4/470 D, Adjiyaman Nagar", city:"Krishnagiri"}

mags = {name:"Magizhan S",address:addr1}
rads = {name:"Radhika S",address:addr1}
selvan = {name:"Selvan A",address:addr2}

-- Note: This fuction can take only any record which has first and last fields as input
showPerson :: { first :: String, last :: String } -> String
showPerson { first: x, last: y } = y <> ", " <> x

-- Note: This fuction can take any record as input which has first and last fields plus others
-- This is row polymorphism
showPerson' { first: x, last: y } = y <> ", " <> x

livesInLA :: Person -> Boolean
livesInLA { address: { city: "Los Angeles" } } = true
livesInLA _ = false


stateKAExists :: Entry -> Boolean
stateKAExists  {address:{state:"KA"}} = true
stateKAExists _ = false

stateExists :: String -> Entry -> Boolean
stateExists _ {address:{state:stateString}} = true
stateExists _ _ = false


-- Naming the patterns
sortPair :: Array Int -> Array Int
sortPair arr@[x, y]
  | x <= y = arr
  | otherwise = [y, x]
  
sortPair arr = arr

sameCity :: Entry -> Entry -> Boolean
sameCity entry1 entry2
  | entry1.address.city == entry2.address.city = true
  | otherwise = false

sameCityGeneral {address:{city:city1}} {address:{city:city2}}
  | city1==city2 = true
  | otherwise = false

fromSingleton:: forall a. a -> Array a -> a
fromSingleton defaultVal arr
  | (length arr)==1 = fromMaybe defaultVal (arr !! 0)
  | otherwise = defaultVal

-- Using pattern matching of array literals
fromSingleton':: forall a. a -> Array a -> a
fromSingleton' defaultVal [a] = a
fromSingleton' defaultVal _ = defaultVal

-- Pattern Matching Failure
partialFunction :: Boolean -> Boolean
partialFunction = unsafePartial \true -> true



