import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import appReducer from "@slices/appSlice";
import walletReducer from "@slices/walletSlice";
import sendTransaction from "@slices/sendTransaction";
// import dappPermissionReducer from "@slices/dapp-permission";
// import transactionConstructionReducer from "@slices/transaction-construction";
// import signingReducer from "@slices/signing";

const storage = require("redux-persist/lib/storage").default;

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  whitelist: ["app", "wallet", "sendTransaction"],
};

const reducers = combineReducers({
  app: appReducer,
  wallet: walletReducer,
  sendTransaction,
  // dappPermission: dappPermissionReducer,
  // transactionConstruction: transactionConstructionReducer,
  // signing: signingReducer,
});

export const persistedReducer = persistReducer(persistConfig, reducers);

export type ThisRootState = ReturnType<typeof reducers>;
