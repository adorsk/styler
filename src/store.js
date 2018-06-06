import { createStore, applyMiddleware } from "redux"
import logger from 'redux-logger'

import thunk from "redux-thunk"

import rootReducer from "./reducers/rootReducer"

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunk, logger)
  )

  if(process.env.NODE_ENV !== "production") {
    if(module.hot) {
      module.hot.accept("./reducers/rootReducer", () =>{
        const newRootReducer = require("./reducers/rootReducer").default
        store.replaceReducer(newRootReducer)
      })
    }
  }
  return store
}
