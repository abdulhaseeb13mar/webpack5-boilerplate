import Common from "@ethereumjs/common";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { connect, KeyPair, keyStores } from "near-api-js";
import { parseNearAmount } from "near-api-js/lib/utils/format";
import { useNavigate } from "react-router";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ethers } from "ethers";
import BN from "bn.js";

import {
  convertBalanceToBaseUnit,
  formateAmount,
  getChainAddressWithSecretKeys,
  getGasPrice,
  getTransactionRawData,
  isStringIncludesTheValue,
} from "utils";
import { RootState } from "interfaces";
import {
  COMMITMENT,
  CONFIG,
  FT_TRANSFER_DEPOSIT,
  FT_TRANSFER_GAS,
  MAINNET,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_SYMBOL,
  NEAR,
  NEAR_ADDRESS,
  NEAR_TESTNET,
  NETWORKCHAIN,
  NETWORK_ID,
  SCAN_LINK,
  SOLANA_ADDRESS,
  SupportedChainId,
} from "utils/constants";
import { generateNotification } from "@constants";
import { DEVNET } from "utils/constants";
import {
  addSelectedToken,
  addTransactions,
  removeTransaction,
  selectGasFees,
  setRecentRecipient,
  setTransactionReceipt,
  setCachedTransactions,
} from "@slices/sendTransaction";

const { abi } = require("abis/erc20abi.json");
const splToken = require("@solana/spl-token");
let web3: Web3;
let common: any;

