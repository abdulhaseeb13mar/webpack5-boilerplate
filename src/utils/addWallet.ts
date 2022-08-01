import { Keypair, Account } from "@solana/web3.js";
import { ethers } from "ethers";
import * as Bip39 from "bip39";
import * as ed25519 from "ed25519-hd-key";
import { KeyPair, utils } from "near-api-js";

import {
  ACCOUNT1,
  SUPPORTEDCHAINS,
  LOGIN_EXPIRY,
  CHAINS,
  EVM,
  ACCOUNTS,
  SOLANA,
  NEAR_TESTNET,
} from "utils/constants";
import { encryptMessage } from "utils";
import { getStorageSyncValue, setStorageSyncValue } from "@constants";
import { USERINFO } from "interfaces";

const nacl = require("tweetnacl");
const b58 = require("b58");
const { parseSeedPhrase } = require("near-seed-phrase");
// const KEY_DERIVATION_PATH = "m/44'/397'/0'";

const createEVMwallet = async (
  generatedMnemonic: string,
  hashedPassword: string,
  walletCount: number
) => {
  let accountNo = 1;
  let randomSeed = ethers.Wallet.fromMnemonic(generatedMnemonic);
  const EVMSECRET = encryptMessage(randomSeed.privateKey, hashedPassword);
  if (walletCount !== 0) {
    const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;
    accountNo = Object.keys(
      isUserExist[`wallet${walletCount}`][CHAINS][EVM][ACCOUNTS]
    ).length;
  }
  const data = {
    [randomSeed.address]: {
      name: `EVM Account ${accountNo}`,
      address: randomSeed.address,
      secret: EVMSECRET,
    },
  };
  return data;
};

const createSolanaWallet = async (
  generatedMnemonic: string,
  hashedPassword: string,
  walletCount: number
) => {
  let accountNo = 1;
  const seed = Bip39.mnemonicToSeedSync(generatedMnemonic);

  let path = `m/44'/501'/0'`;
  const derivedSeed = ed25519.derivePath(path, seed.toString("hex")).key;
  const account = new Account(
    nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
  );
  let keypair = Keypair.fromSecretKey(account.secretKey);
  console.log(keypair.publicKey.toString(), b58.encode(keypair.secretKey));
  const SOLANASECRET = encryptMessage(
    b58.encode(keypair.secretKey),
    hashedPassword
  );

  const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;
  if (walletCount !== 0) {
    accountNo = Object.keys(
      isUserExist[`wallet${walletCount}`][CHAINS][SOLANA][ACCOUNTS]
    ).length;
  }

  const data = {
    [keypair.publicKey.toString()]: {
      name: `Solana Account ${accountNo}`,
      address: keypair.publicKey.toString(),
      secret: SOLANASECRET,
    },
  };
  return data;
};

const createNearWallet = async (
  generatedMnemonic: string,
  hashedPassword: string,
  walletCount: number,
  importWallet: Boolean
) => {
  let existingPublicKey = "";

  let accountNo = 1;
  let mainnetAddress = "";
  let publicKey = "";
  let secretKey = "";
  if (importWallet) {
    ({ secretKey, existingPublicKey, publicKey, mainnetAddress } =
      await importNearWallet(generatedMnemonic));
  } else {
    ({ secretKey, existingPublicKey, publicKey, mainnetAddress } =
      await importNearWallet(generatedMnemonic));
  }

  const NEARSECRET = encryptMessage(secretKey, hashedPassword);
  const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;
  if (walletCount !== 0) {
    console.log("walletCount", walletCount);
    accountNo = Object.keys(
      isUserExist[`wallet${walletCount}`][CHAINS][NEAR_TESTNET][ACCOUNTS]
    ).length;
  }
  console.log(existingPublicKey, "existing");
  if (!existingPublicKey && importWallet) {
    existingPublicKey = (
      utils.PublicKey.fromString(publicKey).data as Buffer
    ).toString("hex");
  }
  if (!mainnetAddress) {
    mainnetAddress = (
      utils.PublicKey.fromString(publicKey).data as Buffer
    ).toString("hex");
  }
  const data = {
    [publicKey]: {
      name: `Near Testnet Account ${accountNo}`,
      address: existingPublicKey || "",
      secret: NEARSECRET,
    },
  };
  const NEAR_MAINNNET = {
    [publicKey]: {
      name: `Near Mainnet Account ${accountNo}`,
      address: mainnetAddress || "", //       "e831b25c42754b4987e31419eba3e3d9b7b33ba116a4f01ac115fd7236e8515a",

      secret: NEARSECRET,
    },
  };
  return {
    [SUPPORTEDCHAINS.NEAR_TESTNET]: data,
    [SUPPORTEDCHAINS.NEAR]: NEAR_MAINNNET,
  };
};

