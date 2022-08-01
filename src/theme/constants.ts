// import { Chain, CustomChain } from "@ethereumjs/common";
import axios from "axios";

export const CURRENTLY_IN_DEVELOPMENT = false;

export const OPEN_IN_WEB = chrome.storage ? false : true;

export const AUTHSCREENS = {
  landing: "/index.html",
  seedphrase: "/seedphrase",
};

export const APPSCREENS = {
  dashboard: "/index.html",
  importWallet: "/importWallet",
  importAccount: "/importAccount",
  settings: "/settings",
  send: "/send",
  swap: "/swap",
  near: "/near",
  seedphrase: "/seedphrase",
  dapp: "/dapp",
  connect: "/dapp/connect",
  changeNetwork: "/dapp/change-network",
  tx: "/dapp/tx",
};

export const HEIGHT = "597px";
export const WIDTH = "360px";

export const STORAGE = OPEN_IN_WEB ? undefined : chrome.storage.sync;

export const STATIC_STRAIGHTLINE_GRAPH = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

export const STATIC_TIME_GRAPH_DATA = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  // 16, 17, 18, 19, 20, 21, 22,
  // 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  // 42, 43, 44, 45, 46, 47, 48, 49, 50,
];
export default axios.create({ baseURL: "https://api.coingecko.com/api/v3" });
