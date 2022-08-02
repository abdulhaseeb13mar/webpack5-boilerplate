import { createSlice } from "@reduxjs/toolkit";

import { SupportedChainId } from "utils/constants";
import { SendTransactionReduxState } from "interfaces";

export interface CounterState {
  value: number;
}

const initialState: SendTransactionReduxState = {
  selectedToken: {
    tokenName: "",
    tokenAddress: "",
    tokenAmount: 0,
    amount: 0,
    recieverAddress: "",
    tokenDecimal: 0,
    tokenNetwork: 1,
    address: "",
    usdAmount: 0,
    nativeTokenInUsd: 0,
    accountName: "Account 1",
    walletName: "Wallet 1",
    multiAccountExist: false,
  },
  clipboard: "",
  addressBook: [],
  selectedGasValue: "0",
  receipt: {
    open: false,
    status: false,
    transactionHash: "",
    blockNumber: 0,

    from: "",
    to: "",
  },
  transactions: {},
  cachedTransactions: {},

  pendingTransaction: {},

  slippage: 1,
  swapTransactionTime: 0,
  gasSpeed: "Average",
  sendTransactionPrice: 0,
  gasPrice: 0,
  recentRecipient: { EVM: "", NEAR_TESTNET: "", NEAR: "", SOLANA: "" },
};

export const sendTransactionSlice = createSlice({
  name: "sendTransaction",
  initialState,
  reducers: {
    // action before -> ADD_SELECTED_TOKEN
    addSelectedToken: (state, action) => {
      state.selectedToken = { ...state.selectedToken, ...action.payload };
    },
    // action before -> COPY_TO_CLIPBOARD
    copyToClipboard: (state, action) => {
      state.clipboard = action.payload;
    },
    // action before -> SELECT_GAS_FEES
    selectGasFees: (state, action) => {
      state.selectedGasValue = action.payload;
    },
    // action before -> ADD_TO_ADDRESS_BOOK
    addToAddressBook: (state, action) => {
      state.addressBook = [...state.addressBook, action.payload];
    },
    // action before -> SET_RECEIPT_MODAL
    setReceiptModal: (state, action) => {
      const { payload } = action;
      state.receipt = { ...state.receipt, open: payload };
    },
    // action before -> SET_TRANSACTION_RECEIPT
    setTransactionReceipt: (state, action) => {
      state.receipt = { ...state.receipt, ...action.payload };
    },
    // action before -> ADD_TRANSACTIONS
    addTransactions: (state, action) => {
      const { payload } = action;
      let previousTxHashes: any[];

      if (state.transactions[payload.chain]) {
        previousTxHashes = [...state.transactions[payload.chain]];
      } else {
        previousTxHashes = [];
      }

      const transactions = {
        ...state.transactions,
        [payload.chain]: [
          ...previousTxHashes,
          {
            hash: payload.hash,
            rough: payload.rough,
            TxType: payload.TxType,
            nonce: payload.nonce,
          },
        ],
      };

      state.transactions = transactions;
    },
    setCachedTransactions: (state, action) => {
      const { payload } = action;
      let cachedTxHashes: any[] = [];

      if (state.cachedTransactions[payload.network]) {
        cachedTxHashes = [...state.cachedTransactions[payload.network]];
      } else {
        cachedTxHashes = [];
      }

      let cachedTransactions = {};
      if (
        parseInt(payload.network) === SupportedChainId.SOLANA_DEVNET ||
        parseInt(payload.network) === SupportedChainId.SOLANA_MAINNET
      ) {
        cachedTransactions = {
          ...state.cachedTransactions,
          [payload.network]: [
            ...cachedTxHashes,
            {
              hash: payload.hash,
              address: payload.address,
              to: payload.to,
              amount: payload.amount,
              tokenAddress: payload.tokenAddress,
              gasFee: payload.gasFee,
              timestamp: payload.timestamp,
            },
          ],
        };
      } else if (
        parseInt(payload.network) === SupportedChainId.NEAR ||
        parseInt(payload.network) === SupportedChainId.NEAR_TESTNET
      ) {
        cachedTransactions = {
          ...state.cachedTransactions,
          [payload.network]: [
            ...cachedTxHashes,
            {
              hash: payload.hash,
              address: payload.address,
              timestamp: payload.timestamp,
            },
          ],
        };
      } else {
        cachedTransactions = {
          ...state.cachedTransactions,
          [payload.network]: [
            ...cachedTxHashes,
            {
              hash: payload.hash,
              address: payload.address,
            },
          ],
        };
      }

      state.cachedTransactions = cachedTransactions;
    },
    // action before -> REMOVE_TRANSACTION
    removeTransaction: (state, action) => {
      const { payload } = action;
      let TxHashes: any[];
      if (state.transactions[payload.chain]) {
        TxHashes = [...state.transactions[payload.chain]];
      } else {
        TxHashes = [];
      }

      const transactionslist = {
        ...state.transactions,
        [payload.chain]: TxHashes.filter((val) => {
          return val.nonce !== payload.nonce;
        }),
      };
      console.log(transactionslist, "here we left==");
      state.transactions = transactionslist;
      // state.transactions = {};
    },
    // action before ->SET_SLIPPAGE
    setSlippage: (state, action) => {
      state.slippage = action.payload;
    },
    // action before -> SET_SWAP_TRANSACTION_TIME
    setSwapTransactionTime: (state, action) => {
      state.swapTransactionTime = action.payload;
    },
    // action before -> SET_GAS_SPEED
    setGasSpeed: (state, action) => {
      state.gasSpeed = action.payload;
    },
    // action before -> SET_SEND_TRANSACTION_PRICE
    setSendTransactionPrice: (state, action) => {
      state.sendTransactionPrice = action.payload;
    },
    // SET_GAS_PRICE
    setGasPrice: (state, action) => {
      state.gasPrice = action.payload;
    },
    // action before -> SET_RECENT_RECIPIENT
    setRecentRecipient: (state, action) => {
      const { payload } = action;
      state.recentRecipient = {
        ...state.recentRecipient,
        [payload.chain]: payload.recieverAddress,
      };
    },
  },
});

export const {
  addSelectedToken,
  copyToClipboard,
  selectGasFees,
  addToAddressBook,
  addTransactions,
  removeTransaction,
  setGasPrice,
  setGasSpeed,
  setReceiptModal,
  setRecentRecipient,
  setSendTransactionPrice,
  setSlippage,
  setSwapTransactionTime,
  setTransactionReceipt,
  setCachedTransactions,
} = sendTransactionSlice.actions;

export default sendTransactionSlice.reducer;
