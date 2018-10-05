module Exercise.Qr where
  
import Prelude
import Data.String.Base64
import Data.Either
import Unsafe.Coerce (unsafeCoerce)
import Data.String
import Data.TextEncoder
import Data.TextDecoder


decodeQrData :: String -> String
decodeQrData qrData = "hi"

-- do
--     let decodedData = atob qrData
--     let finalQrData = case decodedData of
--                          Left err -> unsafeCoerce unit --handle error case - invalid QR data
--                          Right val -> trim val 
--     finalQrData