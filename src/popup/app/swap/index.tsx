/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import BigNumber from "bignumber.js";
// import { BigNumber } from "@0x/utils"; // old one in case above not works
import Common from "@ethereumjs/common";
import { useNavigate } from "react-router";

import { Gear, UpArrow } from "assets/Icons";
import { Bnb } from "assets/images";
import {
  AccountSelectionModal,
  AdvanceOptionModal,
  ButtonBox,
  SwapTokenBox,
  TokenPanelModal,
  TransactionFee,
  TopLayoutComponent,
} from "components";
import { AdvanceButtonStyled, ImageContent, SwapWrapperStyled } from "@styled";
import { RootState, TokenHistory } from "interfaces";
import {
  calculateGasSpeed,
  checkAllowance,
  checkIfReflectToken,
  formateAmount,
  getGasPrice,
  getSwapContractAdressAndContract,
  getSwapTokens,
  getTransactionRawData,
  initializeTokenContract,
  tokenSwapWithout0xApi,
} from "utils";
import {
  BITQUERY_NETWORK,
  CHAIN_TX,
  FAST,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_NAME,
  NATIVE_TOKEN_SYMBOL,
  NETWORKCHAIN,
  NODE_URL,
  RECEIVE,
  SEND,
  SLOW,
  SupportedChainId,
  SWAP_EXPIRATION_TIME,
} from "utils/constants";
import { generateNotification } from "@constants";
import {
  addSelectedToken,
  addTransactions,
  selectGasFees,
  setSwapTransactionTime,
  setTransactionReceipt,
  setCachedTransactions,
  removeTransaction,
} from "@slices/sendTransaction";
import { setToTokens, swap as SWAP_STATE } from "@slices/walletSlice";
import { checkTransactionReceipt } from "@slices/walletSlice/wallet.actions";

const { abi } = require("abis/erc20abi.json");

let web3: Web3;

