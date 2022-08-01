// import browser from "webextension-polyfill";

// import {
//   EXTERNAL_PORT_NAME,
//   PROVIDER_BRIDGE_TARGET,
//   WINDOW_PROVIDER_TARGET,
// } from "provider-bridge-shared";

// const extension = require("extensionizer");

// const windowOriginAtLoadTime = window.location.origin;

// // const INJECTED_WINDOW_PROVIDER_SOURCE = "SONAR";

// export function connectProviderBridge() {
//   console.log("connect-----------------------");
//   const port = browser.runtime.connect({ name: EXTERNAL_PORT_NAME });
//   window.addEventListener("message", (event) => {
//     if (
//       event.origin === windowOriginAtLoadTime && // we want to recieve msgs only from the in-page script
//       event.source === window && // we want to recieve msgs only from the in-page script
//       event.data.target === PROVIDER_BRIDGE_TARGET
//     ) {
//       // TODO: replace with better logging before v1. Now it's invaluable in debugging.
//       // eslint-disable-next-line no-console
//       console.log(
//         `%c content: inpage > background: ${JSON.stringify(event.data)}`,
//         "background: #bada55; color: #222"
//       );

//       port.postMessage(event.data);
//     }
//   });

//   port.onMessage.addListener((data) => {
//     // TODO: replace with better logging before v1. Now it's invaluable in debugging.
//     // eslint-disable-next-line no-console
//     console.log(
//       `%c content: background > inpage: ${JSON.stringify(data)}`,
//       "background: #222; color: #bada55"
//     );
//     window.postMessage(
//       {
//         ...data,
//         target: WINDOW_PROVIDER_TARGET,
//       },
//       windowOriginAtLoadTime
//     );
//   });

//   // let's grab the internal config
//   port.postMessage({ request: { method: "tally_getConfig" } });
// }

// export function injectTallyWindowProvider() {
//   console.log("INJECT-----------------------");
//   try {
//     const container = document.head || document.documentElement;
//     const scriptTag = document.createElement("script");

//     scriptTag.setAttribute("async", "false");
//     scriptTag.setAttribute("src", extension.runtime.getURL("page.js"));

//     container.insertBefore(scriptTag, container.children[0]);
//   } catch (e) {
//     throw new Error(
//       `Tally: oh nos the content-script failed to initilaize the Tally window provider.
//         ${e}
//         It's time for a seppuku...🗡`
//     );
//   }
// }

// // connectProviderBridge();
// // injectTallyWindowProvider();
