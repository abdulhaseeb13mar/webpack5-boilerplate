import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Keypair } from "@solana/web3.js";

import { getStorageSyncValue, setStorageSyncValue } from "@constants";
import { RootState, USERINFO } from "interfaces";
import { encryptMessage } from "utils";
import { ACCOUNTS, CHAINS, EVM, SOLANA } from "utils/constants";
import { changeAccount } from "@slices/walletSlice/wallet.actions";

const b58 = require("b58");

export const useImportAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { walletNumber } = useSelector((state: RootState) => state.app);
  const { chain } = useSelector((state: RootState) => state.wallet);

  const checkAccountExist = (
    isUserExists: USERINFO,
    address: string,
    chain: string
  ) => {
    let accountExist: boolean = false;
    let addresses: string[] = [];
    let wallets = Object.keys(isUserExists);
    console.log({ wallets });
    wallets.forEach((wallet) => {
      addresses = [
        ...addresses,
        ...Object.keys(isUserExists[wallet][CHAINS][chain][ACCOUNTS]),
      ];
    });
    console.log({ addresses }, { address });
    addresses.map((adr) => {
      if (adr.includes(address)) return (accountExist = true);
      return null;
    });
    return accountExist;
  };

  const saveUserData = async (
    user: USERINFO,
    address: string,
    secret: string,
    chain: string,
    accountNo: number
  ) => {
    let isUserExists = user;

    isUserExists[`wallet${walletNumber}`][CHAINS][chain][ACCOUNTS] = {
      ...isUserExists[`wallet${walletNumber}`][CHAINS][chain][ACCOUNTS],
      [address]: {
        name: `Account ${accountNo}`,

        address,
        secret,
      },
    };

    console.log({ isUserExists }, "the user exists on the time of saving");
    await setStorageSyncValue("userInfo", isUserExists);
  };

  const importEvmAccount = async (key: string) => {
    const wallet = new ethers.Wallet(key);

    // const isNewWallet = Wallet.fromPrivateKey(Buffer.from(key, "hex"));

    if (wallet) {
      console.log("wallet", wallet);
      let isUserExists = (await getStorageSyncValue("userInfo")) as USERINFO;
      const address = wallet.address;
      console.log(wallet.mnemonic, "mnemonic");

      const accountExist = checkAccountExist(isUserExists, address, EVM);

      if (accountExist) {
        return { status: true, message: "account already exits" };
      } else {
        let hashedPassword = (await getStorageSyncValue(
          "hashedPassword"
        )) as string;
        const EVMSECRET = encryptMessage(wallet.privateKey, hashedPassword);
        const accountNo =
          Object.keys(
            isUserExists[`wallet${walletNumber}`][CHAINS][EVM][ACCOUNTS]
          ).length + 1;
        console.log(accountNo, "accountNo", walletNumber);
        await saveUserData(
          isUserExists,
          wallet.address,
          EVMSECRET,
          EVM,
          accountNo
        );
        dispatch(changeAccount(Number(accountNo - 1), wallet.address, chain));
        navigate("/index.html");
        return { status: true, message: "Account imported successfully" };
      }
    }
  };

  const importSolanaAccount = async (privateKey: string) => {
    try {
      console.log({ privateKey });
      let hashedPassword = (await getStorageSyncValue(
        "hashedPassword"
      )) as string;

      let isUserExists = (await getStorageSyncValue("userInfo")) as USERINFO;
      // const privateOf = decryptMessage(privateKey, hashedPassword);
      // console.log(privateOf, "priveta");
      const protectedKey = encryptMessage(privateKey, hashedPassword);
      const address = b58.decode(privateKey);
      const { publicKey } = Keypair.fromSecretKey(address);
      console.log({ publicKey }, "the================", typeof publicKey);
      const accountExist = checkAccountExist(
        isUserExists,

        publicKey.toString(),
        SOLANA
      );
      if (accountExist) {
        return { status: true, message: "account already exits" };
      } else {
        console.log({ address });
        const accountNo =
          Object.keys(
            isUserExists[`wallet${walletNumber}`][CHAINS][SOLANA][ACCOUNTS]
          ).length + 1;
        const account = Keypair.fromSecretKey(address);
        console.log({ account });
        await saveUserData(
          isUserExists,

          publicKey.toString(),
          protectedKey,
          SOLANA,
          accountNo
        );
        dispatch(changeAccount(Number(accountNo), publicKey.toString(), chain));
        navigate("/index.html");

        return { status: true, message: "Account imported successfully" };
      }
    } catch (error) {
      return { status: true, message: "Please enter a valid private key" };
    }
  };

  return { importEvmAccount, importSolanaAccount };
};
// 43CkVdxhMmU2LwnMAP6zxMFyg1VWJYgYHDz8aPmLdzoRkHMQpqbonpRPwAFdXrAPhLPAu6oY4NHhVn8udmaD8Yc3 solana private key1
// 2b15c64f26bdd4a4176d455b7925ec716d98c603add3832974694c5571f4908b
//4JrSU2cuHL6J4PM89Z4cKUH8R7EVcHNJtxHywhSZkLDvEbaFFzB5XoyZv5qLPZL7soxEvJP78jj1aaj6PQjFV5Jh