const Swap = () => {
  /* global-state */
  const { tokensHistory, swap, nativeTokenPrice, chain } = useSelector(
    (state: RootState) => state.wallet
  );
  const { transactions, slippage, gasSpeed, selectedToken } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const { usdAmount, address, tokenNetwork: network } = selectedToken;

  /* local-state */
  const [open, setOpen] = useState(false);
  const [tokenPanel, setTokenPanel] = useState(false);
  const [isSendModal, setSendModal] = useState(true);
  const [isSwap, setIsSwap] = useState(false);
  const [deductedAmount, setDeductedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [accountSelectionModal, setAccountSelectionModal] = useState(false);
  // const openAccountModal = () => setAccountSelectionModal(true);
  const [gasAverages, setGasAverages] = useState({
    safeLow: 0,
    average: 0,
    fast: 0,
    avgWait: 0,
    fastWait: 0,
    safeLowWait: 0,
  });
  const [gasPrice, setGasPrice] = useState(0);
  const [userToken, setUserToken] = useState({
    tokenName: "Select Token",
    tokenBalance: 0,
    tokenBalanceInUsd: 0,
    tokenAddress: "",
    tokenDecimal: 0,
  });
  const [swapToken, setSwapToken] = useState({
    tokenName: "Select Token",
    tokenBalance: 0,
    tokenBalanceInUsd: 0,
    tokenAddress: "",
    tokenDecimal: 0,
  });
  const [toTokens, settoTokens] = useState<TokenHistory>({});
  const [fromToken, setFromToken] = useState(0);
  const [swapAmount, setSwapAmount] = useState(0);
  const [swapList, setSwapList] = useState<TokenHistory>({});
  const [common, setCommon] = useState<Common>();
  const [gasOptionIndex, setGasOptionIndex] = useState(1);
  const [slippageOptionIndex, setSlippageOptionIndex] = useState(0);
  const [transactionPrice, setTransactionPrice] = useState(0);

  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* functions */
  // const openAccountModal = () => setAccountSelectionModal(true);

  const closeAccountModal = () => setAccountSelectionModal(false);

  const openTokenPanel = () => setTokenPanel(true);

  const closeTokenPanel = () => setTokenPanel(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const filterSwapTokenList = useCallback(
    (tokens: TokenHistory) => {
      let filteredList: TokenHistory = {};
      let currentChainToken = {};
      Object.keys(tokens).forEach((chainNumber) => {
        if (NETWORKCHAIN[+chainNumber as keyof typeof NETWORKCHAIN].isSwap) {
          currentChainToken = {
            [chainNumber]: tokens[+chainNumber as keyof typeof tokens],
          };
          Object.assign(filteredList, currentChainToken);
        }
      });
      setSwapList(filteredList);
    },
    [tokensHistory]
  );

  const calculateGasData = useCallback(async () => {
    const { avgWait, fastWait, safeLowWait } = await calculateGasSpeed(
      userToken.tokenAddress,
      web3,
      address,
      network
    );
    setGasAverages((prevState) => ({
      ...prevState,
      avgWait,
      fastWait,
      safeLowWait,
    }));

    dispatch(setSwapTransactionTime(avgWait));

    dispatch(
      checkTransactionReceipt(
        web3,
        transactions[`${network}${address}`],
        network,
        address
      )
    );
  }, []);

  const calculateGasFess = (gasInGwei: string, gasPriceInWei: string) => {
    const gasPriceInGwei = web3.utils.fromWei(gasPriceInWei, "gwei");
    const transactionCostInGwei = +gasInGwei * +gasPriceInGwei;

    const estimatedFeesInNativeCurrency = formateAmount(
      transactionCostInGwei.toString(),
      9
    );
    const estimatedGasFeesInDollar =
      nativeTokenPrice * Number(estimatedFeesInNativeCurrency);
    return estimatedGasFeesInDollar;
  };

  const adjustNativeTokenAmountForGasFunds = useCallback(
    async (
      fromToken: number,
      estimatedPriceInDollar: number,

      userToken: {
        tokenName: string;
        tokenBalance: number;
        tokenBalanceInUsd: number;
        tokenAddress: string;
        tokenDecimal: number;
      },
      setDeductedAmount: React.Dispatch<React.SetStateAction<number>>,
      isNativeToken: Boolean,
      setTransactionPrice: React.Dispatch<React.SetStateAction<number>>,
      transactionPrice: number
    ) => {
      if (fromToken > 0) {
        const transactionCostInEther =
          estimatedPriceInDollar / nativeTokenPrice;
        // setTransactionPrice(+gasPrice + userToken.tokenBalanceInUsd);

        let totalAmount = 0;
        if (isNativeToken) {
          totalAmount = +fromToken + transactionCostInEther;
          console.log(totalAmount, "total amount");
          if (+totalAmount > userToken.tokenBalance) {
            setDeductedAmount(transactionCostInEther);
            // setTransactionPrice(transactionPrice - estimatedPriceInDollar);
            setIsSwap(true);
          } else {
            setIsSwap(true);
          }
        } else {
          const userNativeBalance = 10;
          // ---stop
          if (userNativeBalance < transactionCostInEther) {
            console.log(
              userNativeBalance,
              transactionCostInEther,
              "check these"
            );
            setIsSwap(false);
            alert("Insufficient funds for gas");
          } else {
            setIsSwap(true);
          }
        }
        console.log(
          "gasPriceInGwei",

          transactionCostInEther
        );
      }
    },
    []
  );

  const onTopImageClick = () => navigate("/index.html");

  const filterSwapTokens = useCallback(
    (tokens) => {
      let buysTokens: TokenHistory = {};
      console.log({ the: tokens });
      let toTokens = tokens.sort(
        (a: { symbol: number }, b: { symbol: number }) =>
          a.symbol > b.symbol ? 1 : b.symbol > a.symbol ? -1 : 0
      );

      if (userToken.tokenAddress) {
        toTokens = toTokens.filter((tk: any) => {
          return tk.address !== userToken.tokenAddress;
        });
      }

      toTokens.forEach((value: any) => {
        if (buysTokens[network as keyof typeof buysTokens] !== undefined) {
          buysTokens = {
            [network]: {
              ...buysTokens[network as keyof typeof buysTokens],
              [`${value.name}_${value.address}_${value.symbol}`]: {
                tokenBalance: 0,
                priceInUSD: 0,
                tokenAddress: value.address,
                tokenDecimal: value.decimals,
                tokenName: value.name,
                tokenSymbol: value.symbol,
                image: "",
                accounts: {
                  "0x12": {
                    tokenBalance: 0,
                    priceInUSD: 0,
                  },
                },
              },
            },
          };
        } else {
          buysTokens = {
            [network]: {
              [`${value.name}_${value.address}_${value.symbol}`]: {
                tokenBalance: 0,
                priceInUSD: 0,
                tokenAddress: value.address,
                tokenDecimal: value.decimals,
                tokenName: value.name,
                tokenSymbol: value.symbol,
                image: "",
                accounts: {
                  "0x12": {
                    tokenBalance: 0,
                    priceInUSD: 0,
                  },
                },
              },
            },
          };
        }
      });

      console.log("MY TO TOKENS LIST", { buysTokens, network, toTokens });
      return { toTokens: buysTokens };
    },
    [userToken.tokenAddress, swapToken]
  );

  const handleSwap = async () => {
    if (!loading && userToken.tokenAddress && swapToken.tokenAddress) {
      if (fromToken <= userToken.tokenBalance) {
        setLoading(true);
        const transactionAmount = fromToken - deductedAmount;
        if (transactionAmount < 0) {
          alert("InSufficient funds for gas");
        } else {
          let { routerV2, newData, isReflection, data } =
            await getSwapContractAdressAndContract(
              swapToken.tokenAddress,
              userToken.tokenAddress,
              network,
              web3,
              fromToken - deductedAmount,
              address
            );
          const { allowance, contract } = await checkAllowance(
            web3,
            abi,
            address,
            userToken.tokenAddress,
            newData.to
          );
          if (
            !Number(allowance) &&
            userToken.tokenAddress !== NATIVE_TOKEN_ADDRESS
          ) {
            await giveApproval(contract, newData.to);
          }

          if (data === 400) {
            const transactionObject = await tokenSwapWithout0xApi(
              userToken.tokenAddress,
              swapToken.tokenAddress,
              fromToken,
              web3,
              transactions,
              address,
              newData.to,
              network,
              routerV2
            );
            await sendSignTransaction(transactionObject);
          } else {
            console.log({ data });

            let count = await web3.eth.getTransactionCount(address);
            let transactionData: {
              to: string;
              from?: string;
              value?: string;
              nonce?: string;
              gasPrice?: string;
              gasLimit?: string;
              data?: any;
            } = newData;
            // const tempGasPrice = data.gasPrice + 500;
            console.log({ gasAverages });
            let GAS_PRICE = parseInt(data.gasPrice);
            const safeLowPrice = GAS_PRICE - 1000000000;
            const fastPrice = GAS_PRICE + 5000000000;
            const transactionGasPrice =
              gasSpeed === FAST
                ? fastPrice
                : gasSpeed === SLOW
                ? safeLowPrice
                : GAS_PRICE;
            transactionData = {
              ...transactionData,
              from: address,
              value: web3.utils.toHex(data.value),
              nonce: "0x" + count.toString(16),
              gasPrice: web3.utils.toHex(transactionGasPrice),
              // gasPrice: web3.utils.toHex(
              //   web3.utils.toWei(gasPrice.toFixed(2), "gwei")
              // ),
              gasLimit: web3.utils.toHex(Number(data.gas * 1.05).toString()), //increasing gas by 5 percent
              // gasLimit: web3.utils.toHex(data.gas.toString()),
            };
            if (isReflection) {
              console.log("In reflection token if block");
              let tkPath = [...data.orders[0].fillData.tokenAddressPath];
              console.log(tkPath, "transaction");
              if (
                userToken.tokenAddress.toLowerCase() ===
                NATIVE_TOKEN_ADDRESS.toLowerCase()
              ) {
                console.log("IFFFFFFFFFFFFFFF");
                console.log(parseInt(data.buyAmount));
                // @ts-ignore
                transactionData.data = await routerV2.methods
                  .swapExactETHForTokens(
                    data.buyAmount.toString(),
                    tkPath,
                    address,
                    SWAP_EXPIRATION_TIME
                  )
                  .encodeABI();
              } else {
                console.log("ELSEEEEEEEEEEEEEEEEEEEE");
                const FromTokenContract = initializeTokenContract(
                  userToken.tokenAddress,
                  web3
                );
                if (
                  swapToken.tokenAddress.toLowerCase() ===
                    NATIVE_TOKEN_ADDRESS &&
                  (await checkIfReflectToken(FromTokenContract))
                ) {
                  transactionData.data = await routerV2?.methods
                    .swapExactTokensForETHSupportingFeeOnTransferTokens(
                      data.sellAmount,
                      (Number(data.buyAmount) * 0.1).toFixed(),

                      tkPath,
                      address,
                      SWAP_EXPIRATION_TIME
                    )
                    .encodeABI();
                } else if (await checkIfReflectToken(FromTokenContract)) {
                  console.log("FROM REFLECTION HAIIIIIIIIIIIIIIIIII");
                  // transactionData.gasLimit = web3.utils.toHex("1135000");
                  // @ts-ignore

                  transactionData.data = await routerV2.methods
                    .swapExactTokensForTokensSupportingFeeOnTransferTokens(
                      data.sellAmount,
                      (Number(data.buyAmount) * 0.1).toFixed(),

                      tkPath,
                      address,
                      SWAP_EXPIRATION_TIME
                    )
                    .encodeABI();
                } else {
                  // @ts-ignore
                  transactionData.data = await routerV2.methods
                    .swapExactTokensForTokens(
                      data.sellAmount,
                      (+data.buyAmount * 0.1).toString(),
                      tkPath,
                      address,
                      SWAP_EXPIRATION_TIME
                    )
                    .encodeABI();
                }
              }
              console.log({ transactionData, newData });
              await sendSignTransaction(transactionData);
            } else {
              console.log(
                "Send txn from reflectionFalse block transactionData & data==",
                transactionData
              );
              // data.buyAmount = (+data.buyAmount * 0.1).toString();

              await sendSignTransaction(Object.assign(data, transactionData));
            }
          }
        }

        setLoading(false);
      } else {
        alert("You don't have enough tokens to swap");
      }
    }
  };

  const giveApproval = async (contract: any, router: string) => {
    try {
      console.log("I AM IN GIVE APPROVAL FUNCTION");

      const maxApproval = new BigNumber(2).pow(256).minus(1);
      let estimateGas = await contract.methods
        .approve(router, maxApproval.toString())
        .estimateGas({ from: address });
      let count = await web3.eth.getTransactionCount(address);
      let currentGasPrice = await getGasPrice(network);
      let gas_price = currentGasPrice.fast;
      let transactionObject = {
        from: address,
        nonce: web3.utils.toHex(count),
        gasLimit: web3.utils.toHex(estimateGas),
        gasPrice: web3.utils.toHex(
          web3.utils.toWei(gas_price.toString(), "gwei")
        ),
        to: userToken.tokenAddress,
        data: contract.methods
          .approve(router, maxApproval.toString())
          .encodeABI(),
      };

      const raw = await getTransactionRawData(
        transactionObject,
        common,
        address
      );
      console.log(raw, "raw===========================");
      await web3.eth.sendSignedTransaction(raw);

      console.log("approve mil gfya");
    } catch (error) {
      console.log(error);
    }
  };

  const sendSignTransaction = async (data: any) => {
    // const raw = await getTransactionRawData(
    //   data,
    //   common,
    //   chain,
    //   walletNumber,
    //   accountNumber
    // );

    const raw = await getTransactionRawData(data, common, address);

    //spend
    const takerTokenContract = new web3.eth.Contract(
      abi,
      data.orders[0].takerToken
    );
    const takerTokenSymbol = await takerTokenContract.methods.symbol().call();
    const takerTokenDecimals = await takerTokenContract.methods
      .decimals()
      .call();
    const takerAmount = data.orders[0].takerAmount / 10 ** takerTokenDecimals;

    //receive
    const makerTokenContract = new web3.eth.Contract(
      abi,
      data.orders[0].makerToken
    );
    const makerTokenSymbol = await makerTokenContract.methods.symbol().call();
    const makerTokenDecimals = await makerTokenContract.methods
      .decimals()
      .call();
    const makerAmount = data.orders[0].makerAmount / 10 ** makerTokenDecimals;

    const roughData = {
      transactionObject: data,
      common,
      chain,
      network,
      takerTokenSymbol,
      takerAmount,
      makerTokenSymbol,
      makerAmount,
    };

    let transactionHash = "";
    await web3.eth
      .sendSignedTransaction(raw)
      .once("sent", (p) => {
        console.log("sent", p);
      })
      .once("transactionHash", async (txHash) => {
        console.log("transactionHash", txHash);

        dispatch(
          addTransactions({
            chain: `${network}${address}`,
            hash: txHash,
            rough: roughData,
            TxType: "Swapping",
            nonce: data.nonce,
            network: `${network}`,
            address: address,
          })
        );

        navigate("/index.html");
      })
      .once("receipt", (transactionReceipt: any) => {
        setLoading(false);
        console.log(
          "---============--------TRANSACTION---------RECEIPT--=========",
          transactionReceipt
        );
        console.log(
          "SWAP SUCCESS=====================##########===============######=="
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
        console.log(transactionReceipt, "transactionReceipt");

        dispatch(
          removeTransaction({
            chain: `${network}${data.from}`,
            hash: transactionReceipt.transactionHash,
            nonce: data.nonce,
          })
        );

        sessionStorage.clear();
        // removeItemFromLocalStorage(network, address); chnage hoga
        dispatch(SWAP_STATE(!swap));
        return transactionReceipt;
      })
      .once("error", async (err) => {
        console.log("err===", err);

        console.log("err=================", err.message, transactionHash);
        const [title, message] = [
          "Transaction Failed",
          `${err.message}` || "your transaction has failed,check your funds",
        ];
        generateNotification(title, message);
        setLoading(false);
        throw err;
      });
  };

  /* effects */
  useEffect(() => {
    filterSwapTokenList(tokensHistory);
  }, []);

  useEffect(() => {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL]
      )
    );
    if (
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][BITQUERY_NETWORK] ===
      "ethereum"
    ) {
      let COMMON = new Common({
        chain: NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][CHAIN_TX],
      });
      setCommon(COMMON);
    } else {
      let COMMON = Common.custom(
        // @ts-ignore
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][CHAIN_TX]
      );
      setCommon(COMMON);
    }
    calculateGasData();
  }, [network, address, slippage]);

  useEffect(() => {
    dispatch(addSelectedToken({ tokenAddress: "", address: "" }));
  }, []);

  useEffect(() => {
    if (fromToken === 0) {
      setSwapToken({
        ...swapToken,
        tokenBalance: 0,
        tokenBalanceInUsd: 0,
      });
    }

    setFromToken(0);
    setSwapAmount(0);
    setSwapToken({
      ...swapToken,
      tokenBalance: 0,
    });
  }, [userToken.tokenAddress]);

  useEffect(() => {
    (async () => {
      const tokens = await getSwapTokens(network);

      let buyTokens = tokens;
      if (
        buyTokens.filter(
          (e: any) =>
            e.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase()
        ).length === 0
      ) {
        if (
          network !== SupportedChainId.SOLANA_DEVNET &&
          network !== SupportedChainId.NEAR_TESTNET &&
          network !== SupportedChainId.NEAR
        ) {
          buyTokens.unshift({
            name: NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
              NATIVE_TOKEN_NAME
            ],
            symbol:
              NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                NATIVE_TOKEN_SYMBOL
              ],
            address: NATIVE_TOKEN_ADDRESS,
            decimals: 18,
          });
        }
      }

      const { toTokens } = filterSwapTokens(buyTokens);

      settoTokens(toTokens);

      dispatch(setToTokens(toTokens));
      if (userToken.tokenAddress === swapToken.tokenAddress) {
        setSwapToken({
          tokenName: "Select Token",
          tokenBalance: 0,
          tokenBalanceInUsd: 0,
          tokenAddress: "",
          tokenDecimal: 0,
        });
      }
    })();
  }, [network, userToken]);

  useEffect(() => {
    if (gasSpeed === "Fast") setGasPrice(gasAverages.fast);
    else if (gasSpeed === "Slow") setGasPrice(gasAverages.safeLow);
    else setGasPrice(gasAverages.average);
  }, [gasAverages]);

  useEffect(() => {
    setTransactionPrice(userToken.tokenBalanceInUsd - deductedAmount);
  }, [deductedAmount]);

  useEffect(() => {
    (async () => {
      const singleFromTokenPrice = +usdAmount / userToken.tokenBalance;
      const tokenBalanceInUsd = singleFromTokenPrice * fromToken;
      console.log({
        tokenBalanceInUsd,
        singleFromTokenPrice,
        fromToken,
        message: "usdamount",
        usdAmount,
      });
      setUserToken({
        ...userToken,
        tokenBalanceInUsd,
      });
      console.log(usdAmount, "getTotalTokenBalanceInUsd");
      if (web3 && userToken.tokenAddress && swapToken.tokenAddress) {
        if (fromToken > 0) {
          const { isReflection, data } = await getSwapContractAdressAndContract(
            swapToken.tokenAddress,
            userToken.tokenAddress,
            network,
            web3,
            fromToken,
            address
          );
          ///=================================================gas
          console.log("AT GAS PRICE");

          let GAS_PRICE = parseInt(data.gasPrice);
          const safeLowPrice = GAS_PRICE - 1000000000;
          const fastPrice = GAS_PRICE + 5000000000;
          //till here wei add kardia 0x ka gas Price mai according to fast and slow

          const average = calculateGasFess(data.gas, data.gasPrice);
          const safeLow = calculateGasFess(data.gas, safeLowPrice.toString());
          const fast = calculateGasFess(data.gas, fastPrice.toString());
          setGasAverages({
            ...gasAverages,
            average,
            safeLow,
            fast,
          });
          let estimatedPrice = 0;
          if (gasSpeed === "Fast") {
            estimatedPrice = fast;
          } else if (gasSpeed === "Slow") {
            estimatedPrice = safeLow;
          } else {
            estimatedPrice = average;
          }
          setGasPrice(estimatedPrice);
          setTransactionPrice(estimatedPrice + tokenBalanceInUsd);

          dispatch(selectGasFees(estimatedPrice));
          console.log(average, "the average", tokenBalanceInUsd);
          setTransactionPrice(estimatedPrice + tokenBalanceInUsd);

          ///////////////////////////////==========================================================================
          if (userToken.tokenAddress === NATIVE_TOKEN_ADDRESS) {
            await adjustNativeTokenAmountForGasFunds(
              fromToken,
              estimatedPrice,

              userToken,
              setDeductedAmount,
              true,
              setTransactionPrice,
              transactionPrice
            );
          } else
            await adjustNativeTokenAmountForGasFunds(
              fromToken,
              estimatedPrice,

              userToken,
              setDeductedAmount,
              false,
              setTransactionPrice,
              transactionPrice
            );
          console.log(isReflection, "isReflection", deductedAmount);
          if (data !== 400) {
            const tokenAmount =
              parseInt(data.buyAmount) / Math.pow(10, swapToken.tokenDecimal);

            console.log(data, "data000999", tokenAmount);
            setSwapAmount(tokenAmount);
            setSwapToken({
              ...swapToken,

              tokenBalanceInUsd: singleFromTokenPrice * fromToken,
            });
          }
        }
      }
    })();
  }, [fromToken, userToken.tokenAddress, swapToken.tokenAddress, gasSpeed]);

  return (
    <SwapWrapperStyled>
      <TopLayoutComponent
        text="Swap Tokens"
        TopImage={`${UpArrow}`}
        onTopImageClick={onTopImageClick}
        isBackgroundImage={true}
      />
      <SwapTokenBox
        value={fromToken}
        setValue={setFromToken}
        title={SEND}
        tokenName={userToken.tokenName}
        amountInUsd={userToken.tokenBalanceInUsd || 0}
        nativeAmount={userToken.tokenBalance || 0}
        tokenImageSrc={Bnb}
        handleClick={() => {
          setSendModal(true);
          openTokenPanel();
        }}
        isPulsate={loading ? true : false}
      />
      <SwapTokenBox
        value={swapAmount}
        setValue={setSwapAmount}
        title={RECEIVE}
        tokenName={swapToken.tokenName}
        amountInUsd={swapToken.tokenBalanceInUsd || 0}
        nativeAmount={swapToken.tokenBalance || 0}
        handleClick={() => {
          if (userToken.tokenAddress) {
            setSendModal(false);
            openTokenPanel();
          }
        }}
        isPulsate={loading ? true : false}
      />
      {/* <SwapTokenBox
        title={FROM}
        tokenName="Account 1"
        value={0}
        setValue={() => {}}
        amountInUsd={3577}
        nativeAmount={1.3}
        tokenImageSrc={AccountImage}
        handleClick={openAccountModal}
        isPulsate={loading ? true : false}
      /> */}

      <TransactionFee
        gasPrice={gasPrice}
        loading={loading}
        transactionPrice={transactionPrice}
        isShowTitle={true}
        modalProps={{
          gasPrice: gasAverages,
          open,
          handleClose: () => {},
          hideSlippage: true,
          gasOptionIndex,
          setGasOptionIndex,
          slippageOptionIndex,
          setSlippageOptionIndex,
        }}
      />
      <AdvanceButtonStyled
        onClick={handleOpen}
        width={180}
        style={{ marginLeft: "auto", marginTop: "20px", marginBottom: "50px" }}
      >
        Advanced options
        <ImageContent
          src={Gear}
          style={{ width: "16px", height: "16px", marginLeft: "8px" }}
        />
      </AdvanceButtonStyled>
      <ButtonBox
        title="SWAP"
        customColor=" linear-gradient(91.34deg, #E7C9FF 0%, #D8FFC7 100%)"
        marginTop={10}
        textColor="black"
        customStyle={{
          fontWeight: "600",
          cursor: "pointer",
          color: "black !important",
        }}
        handleClick={() => {
          if (isSwap) handleSwap();
        }}
        isPulsate={loading ? true : false}
      />
      <AdvanceOptionModal
        gasPrice={gasAverages}
        open={open}
        handleClose={handleClose}
        gasOptionIndex={gasOptionIndex}
        setGasOptionIndex={setGasOptionIndex}
        slippageOptionIndex={slippageOptionIndex}
        setSlippageOptionIndex={setSlippageOptionIndex}
        setGasPrice={setGasPrice}
      />
      <TokenPanelModal
        open={tokenPanel}
        handleClose={closeTokenPanel}
        isSwap={true}
        setToken={isSendModal ? setUserToken : setSwapToken}
        tokensHistory={isSendModal ? swapList : toTokens}
        isShow={isSendModal}
        setFromToken={setFromToken}
      />
      <AccountSelectionModal
        open={accountSelectionModal}
        handleClose={closeAccountModal}
        tokensHistory={swapList}
      />
    </SwapWrapperStyled>
  );
};

export default Swap;
// tokensHistory={isSendModal ? tokensHistory : toTokens.slice(0, 10)}
