import { createSlice } from "@reduxjs/toolkit";

import { WalletReduxState } from "interfaces";
import { ETHEREUM_COINGECKO_ID, EVM } from "utils/constants";

const initialState: WalletReduxState = {
  apiCall: false,
  network: 1,
  tokensHistory: [],
  nativeTokenBalance: {
    balance: 0,
    balanceInUSD: 0,
    symbol: ETHEREUM_COINGECKO_ID,
  },
  currentWalletName: "wallet1",
  profit: {
    amount: 0,
    symbol: "",
    status: true,
  },

  swap: false,
  toTokens: {},
  swapToken: {},
  nativeTokenPrice: 0,

  accountKeypairSolana: {
    publicKey: "",
    secretKey: "",
  },

  chain: EVM,
  nearAccountId: "",
  nearMainnetAccountId: "",
  nearAccountNetwork: 0,
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // action type before -> FETCH_TOKEN_HISTORY
    fetchTokenHistory: (state, action) => {
      const { payload } = action;
      console.log("the payload====", payload);

      state.tokensHistory = payload.tokensHistory;
    },

    // action type before -> SET_KEYPAIR
    setKeyPair: (state, action) => {
      state.accountKeypairSolana = action.payload;
    },
    // action type before -> ADD_PROFIT
    addProfit: (state, action) => {
      state.profit = action.payload;
    },
    //  action type before -> API_CALL
    apiCall: (state, action) => {
      state.apiCall = action.payload;
    },
    // action type before -> CHANGE_NETWORK
    changeNetwork: (state, action) => {
      state.network = action.payload;
    },
    // action type before -> SWAP
    swap: (state, action) => {
      state.swap = action.payload;
    },
    // action type before -> SET_TO_TOKENS
    setToTokens: (state, action) => {
      state.toTokens = action.payload;
    },
    // action type before -> ADD_TOKEN_IN_TOTOKEN
    addTokenInToToken: (state, action) => {
      // state.toTokens.push(action.payload);
    },
    // action type before -> FETCH_NATIVE_TOKEN_PRICE
    fetchNativeTokenPrice: (state, action) => {
      state.nativeTokenPrice = action.payload;
    },
    // action type before -> SET_CHAIN
    setChain: (state, action) => {
      state.chain = action.payload;
    },
    // action type before -> SET_NEAR_ACCOUNT_ID
    setNearAccountId: (state, action) => {
      state.nearAccountId = action.payload;
    },
    // action type before -> SET_NEAR_ACCOUNT_NETWORK
    setNearAccountNetwork: (state, action) => {
      state.nearAccountNetwork = action.payload;
    },
    // action type before -> SET_NEAR_MAINNET_ACCOUNT_ID
    setNearMainnetAccountId: (state, action) => {
      state.nearMainnetAccountId = action.payload;
    },
  },
});

export const {
  fetchTokenHistory,
  addProfit,
  addTokenInToToken,
  apiCall,
  changeNetwork,
  fetchNativeTokenPrice,
  setChain,
  setKeyPair,
  setNearAccountId,
  setNearAccountNetwork,
  setNearMainnetAccountId,
  setToTokens,
  swap,
} = walletSlice.actions;

export default walletSlice.reducer;
