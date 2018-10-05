module Exercise.AddressBook where

import Prelude
import Control.Monad.Eff.Console
import Control.Plus (empty)
import Data.List (List(..), filter, head, null, nubBy)
import Data.Array
import Data.Maybe
import Partial.Unsafe (unsafePartial)


import Data.Maybe (Maybe)

type Address =
  { street :: String
  , city   :: String
  , state  :: String
  }

type Entry =
  { firstName :: String
  , lastName  :: String
  , address   :: Address
  }

type AddressBook = List Entry


showAddress :: Address -> String
showAddress addr = addr.street <> ", " <> addr.city <> ", " <> addr.state

showEntry :: Entry -> String
showEntry entry = entry.lastName <> ", " <> entry.firstName <> ": " <> showAddress entry.address

emptyBook :: AddressBook
emptyBook = empty

insertEntry :: Entry -> AddressBook -> AddressBook
insertEntry = Cons

findEntry :: String -> String -> AddressBook -> Maybe Entry
findEntry firstName lastName = head <<< filter filterEntry
  where
  filterEntry :: Entry -> Boolean
  filterEntry entry = entry.firstName == firstName && entry.lastName == lastName

findEntryFromAddress :: String -> String -> AddressBook -> Maybe Entry
findEntryFromAddress street city = head <<< filter filterEntry
  where
  filterEntry :: Entry -> Boolean
  filterEntry entry = entry.address.street == street && entry.address.city == city

findEntryExists :: String -> String -> AddressBook -> Boolean
findEntryExists firstName lastName = not null <<< filter filterEntry
  where
  filterEntry :: Entry -> Boolean
  filterEntry entry = entry.firstName == firstName && entry.lastName == lastName

  

removeDuplicates :: String -> String -> AddressBook -> AddressBook
removeDuplicates firstName lastName = nubBy findDuplicate
  where
  findDuplicate :: Entry -> Entry -> Boolean
  findDuplicate entry1 entry2 = entry1.firstName == entry2.firstName && entry1.lastName == entry2.lastName
