{-# LANGUAGE OverloadedStrings #-}

import Data.List (isSuffixOf)
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

  SC.get "/docs" $ do
    files <- liftIO getOrgFiles
    SC.json files

  SC.get "/doc/:docName" $ do
    name <- SC.param "docName"
    doc <- liftIO $ readOrgFile name
    either (SC.text . T.pack . show) SC.json doc

 where

  norm path = root ++ "/" ++ path

  getOrgFiles = do
    content <- SD.getDirectoryContents $ root ++ "/docs"
    return $ filter (isSuffixOf ".org") content

  readOrgFile name = parseOrgFile (norm $ "docs/" ++ name) ["TODO", "DONE"]

data Cmd = Cmd String Int

cmdParser :: ParserSpec Cmd
cmdParser = Cmd
    `parsedBy` reqPos "static-path"
    `andBy` optFlag 3000 "port"
