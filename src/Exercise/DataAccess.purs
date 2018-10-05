module Exercise.DataAccess where

import Control.Monad.Eff.Console
import Math (sqrt, pi)
import Prelude
import Exercise.AddressBook
import Data.Newtype
import Data.Lens (Lens', lens, (^.))
import Data.Newtype (class Newtype, unwrap, wrap)
import Data.Foreign.NullOrUndefined (NullOrUndefined(..), unNullOrUndefined)
import Data.Maybe (Maybe(Nothing, Just), maybe, fromMaybe, fromJust)
import Partial.Unsafe (unsafePartial)


newtype Address1 = Add 
  { street :: String
  , city   :: String
  , state  :: String
  }

newtype AddressEntry = AddressEntry
  { firstName :: String
  , lastName  :: String
  , address   :: Address1
  }

_street :: forall a b c. Newtype a {street :: c | b} => Lens' a c
_street = lens (unwrap >>> _.street) (\oldRec newVal -> wrap ((unwrap oldRec) {street = newVal}))

_city :: forall a b c. Newtype a {city :: c | b} => Lens' a c
_city = lens (unwrap >>> _.city) (\oldRec newVal -> wrap ((unwrap oldRec) {city = newVal}))

_state :: forall a b c. Newtype a {state :: c | b} => Lens' a c
_state = lens (unwrap >>> _.state) (\oldRec newVal -> wrap ((unwrap oldRec) {state = newVal}))

address1::Address1
address1 = Add { street: "New St", city: "New Town", state: "KA" }


address2 =  { street: "New St", city: "New Town", state: "KA" }

entry1=AddressEntry { firstName : "Magizhan"
  , lastName  : "Selvan"
  , address   : address1
  }

-- newtype Account = Account
--   { id :: String
--   , accountNumber :: NullOrUndefined String
--   , maskedAccountNumber :: String
--   , ifsc :: String
--   , mmid :: NullOrUndefined String
--   , uidnum :: NullOrUndefined String
--   , partyId :: NullOrUndefined String
--   , status :: NullOrUndefined String
--   , mpinSet :: Boolean
--   , aadharEnabled :: Boolean
--   , type :: String
--   , name ::  String
--   , mpinLength :: String
--   , mpinType :: NullOrUndefined String
--   , bankCode ::  String
--   , bankName ::  String
--   , "CustomerId" :: String
--   , accountHash :: String
--   , credsAllowed :: NullOrUndefined String
--   , default :: Boolean
--   , createdAt :: NullOrUndefined String
--   , updatedAt :: NullOrUndefined String
--   , cardInfo :: NullOrUndefined String
--   , isMerchant :: NullOrUndefined Boolean
--   , info :: NullOrUndefined MerchantInfo
--   , isVisible :: NullOrUndefined Boolean
--   }

 
--  newtype VPA = VPA
--   { id :: String
--   , vpa :: String
--   , normalizedVPA :: NullOrUndefined String
--   , status :: VPASTATUS
--   , "CustomerId" :: NullOrUndefined String
--   , createdAt :: NullOrUndefined String
--   , updatedAt :: NullOrUndefined String
--   }

-- data VPASTATUS = ENABLED | DISABLED


-- derive instance genericVPA :: Generic VPA _
-- derive instance newtypeVPA :: Newtype VPA _
-- instance decodeVPA :: Decode VPA where decode = defaultDecode
-- instance encodeVPA :: Encode VPA where encode = defaultEncode

-- showNewAddress $ set _street "Old St" address1
-- address1 # _street .~ "New Street"
  
--Note: (Add addr) passed in the argument unwrapped the record from the type constructor
showNewAddress :: Address1 -> String
showNewAddress (Add addr) = addr.street <> ", " <> addr.city <> ", " <> addr.state

showNewAddress1 :: Address1 -> String
showNewAddress1 (addr) = addr^._street <> ", " <> addr^._city <> ", " <> addr^._state

derive instance newtypeAddress1 :: Newtype Address1 _
instance showAddress1 :: Show Address1 where
  show = showNewAddress


a::Maybe Int
a=Just 1
--a=Nothing
b::Maybe Int
b=Nothing

c::Maybe Int
c= Just 2
-- Map on Maybe
inc x = x+1
y = inc <$> a
z = inc <$> b

addM x y = x+y

--Output
--1. apply
-- > addM<$> a<*>b
-- Nothing

-- > addM<$> a<*>c
-- -- (Just 3)
-- > lift2 add a c
-- (Just 3)

-- Apply Second
-- > a*>c
-- (Just 2)


-- Apply First
-- > a<*c
-- (Just 1)

--pure is used to combine a Maybe and non Maybe value
-- > addM<$> a<*>pure 3
-- (Just 4)

-- Alt : Returns the first Just
-- > a <|> c <|> b
-- (Just 1)

-- > c <|> a <|> b
-- (Just 2)

d :: NullOrUndefined Int
d = NullOrUndefined $ Just 1

e :: NullOrUndefined Int
e = NullOrUndefined Nothing

f:: NullOrUndefined Boolean
f = NullOrUndefined $ Just false 

getOptionalData :: forall a. a -> NullOrUndefined a -> a 
getOptionalData def nullableVal = fromMaybe def $ unNullOrUndefined nullableVal

getMandatoryData :: forall a. NullOrUndefined a -> a 
getMandatoryData nullableVal = unsafePartial $ fromJust $ unNullOrUndefined nullableVal

setToOptional :: forall a. a -> NullOrUndefined a
setToOptional a = NullOrUndefined $ Just a

setMaybeToOptional :: forall a. Maybe a -> NullOrUndefined a
setMaybeToOptional (Just a) = NullOrUndefined $ Just a
setMaybeToOptional Nothing = NullOrUndefined Nothing

setNothing = NullOrUndefined Nothing
