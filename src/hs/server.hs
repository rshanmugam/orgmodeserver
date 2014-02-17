{-# LANGUAGE OverloadedStrings #-}

import Web.Scotty
import Network.Wai.Middleware.Static
import qualified Data.Text.Lazy as T
import Control.Monad.IO.Class (liftIO)
import OrgMode

import Data.Monoid (mconcat)

main = scotty 3000 $ do
  middleware $ staticPolicy (noDots >-> hasPrefix "static/")
  get "/doc" $ do
    doc <- liftIO $ parseOrgFile "docs/evaluations.org" ["TODO"]
    either (text . T.pack . show) json doc
