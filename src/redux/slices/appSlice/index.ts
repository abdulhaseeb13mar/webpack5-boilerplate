import { createSlice } from "@reduxjs/toolkit";
import { AppReduxState } from "interfaces";
import { STATIC_STRAIGHTLINE_GRAPH } from "theme/constants";

const initialState: AppReduxState = {
  switchNetwork: false,
  isLoggedIn: false,
  isUserExists: false,
  colorTheme: "dark",
  initiallyAnimated: false,
  totalWalletData: {
    data: STATIC_STRAIGHTLINE_GRAPH,
    categorydata: {
      daycategory: [0, 0, 0, 0, 0],
      weekcategory: [0, 0, 0, 0, 0],
      monthcategory: [0, 0, 0, 0, 0],
    },
  },
  password: "",
  hudMargin: 0,
  isLoading: false,
  address: "",
  accountNumber: 0,
  walletNumber: 1,
  switchWallet: false,
  isNewWallet: false,
  isUserSavedMnemonic: false,
  currentAccountAddress: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    //action type before -> IS_MNEMONIC_SAVED
    isMnemonicSaved: (state, action) => {
      state.isUserSavedMnemonic = action.payload;
    },
    // action type before -> SET_USER_LOGGED_IN
    setUserLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    // action type before -> SET_COLOR_THEME
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
    // action type before -> SET_INITIALLY_ANIMATE
    setInitiallyAnimate: (state, action) => {
      state.initiallyAnimated = action.payload;
    },
    // action type before -> SET_TOTAL_WALLET_DATA
    setTotalWalletData: (state, action) => {
      console.log(action.payload);
      state.totalWalletData = {
        ...state.totalWalletData,
        data: action.payload.data,
      };
    },
    // action type before -> SET_PASSWORD
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    // action type before -> SET_HUD_MARGIN
    setHudMargin: (state, action) => {
      state.hudMargin = action.payload;
    },

    // action type before -> SET_USER_ADDRESS
    setUserAddress: (state, action) => {
      state.address = action.payload;
    },

    // action type before -> CHECK_USER
    checkUser: (state, action) => {
      state.isUserExists = action.payload;
    },
    // action type before -> SHOW_LOADING
    showLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    // action type before -> FILTER_BY_NETWORK
    filterByNetwork: (state, action) => {
      state.switchNetwork = action.payload;
    },
    // action type before -> SET_ACCOUNT_NUMBER
    setAccountNumber: (state, action) => {
      state.accountNumber = action.payload;
    },
    // action type before -> SET_WALLET_FILTER
    setWalletFilter: (state, action) => {
      state.switchWallet = action.payload;
    },
    // action type SET_WALLET_NUMBER
    setWalletNumber: (state, action) => {
      state.walletNumber = action.payload;
    },
    // action type SET_NEW_WALLET
    setNewWallet: (state, action) => {
      state.isNewWallet = action.payload;
    },
    //
    setCurrentAccountAddress: (state, action) => {
      state.currentAccountAddress = action.payload;
    },
    // case SET_CURRENT_ACCOUNT_ADDRESS:
    //   return {
    //     ...state,
    //     currentAccountAddress: payload,
    //   };
  },
});

export const {
  setUserLoggedIn,
  setColorTheme,
  setInitiallyAnimate,
  setTotalWalletData,
  setPassword,
  setHudMargin,
  setUserAddress,
  checkUser,
  filterByNetwork,
  setAccountNumber,
  setWalletFilter,
  setWalletNumber,
  setNewWallet,
  showLoading,
  isMnemonicSaved,
  setCurrentAccountAddress,
} = appSlice.actions;

export default appSlice.reducer;