const importNearWallet = async (phrase: string) => {
  const { secretKey } = parseSeedPhrase(phrase);
  const keyPair: KeyPair = KeyPair.fromString(secretKey);
  console.log({ keyPair });
  const publicKey = keyPair.getPublicKey().toString();

  const accountIdsByPublickKey = ""; //await getAccountIds(
  //publicKey,
  //SupportedChainId.NEAR_TESTNET
  //);
  const mainnetAddress = ""; // await getAccountIds(publicKey, SupportedChainId.NEAR);
  console.log({ accountIdsByPublickKey });
  return {
    secretKey,
    publicKey,
    existingPublicKey: accountIdsByPublickKey,
    mainnetAddress,
  };
};

export const addUserWallet = async (
  generatedMnemonic: string,
  hashedPassword: string,
  importWallet: Boolean
) => {
  try {
    let userInfo: {
      [key: string]: {
        seedphrase: string;
        chains: {
          [key: string]: {
            accounts: {
              [key: string]: {
                name: string;
                address: string;
                secret: string;
              };
            };
          };
        };
      };
    } = {};
    const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;

    let walletCount = Object.keys(isUserExist).length;
    // EVM WALLET
    const evmWallet = await createEVMwallet(
      generatedMnemonic,
      hashedPassword,
      walletCount
    );
    console.log(evmWallet);
    // SOLANA WALLET
    const solanaWallet = await createSolanaWallet(
      generatedMnemonic,
      hashedPassword,
      walletCount
    );

    let nearWallet = await createNearWallet(
      generatedMnemonic,
      hashedPassword,
      walletCount,
      importWallet
    );

    const encryptedMnemonic = encryptMessage(generatedMnemonic, hashedPassword);
    walletCount += 1;
    userInfo = Object.assign(
      {},
      {
        ...isUserExist,
        [`wallet${walletCount}`]: {
          seedphrase: encryptedMnemonic,
          chains: {
            [SUPPORTEDCHAINS[EVM]]: {
              accounts: {
                ...evmWallet,
              },
            },
            [SUPPORTEDCHAINS.SOLANA]: {
              accounts: {
                ...solanaWallet,
              },
            },
            [SUPPORTEDCHAINS.NEAR_TESTNET]: {
              accounts: {
                ...nearWallet.NEAR_TESTNET,
              },
            },
            [SUPPORTEDCHAINS.NEAR]: {
              accounts: {
                ...nearWallet.NEAR,
              },
            },
          },
        },
      }
    );

    console.log(userInfo);

    await setStorageSyncValue("userInfo", userInfo);
    await setStorageSyncValue("hashedPassword", hashedPassword);
    await setStorageSyncValue("accounts", 0);
    await setStorageSyncValue("expiry", new Date().getTime() + LOGIN_EXPIRY);
  } catch (error) {
    console.log(error);
  }
};

export const saveUserWallet = async (
  generatedMnemonic: string,
  EVMAddress: string,
  EVMKey: string,
  SOLANAAddress: string,
  SOLANAKEY: string,
  NEARAddress: string,
  NEARKey: string
) => {
  let userInfo: {
    [key: string]: {
      seedphrase: string;
      chains: {
        [key: string]: {
          accounts: {
            [key: string]: {
              name: string;
              address: string;
              secret: string;
            };
          };
        };
      };
    };
  } = {
    wallet1: {
      seedphrase: generatedMnemonic,
      chains: {
        [SUPPORTEDCHAINS.EVM]: {
          accounts: {
            [EVMAddress]: {
              address: EVMAddress,
              secret: EVMKey,
              name: ACCOUNT1,
            },
          },
        },
        [SUPPORTEDCHAINS.SOLANA]: {
          accounts: {
            [SOLANAAddress]: {
              address: SOLANAAddress,
              secret: SOLANAKEY,
              name: ACCOUNT1,
            },
          },
        },
        [SUPPORTEDCHAINS.NEAR_TESTNET]: {
          accounts: {
            [NEARAddress]: {
              address: NEARAddress,
              secret: NEARKey,
              name: ACCOUNT1,
            },
          },
        },
      },
    },
  };
  await setStorageSyncValue("userInfo", userInfo);

  console.log(SUPPORTEDCHAINS);
  console.log("USER INFO", userInfo);
};
//anchor chapter split return firm easily bind trouble slide unaware brisk bread
