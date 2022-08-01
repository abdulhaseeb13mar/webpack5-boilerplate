export {};
// import { WindowListener, WindowRequestEvent } from "provider-bridge-shared";
// import TallyWindowProvider from "window-provider";

// console.log("PAGE CALLED================================");

// Object.defineProperty(window, "tally", {
//   value: new TallyWindowProvider({
//     postMessage: (data: WindowRequestEvent) =>
//       window.postMessage(data, window.location.origin),
//     addEventListener: (fn: WindowListener) =>
//       window.addEventListener("message", fn, false),
//     removeEventListener: (fn: WindowListener) =>
//       window.removeEventListener("message", fn, false),
//     origin: window.location.origin,
//   }),
//   writable: false,
//   configurable: false,
// });

// if (!window.walletRouter) {
//   Object.defineProperty(window, "walletRouter", {
//     value: {
//       currentProvider: window.tally,
//       previousProvider: window.ethereum,
//       providers: [
//         ...new Set([
//           ...(window.ethereum
//             ? Array.isArray(window.ethereum.providers)
//               ? [...window.ethereum.providers, window.ethereum]
//               : [window.ethereum]
//             : []),
//           window.tally,
//         ]),
//       ],
//       switchToPreviousProvider() {
//         if (this.previousProvider) {
//           const tempPreviousProvider = this.previousProvider;
//           this.previousProvider = this.currentProvider;
//           this.currentProvider = tempPreviousProvider;
//         }
//       },
//       getProviderInfo(provider: WalletProvider) {
//         return (
//           provider.providerInfo || {
//             label: "Injected Provider",
//             injectedNamespace: "ethereum",
//             iconURL: "TODO",
//           }
//         );
//       },
//       hasProvider(checkIdentity: (provider: WalletProvider) => boolean) {
//         return this.providers.some(checkIdentity);
//       },
//       getProvider(checkIdentity: (provider: WalletProvider) => boolean) {
//         const providerIndex = this.providers.findIndex(checkIdentity);
//         return this.providers[providerIndex];
//       },
//       setCurrentProvider(checkIdentity: (provider: WalletProvider) => boolean) {
//         if (!this.hasProvider(checkIdentity)) {
//           throw new Error(
//             "The given identity did not match to any of the recognized providers!"
//           );
//         }
//         this.previousProvider = this.currentProvider;
//         this.currentProvider = this.getProvider(checkIdentity);
//       },
//       addProvider(newProvider: WalletProvider) {
//         if (!this.providers.includes(newProvider)) {
//           this.providers.push(newProvider);
//         }

//         this.previousProvider = newProvider;
//       },
//     },
//     writable: false,
//     configurable: false,
//   });
// }

// Object.defineProperty(window, "ethereum", {
//   get() {
//     return new Proxy(window.walletRouter!.currentProvider, {
//       get(target, prop, receiver) {
//         if (
//           window.walletRouter &&
//           !(prop in window.walletRouter!.currentProvider) &&
//           prop in window.walletRouter!
//         ) {
//           // @ts-expect-error ts accepts symbols as index only from 4.4
//           return window.walletRouter[prop];
//         }

//         return Reflect.get(target, prop, receiver);
//       },
//     });
//   },
//   set(newProvider) {
//     window.walletRouter?.addProvider(newProvider);
//   },
//   configurable: false,
// });