export const useTransaction = () => {
  const dispatch = useDispatch();

  const { chain, nearAccountId, accountKeypairSolana } = useSelector(
    (state: RootState) => state.wallet
  );
  const { transactions, gasPrice, selectedToken } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const {
    tokenAddress,
    tokenDecimal,
    recieverAddress,
    tokenNetwork: network,
    address,
    amount,
  } = selectedToken;
  const navigate = useNavigate();

  const fetchGasPriceAndCount = async (network: number, address: string) => {
    let [currentGasPrice, count] = [
      await getGasPrice(network),

      await web3.eth.getTransactionCount(address),
    ];

    return { currentGasPrice, count };
  };

  const initializeContractAndFetchAmount = async (
    amount: number,
    address: string
  ) => {
    console.log({ amount });
    let contract = new web3.eth.Contract(abi, tokenAddress);
    const amountInWei = await convertBalanceToBaseUnit(
      contract,
      amount.toString()
    );
    console.log({ amountInWei });

    let estimateGas = await contract.methods
      .transfer(address, amountInWei)
      .estimateGas({ from: address });
    console.log({ estimateGas });

    let numOfDecimals = await contract.methods.decimals().call();
    let tokenSymbol = await contract.methods.symbol().call();

    return { contract, estimateGas, numOfDecimals, tokenSymbol };
  };

  const fetchUserNAtiveBalance = async (address: string) => {
    const balance = await web3.eth.getBalance(address);

    return Number(ethers.utils.formatUnits(balance));
  };

  const fetchTransactionCostInEther = async (
    estimateGas: number,
    numOfDecimals: number
  ) => {
    const transactionCostInGwei = estimateGas * Number(gasPrice.toFixed(2));
    const transactionCostInEther = formateAmount(
      transactionCostInGwei.toString(),
      9
    );
    return transactionCostInEther;
  };

  const sendTransaciton = async (
    selectedGasValue: string,
    NODE_URL: string,
    CHAIN_TX: any,
    COINGECKO_ID: string
  ) => {
    try {
      console.log({ amount, selectedGasValue });
      web3 = new Web3(new Web3.providers.HttpProvider(NODE_URL));
      console.log({ NODE_URL });

      const { recieverAddress, tokenAddress } = selectedToken;
      if (COINGECKO_ID === "ethereum") {
        common = new Common({ chain: CHAIN_TX });
      } else {
        common = Common.custom(CHAIN_TX);
      }

      let transactionObject: any;
      let { count } = await fetchGasPriceAndCount(network, address);

      const transactionsHashes = transactions[`${network}${address}`];

      console.log({ transactionsHashes });
      if (transactionsHashes) {
        console.log("no enter");
        count = count + transactionsHashes.length;
      }
      console.log(count, "count");
      let contract;
      let estimateGas: number = 0;
      let tokenSymbol =
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NATIVE_TOKEN_SYMBOL];
      let numOfDecimals;

      if (tokenAddress !== NATIVE_TOKEN_ADDRESS) {
        ({ contract, estimateGas, numOfDecimals, tokenSymbol } =
          await initializeContractAndFetchAmount(amount, address));
      } else {
        estimateGas = await web3.eth.estimateGas({ from: address });
        console.log({ estimateGas });
      }
      let makeTransaction = false;

      console.log("Upar WALA");

      let testnetProperty =
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN].isTestnet;
      console.log({ testnetProperty });

      transactionObject = {
        from: address,
        nonce: web3.utils.toHex(count),
        gasLimit: web3.utils.toHex(
          // estimateGas
          (testnetProperty
            ? tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
              ? 21000
              : 91000
            : tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
            ? 21000
            : estimateGas * 1.05
          ).toFixed()
        ), //increasing gas by 5 percent
        gasPrice: web3.utils.toHex(
          web3.utils.toWei(gasPrice.toString(), "gwei")
        ),
        to: recieverAddress,
      };
      console.log(
        "GASSSS ===== PRICE",
        gasPrice,
        web3.utils.toHex(web3.utils.toWei(gasPrice.toString(), "gwei"))
      );

      const userNativeBalance = await fetchUserNAtiveBalance(address);
      // const tokenAmountInWei = formateAmount(amount.toString(), decimals);

      let transactionCostInEther = await fetchTransactionCostInEther(
        testnetProperty
          ? tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
            ? 21000
            : 91000
          : tokenAddress.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
          ? 21000
          : estimateGas * 1.05, // change hogaaaaaaaaaa
        numOfDecimals
      );
      // if native
      if (tokenAddress === NATIVE_TOKEN_ADDRESS) {
        console.log("emtered here in cas eof native token");

        const totalAmount = +amount + Number(transactionCostInEther);

        if (userNativeBalance <= totalAmount) {
          console.log("detected by me");

          const deductedAmount =
            userNativeBalance - Number(transactionCostInEther);
          if (deductedAmount < 0) {
            alert("In sufficeint funds for gas");
          } else {
            transactionObject = {
              ...transactionObject,
              value: web3.utils.toHex(
                web3.utils.toWei(
                  deductedAmount.toString().slice(0, 18),
                  "ether"
                )
              ),
            };
            makeTransaction = true;
          }
        } else {
          makeTransaction = true;
          transactionObject = {
            ...transactionObject,
            value: web3.utils.toHex(
              web3.utils.toWei(amount.toString(), "ether")
            ),
          };
        }
      } else {
        if (userNativeBalance < Number(transactionCostInEther)) {
          console.log(userNativeBalance, transactionCostInEther);
          transactionObject = {
            ...transactionObject,
            gasLimit: web3.utils.toHex(91000),
            gasPrice: web3.utils.toHex(web3.utils.toWei("0.005", "gwei")),
          };
          makeTransaction = true;
          // alert("Insufficient Funds for gas");
        } else {
          makeTransaction = true;
        }
        console.log("not entered here in case of native token");
        let amountConverted = await convertBalanceToBaseUnit(
          contract,
          amount.toString()
        );
        console.log({ amountConverted });
        if (contract) {
          transactionObject = {
            ...transactionObject,
            data: contract.methods
              .transfer(recieverAddress, amountConverted)
              .encodeABI(),
            to: tokenAddress,
          };
        }
      }

      console.log("check =======>", { makeTransaction });
      if (makeTransaction) {
        const raw = await getTransactionRawData(
          transactionObject,
          common,
          address
        );
        console.log({ raw });

        const roughData = {
          transactionObject,
          common,
          chain,
          amount,
          network,
          tokenSymbol,
        };

        console.log({ roughData });

        await web3.eth
          .sendSignedTransaction(raw)

          .once("sent", (p) => {
            console.log("sent =========", p);
          })
          .once("transactionHash", (txHash) => {
            console.log("transactionHash=========", txHash);
            // alert("Transaction in Progress");

            if (network && address) {
              dispatch(
                addTransactions({
                  chain: `${network}${address}`,
                  hash: txHash,
                  rough: roughData,
                  TxType: "Sending",
                  nonce: transactionObject.nonce,
                  network: `${network}`,
                  address: address,
                })
              );

              dispatch(
                setRecentRecipient({
                  chain: chain,
                  recieverAddress: recieverAddress,
                })
              );
            }

            navigate("/index.html");
          })
          .once("receipt", (transactionReceipt) => {
            console.log("receipt on success========", transactionReceipt);

            // alert("Transaction Successful");

            dispatch(
              addSelectedToken({
                tokenName: "",
                tokenAmount: 0,
                tokenAddress: "",
                amount: 0,
                recieverAddress: "",
              })
            );
            dispatch(
              removeTransaction({
                chain: `${network}${transactionObject.from}`,
                hash: transactionReceipt.transactionHash,
                nonce: transactionObject.nonce,
              })
            );
            dispatch(
              setTransactionReceipt({
                open: true,
                status: transactionReceipt.status,
                transactionHash: transactionReceipt.transactionHash,
                blockNumber: transactionReceipt.blockNumber,
                from: transactionReceipt.from,
                to: transactionReceipt.to,
              })
            );
            dispatch(
              setCachedTransactions({
                hash: transactionReceipt.transactionHash,
                network: `${network}`,
                address: transactionReceipt.from,
              })
            );
            return transactionReceipt;
          })
          // .on("confirmation", (p) => {
          //   console.log(p);
          // })
          .once("error", (err) => {
            console.log("err", err);
            throw err;
          });
      }
    } catch (error: any) {
      console.log("error===", error);
      alert(error.message);
    }
  };

  const speedUpOrCancelTransaction = async (
    hash: string,
    rough: any,
    TxType: string,
    NODE_URL: string,
    method: string
  ) => {
    try {
      console.log("speedUpOrCancelTransaction", {
        hash,
        rough,
        TxType,
        NODE_URL,
        method,
      });

      const network = rough.network;

      const web3 = new Web3(new Web3.providers.HttpProvider(NODE_URL));

      let transactionReceipt = await web3.eth.getTransactionReceipt(hash);

      console.log("transactionReceipt", { transactionReceipt });

      let transactionObject = rough.transactionObject;

      dispatch(
        removeTransaction({
          chain: `${network}${transactionObject.from}`,
          hash: hash,
          nonce: transactionObject.nonce,
        })
      );

      if (!transactionReceipt) {
        const SPEEDUP_PERC = TxType === "Swapping" ? 3 : 1.5;
        const SPEEDUP_LIMIT = TxType === "Swapping" ? 1135000 : 91000;

        transactionObject = {
          ...transactionObject,
          gasLimit: web3.utils.toHex(SPEEDUP_LIMIT),
          gasPrice: web3.utils.toHex(
            web3.utils.toWei(
              (method === "speedup"
                ? gasPrice * SPEEDUP_PERC
                : gasPrice * 1.1
              ).toString(),
              "gwei"
            )
          ),
        };

        if (method === "cancel") {
          transactionObject.value = 0;
          let contract = new web3.eth.Contract(
            abi,
            "0x514910771AF9Ca656af840dff83E8264EcF986CA"
          );
          transactionObject.data = contract.methods
            .transfer(transactionObject.from, 0)
            .encodeABI();
        }

        const raw = await getTransactionRawData(
          transactionObject,
          rough.common,
          transactionObject.from
        );
        console.log({ raw });
        await web3.eth
          .sendSignedTransaction(raw)
          .once("sent", (p) => {
            console.log("speedup sent =========", p);
            removeTransaction({
              chain: `${network}${transactionObject.from}`,
              hash: "",
              nonce: transactionObject.nonce,
            });
          })
          .once("transactionHash", (txHash) => {
            console.log("speedup transactionHash=========", txHash);
            dispatch(
              addTransactions({
                chain: `${network}${transactionObject.from}`,
                hash: txHash,
                rough,
                TxType: TxType,
                nonce: transactionObject.nonce,
                network: `${network}`,
                address: transactionObject.from,
              })
            );

            dispatch(
              setRecentRecipient({
                chain: rough.chain,
                recieverAddress: transactionObject.to,
              })
            );

            navigate("/index.html");
            // alert("Transaction in Progress");
          })
          .once("receipt", (transactionReceipt: any) => {
            console.log(
              "speedup receipt on success========",
              transactionReceipt
            );

            // alert("Transaction Successful");
            dispatch(
              addSelectedToken({
                tokenName: "",
                tokenAmount: 0,
                tokenAddress: "",
                amount: 0,
                recieverAddress: "",
              })
            );
            dispatch(
              removeTransaction({
                chain: `${network}${transactionObject.from}`,
                hash: transactionReceipt.transactionHash,
                nonce: transactionObject.nonce,
              })
            );
            dispatch(
              setTransactionReceipt({
                open: true,
                status: transactionReceipt.status,
                transactionHash: transactionReceipt.transactionHash,
                blockNumber: transactionReceipt.blockNumber,
                from: transactionReceipt.from,
                to: transactionReceipt.to,
              })
            );
            dispatch(
              setCachedTransactions({
                hash: transactionReceipt.transactionHash,
                network: `${network}`,
                address: transactionObject.from,
              })
            );

            return transactionReceipt;
          })
          // .on("confirmation", (p) => {
          //   console.log(p);
          // })
          .once("error", (err) => {
            console.log("speedup err", err);
            throw err;
          });
      }
    } catch (error: any) {
      console.log("speedup error===", error);
      let transactionObject = rough.transactionObject;
      dispatch(
        removeTransaction({
          chain: `${rough.network}${transactionObject.from}`,
          hash: hash,
          nonce: transactionObject.nonce,
        })
      );
      alert(error.message);
    }
  };

  const getSolanaTransactionFees = async () => {
    try {
      let connection;
      console.log({ network });
      if (network === SupportedChainId.SOLANA_DEVNET) {
        connection = new Connection(clusterApiUrl(DEVNET), COMMITMENT);
      } else {
        connection = new Connection(clusterApiUrl(MAINNET), COMMITMENT);
      }
      console.log({ accountKeypairSolana });
      const newAccount = Keypair.fromSecretKey(accountKeypairSolana.secretKey);
      // console.log("publicKey secretKey", publicKey, accountKeypairSolana._keypair);

      // if (selectedToken.tokenAddress === SOLANA_ADDRESS) {
      const instructions = SystemProgram.transfer({
        fromPubkey: newAccount.publicKey,
        toPubkey: new PublicKey(selectedToken.recieverAddress),
        lamports: selectedToken.amount * 1000000000,
      });
      console.log("instructions", instructions);

      const transaction = new Transaction().add(instructions);

      let blockhash = await connection.getLatestBlockhash("finalized");
      transaction.recentBlockhash = blockhash.blockhash;

      transaction.feePayer = newAccount.publicKey;
      const response = await connection.getFeeForMessage(
        transaction.compileMessage(),
        "confirmed"
      );
      console.log(
        "response solana fees",
        blockhash,
        response,
        response.value / 1000000000
      );
      dispatch(selectGasFees(response.value / 1000000000));
    } catch (error) {
      console.log(error);
    }
  };

  const sendSolanaTransaction = async () => {
    try {
      let connection;
      console.log(
        +selectedToken.amount * 1000000000,
        selectedToken.amount,
        "solana Normal"
      );
      if (network === SupportedChainId.SOLANA_DEVNET) {
        connection = new Connection(clusterApiUrl(DEVNET), COMMITMENT);
      } else {
        connection = new Connection(clusterApiUrl(MAINNET), COMMITMENT);
      }

      const newAccount = Keypair.fromSecretKey(accountKeypairSolana.secretKey);
      const publicKey = newAccount.publicKey;
      const secretKey = newAccount.secretKey;
      let hash = "";
      if (selectedToken.tokenAddress === SOLANA_ADDRESS) {
        const instructions = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(selectedToken.recieverAddress),
          lamports: selectedToken.amount * 1000000000,
        });

        const transaction = new Transaction().add(instructions);

        const signers = [
          {
            publicKey,
            secretKey,
          },
        ];

        const confirmation = await sendAndConfirmTransaction(
          connection,
          transaction,
          signers
        );
        console.log("CONF=======", confirmation);
        hash = confirmation;
        dispatch(
          setRecentRecipient({
            chain: chain,
            recieverAddress: selectedToken.recieverAddress,
          })
        );
        dispatch(
          setCachedTransactions({
            hash: hash,
            network: `${network}`,
            address: publicKey.toString(),
            to: selectedToken.recieverAddress,
            amount: selectedToken.amount,
            tokenAddress: selectedToken.tokenAddress,
            gasFee: 0,
            timestamp: new Date().getTime(),
          })
        );

        alert(`Transaction confirmed`);
      } else {
        // let [address, decimals] = selectedAsset.split(":");
        let decimals = selectedToken.tokenDecimal;
        let address = selectedToken.tokenAddress;
        let USDC_pubkey = new PublicKey(address);
        // @ts-ignore
        let myToken = new splToken.Token(
          connection,
          USDC_pubkey,
          splToken.TOKEN_PROGRAM_ID,
          accountKeypairSolana
        );

        let fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
          publicKey
        );
        let toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
          new PublicKey(selectedToken.recieverAddress)
        );

        // //         // Create associated token accounts for my token if they don't exist yet
        const transaction = new Transaction().add(
          // @ts-ignore
          splToken.Token.createTransferInstruction(
            splToken.TOKEN_PROGRAM_ID,
            fromTokenAccount.address,
            toTokenAccount.address,
            publicKey,
            [],
            selectedToken.amount * 10 ** decimals
          )
        );

        // Sign transaction, broadcast, and confirm
        let signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [accountKeypairSolana]
        );

        hash = signature;
        dispatch(
          setRecentRecipient({
            chain: chain,
            recieverAddress: selectedToken.recieverAddress,
          })
        );
        dispatch(
          setCachedTransactions({
            hash: hash,
            network: `${network}`,
            address: publicKey.toString(),
            to: selectedToken.recieverAddress,
            amount: selectedToken.amount,
            tokenAddress: selectedToken.tokenAddress,
            gasFee: 0,
            timestamp: new Date().getTime(),
          })
        );

        alert(`Transaction confirmed`);
      }
      dispatch(
        setTransactionReceipt({
          open: true,
          status: true,
          transactionHash: hash,
          blockNumber: "0",
          from: publicKey.toString(),
          to: selectedToken.recieverAddress,
        })
      );

      const [title, message, link] = [
        "Transaction Succesfull",
        "your can see your confirmed transaction",
        `https://explorer.solana.com/tx/${hash}${
          network === SupportedChainId.SOLANA_DEVNET && "?cluster=devnet"
        }`,
      ];
      generateNotification(title, message, link);
      navigate("/index.html");
    } catch (error) {
      console.log(error);
      const [title, message] = ["Transaction Failed", ""];
      alert("you have must some amount left in your solana account");
      generateNotification(title, message);
      navigate("/index.html");
    }
  };

  const sendNearTransaction = async (network: number, amount: number) => {
    try {
      network =
        network === SupportedChainId.NEAR ? SupportedChainId.NEAR : network;
      let chain = network === SupportedChainId.NEAR ? NEAR : NEAR_TESTNET;

      const accountID = address;
      const addressWithSecretKeys = await getChainAddressWithSecretKeys(chain);

      const secret =
        addressWithSecretKeys[address as keyof typeof addressWithSecretKeys];

      const keyStore = new keyStores.BrowserLocalStorageKeyStore();

      const keyPair = KeyPair.fromString(secret);
      await keyStore.setKey(
        CONFIG[network as keyof typeof CONFIG][NETWORK_ID],
        accountID,
        keyPair
      );

      const configuration = CONFIG[network as keyof typeof CONFIG];

      // @ts-ignore
      const near = await connect({ ...configuration, keyStore });
      const senderAccount = await near.account(accountID);

      const yoctoAmount = parseNearAmount(amount.toString()) as string;

      const convertedAmount = new BN(yoctoAmount);

      if (tokenAddress !== NEAR_ADDRESS) {
        let transfer = await senderAccount.functionCall(
          tokenAddress,
          "ft_transfer",
          {
            amount: (amount * 10 ** tokenDecimal).toString(),
            receiver_id: recieverAddress,
          },
          // @ts-ignore
          FT_TRANSFER_GAS,
          FT_TRANSFER_DEPOSIT
        );
        console.log("HASH========", transfer);
      } else {
        console.log("NEAR TRANSFER");
        const transaction = await senderAccount.sendMoney(
          recieverAddress,
          convertedAmount
        );

        const response = await near.connection.provider.txStatus(
          transaction.transaction.hash,
          nearAccountId
        );

        const status = response.transaction_outcome.outcome.status as {
          SuccessReceiptId: string;
        };
        if (status.SuccessReceiptId) {
          const [title, message, link] = [
            "Transaction Succesfull",
            "you can see your confirmed transaction",
            `${NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][SCAN_LINK]}/${
              transaction.transaction.hash
            }`,
          ];
          generateNotification(title, message, link);

          dispatch(
            setRecentRecipient({
              chain: chain,
              recieverAddress: recieverAddress,
            })
          );

          dispatch(
            setTransactionReceipt({
              open: true,
              status: status.SuccessReceiptId.length > 0 ? true : false,
              transactionHash: transaction.transaction.hash,
              blockNumber: "-",
              from: response.transaction.signer_id,
              to: response.transaction.receiver_id,
            })
          );
          dispatch(
            setCachedTransactions({
              hash: transaction.transaction.hash,
              network: `${network}`,
              address: response.transaction.signer_id,
              timestamp: new Date().getTime(),
            })
          );
        }

        navigate("/index.html");

        dispatch(
          addSelectedToken({
            tokenName: "",
            tokenAmount: 0,
            tokenAddress: "",
            amount: 0,
            recieverAddress: "",
          })
        );
      }
      alert("Transaction Successful");
    } catch (error: any) {
      console.log("error===", error.message);
      if (isStringIncludesTheValue(error.message, "enough balance")) {
        const [title, message] = [
          "Transaction Failed",
          "you Need to send more near to this address",
        ];
        generateNotification(title, message);
        navigate("/index.html");
      }
    }
  };

  return {
    sendTransaciton,
    sendNearTransaction,
    sendSolanaTransaction,
    getSolanaTransactionFees,
    speedUpOrCancelTransaction,
  };
};
