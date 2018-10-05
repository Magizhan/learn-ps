module Exercise.RecordMods  where
import Data.Record (insert)
import Data.Symbol (SProxy(..))
import Prelude
import Control.Monad.Eff (Eff)

newtype Person = Person {firstName :: String, lastName :: String, address :: Addr}

newtype Addr = Addr {city :: String, state :: String, country :: String}

firstName = SProxy ∷ SProxy "firstName"
lastName = SProxy ∷ SProxy "lastName"
address = SProxy ∷ SProxy "address"
state = SProxy ∷ SProxy "state"
city = SProxy ∷ SProxy "city"
country = SProxy ∷ SProxy "country"

fillFirstAndLastName :: ∀ t22 t26. t22 → t26 → { lastName ∷ t26 , firstName ∷ t22 }
fillFirstAndLastName fn ln = (insert firstName fn >>> insert lastName ln) {}

--fillState :: ∀ t5. t5 → { state ∷ t5 }
fillState s = (insert state s) {}

addCityAndCountry ∷ ∀ t52 t56. t52 → t56 → { state ∷ String } → { country ∷ t56 , city ∷ t52 , state ∷ String }
addCityAndCountry ci co = (insert city ci >>> insert country co)


addAddress ∷ Addr → {firstName ∷ String, lastName ∷ String} → {firstName ∷ String, lastName ∷ String, address ∷ Addr}
addAddress a = (insert address a)


getAString ∷ Eff _ String
getAString = pure "foo"

showAddr :: Addr -> String
showAddr (Addr addr) = addr.country <> ", " <> addr.city <> ", " <> addr.state

