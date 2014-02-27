{-# LANGUAGE OverloadedStrings #-}


import qualified System.Directory as SD
import System.Console.ArgParser
import qualified Web.Scotty as SC
import Network.Wai.Middleware.Static
import qualified Data.Text.Lazy as T
import Control.Monad.IO.Class (liftIO)
import OrgMode

main :: IO ()
main = do
  parser <- mkApp cmdParser
  runApp parser $ \(Cmd root port) -> do
    normPath <- SD.canonicalizePath root
    SC.scotty port $ server normPath

server :: String -> SC.ScottyM ()
server root = do
  SC.middleware $ staticPolicy
    (   noDots
    >-> hasPrefix "static/"
    >-> addBase root
    )
  SC.get "/" $ do
    SC.setHeader "Content-Type" "text/html"
    SC.file $ norm "index.html"
  SC.get "/doc" $ do
    doc <- liftIO $ parseOrgFile (norm "docs/evaluations.org") ["TODO", "DONE"]
    either (SC.text . T.pack . show) SC.json doc
 where
  norm path = root ++ "/" ++ path

data Cmd = Cmd
    { cmdRootPath :: String
    , cmdPort :: Int
    }

cmdParser :: ParserSpec Cmd
cmdParser = Cmd
    `parsedBy` reqPos "static-path"
    `andBy` optFlag 3000 "port"
