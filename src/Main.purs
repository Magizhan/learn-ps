module Main where

import Control.Monad.Eff.Console
import Prelude
import Ch1
import Exercise.AddressBook
import Exercise.Rec
import Exercise.Picture 
import Exercise.DataAccess
import Exercise.Patterns as P
import Exercise.RecordMods
import Control.Monad.Eff (Eff)
import Data.Record (insert)


infixr 5 insert as :=
 
main = do
	log "Hello, World!"
	chapter1

dataAccess = do
	s ← getAString
	ci ← getAString
	co ← getAString
	--state <- pure $ (state := "KA") {}
	--let cityAndCountry = (city := "BLR") >>>  (country := "IND")
	--let addr = (Addr $ addCityAndCountry ci co $ fillState s) ∷ Addr
	--let addr = (Addr $ cityAndCountry $ state) ∷ Addr
	--let addr2 = (Addr $  (insert city "BLR" >>> insert country "IND") $ state) ∷ Addr

	let addr3 = Addr <<< (city := "BLR") <<< (country := "IND") <<< (state := "KA") $ {}
					 
	
	fn ← getAString
	ln ← getAString
	--person <-  pure $ Person $ addAddress addr $ fillFirstAndLastName fn ln
	person <- pure $ Person $ addAddress addr3 $ fillFirstAndLastName fn ln
	--logShow (showAddr addr)
	--logShow (showAddr addr2)
	logShow (showAddr addr3)
	--test
	pure unit
	--test



address = { street: "123 Fake St.", city: "Faketown", state: "CA" }
address2 = { street: "Juspay Technologies, Koramangala", city: "Bangalore", state: "KA" }
address3 = { street: "Juspay Technologies, Adyar", city: "Chennai", state: "TN" }
entry = { firstName: "John", lastName: "Smith", address: address }
entry2 = { firstName: "Vimal", lastName: "Kumar", address: address2 }
entry3 = { firstName: "Vimal", lastName: "Kumar", address: address3 }

printFindEntry firstName lastName book = logShow(map showEntry(findEntry firstName lastName book))
printFindEntryFromAddress street city book = logShow(map showEntry(findEntryFromAddress street city book))

book1 = insertEntry entry emptyBook
book2 = insertEntry entry2 book1
book3 = insertEntry entry3 book2


chapter1 = do
	log "Diagonal of a right triangle with size 3 and 4 is"
	logShow (diagonal 3.0 4.0)
	log "Area of a circle with radius 3 is"
	logShow (circleArea 3.0)
	
test = do
	log "Entry in the address book book is"
	logShow (showEntry entry)
	log "Find John Smith in emptyBook"
	printFindEntry "John" "Smith" emptyBook
	log "Find Vimal Kumar in book2"
	printFindEntry "Vimal" "Kumar" book2
	log "Find based on Address in book2"
	printFindEntryFromAddress "Juspay Technologies, Koramangala" "Bangalore" book2
	log "Find if Vimal Kumar exist in book2"
	logShow (findEntryExists "Vimal" "Kumar" book2)
	log "Find Vimal Kumar in book3"
	printFindEntry "Vimal" "Kumar" book3
	log "Find from address after removing duplicates entries with name Vimal Kumar in book3"
	printFindEntryFromAddress "Juspay Technologies, Koramangala" "Bangalore" (removeDuplicates "Vimal" "Kumar" book3)
	log "Find from address after removing duplicates entries with name Vimal Kumar in book3"
	printFindEntryFromAddress "Juspay Technologies, Adyar" "Chennai" (removeDuplicates "Vimal" "Kumar" book3)
	log "Factorial of 5"
	logShow (fact 5)
	log "Fibonacci of 5"
	logShow (fib 3)
	log "Is 5 Even?"
	logShow (isEven 5)
	log "Is 5222 Even?"
	logShow (isEven 5222)
	log "length of the array [1,2,3,4,5,6,7,8,9] is "
	logShow (length [1,2,3,4,5,6,7,8,9])
	log "Count of Even in array [1,2,3,4,5,6,7,8,9,10] is "
	logShow (countOfEven [1,2,3,4,5,6,7,8,9,10])
	log "Square of elements in [1,2,3,4,5,6,7,8,9,10] is "
	logShow (square <$> [1,2,3,4,5,6,7,8,9,10])
	log "Positive elements in [-1,-2,-3,-4,5,6,7,8,9,10] is "
	logShow (filterNegative [-1,-2,-3,-4,5,6,7,8,9,10])
	log "Positive elements in [-1,-2,-3,-4,5,6,7,8,9,10] found using infix operator <$?> is "
	logShow ((<$?>) [-1,-2,-3,-4,5,6,7,8,9,10])
	-- Learning Chp5: Algebric Data Type and Pattern Matching. File Picture
	log "The GCD of 5 and 0 is "
	logShow (P.gcd 5 0)
	
	log "The GCD of 0 and 10 is "
	logShow (P.gcd 0 10)

	log "The GCD of 5 and 10 is "
	logShow (P.gcd 5 10)
	
	log "The GCD of 5 and 35 is "
	logShow (P.gcd 5 35)

	log "Usage of Guard: The GCD of 5 and 10 is "
	logShow (P.gcdG 5 10)

	-- Pattern Matching Records
	log "Does KA exist in the entry entry2 "
	logShow (P.stateKAExists entry2)
	
	-- Learning Type Constructors and Lens
	logShow (showNewAddress address1)
	
	
