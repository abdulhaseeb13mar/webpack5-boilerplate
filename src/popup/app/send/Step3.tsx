/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import _ from "lodash";
import { connect } from "near-api-js";
import { faLoveseat } from "@fortawesome/pro-light-svg-icons";
import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import millify from "millify";

import { Bnb, RecieveSVG } from "assets/images";
import {
  GenericBackgroundBox,
  ImageContent,
  SearchLayout,
  Step3WrapperStyled,
  StyledAmountInput,
  Text,
} from "@styled";
import { TransactionFee } from "components";
import { RootState, Step3Props as PROPS, USERINFO } from "interfaces";
import {
  calculateGasSpeed,
  fetchBalance,
  fetchUsdRate,
  getGasPrice,
} from "utils";
import {
  ACCOUNTS,
  CHAINS,
  CHAIN_TX,
  COINGECKO_ID,
  CONFIG,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NETWORKCHAIN,
  NODE_URL,
  SupportedChainId,
} from "utils/constants";
import { useGasPrice } from "hooks/getGasPrice";
import { useTransaction } from "hooks/sendTransaction";
import {
  addSelectedToken,
  selectGasFees,
  setSendTransactionPrice,
  setGasPrice as SET_GAS_PRICE,
} from "@slices/sendTransaction";
import { checkTransactionReceipt } from "@slices/walletSlice/wallet.actions";
import { truncateAddress } from "background-related/lib/utils";
import { getStorageSyncValue } from "@constants";

const { abi } = require("abis/erc20abi.json");

const Step3: FC<PROPS> = ({ setStep }) => {
  /* global-state */
  let web3: Web3;
  const {
    selectedToken,
    selectedGasValue,
    sendTransactionPrice,
    transactions,
  } = useSelector((state: RootState) => state.sendTransaction);
  const {
    tokenAmount,
    tokenName,
    recieverAddress,
    tokenAddress,
    amount: AMOUNT,
    tokenNetwork: network,
    address,
    usdAmount,
    multiAccountExist,
    walletName,
    accountName,
  } = selectedToken;

  /* local-state */
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [gasPrice, setGasPrice] = useState({
    safeLow: 0,
    average: 0,
    fast: 0,
    avgWait: 0,
    fastWait: 0,
    safeLowWait: 0,
  });
  const [gasOptionIndex, setGasOptionIndex] = useState(1);
  const [slippageOptionIndex, setSlippageOptionIndex] = useState(0);
  const [tokenPriceInUsd, setTokenPrice] = useState(0);
  const [alertMessage, setALert] = useState({
    message: "Insufficient funds",
    open: false,
  });

  /* hooks */
  const { getSolanaTransactionFees } = useTransaction();
  const dispatch = useDispatch();
  const { getNearChainGasPrice, checkInsufficientGasFunds } = useGasPrice();
  const { sendTransaciton, sendNearTransaction, sendSolanaTransaction } =
    useTransaction();

  /* functions */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let amount: any = event.target.value.trim();
    if (_.isNumber(parseFloat(amount)) && !isNaN(amount)) {
      setALert({
        message: "",
        open: false,
      });
      // if (amount < tokenAmount) {
      const transactionPrice = amount * tokenPriceInUsd + +selectedGasValue;

      dispatch(setSendTransactionPrice(transactionPrice));

      dispatch(addSelectedToken({ amount }));
      setValue(amount);
      // } else {
      //   // alert("Amount should be less than token amount");
      //   setValue(amount);
      // }
    }
  };

  const checkReceiverBalance = async () => {
    try {
      // @ts-ignore
      let near = await connect(CONFIG[network]);
      const account = await near.account(recieverAddress);
      console.log(account, "account");
      const availableBalance = await fetchBalance(account);
      if (availableBalance > 0.001) {
        return true;
      } else return faLoveseat;
    } catch (error) {
      console.log(error, "error");
      if (+value > 0.001) return true;
      else return false;
    }
  };

  const handleTransaction = async () => {
    if (parseFloat(value) > 0) {
      if (AMOUNT <= tokenAmount) {
        if (
          network === SupportedChainId.NEAR ||
          network === SupportedChainId.NEAR_TESTNET
        ) {
          if (await checkReceiverBalance()) {
            if (await checkInsufficientGasFunds()) {
              console.log("now my transaction should execute");

              await sendNearTransaction(network, AMOUNT);
            }
          } else {
            alert("Send atleat more than 0.001");
          }
        } else {
          if (
            network === SupportedChainId.SOLANA_DEVNET ||
            network === SupportedChainId.SOLANA_MAINNET
          ) {
            await sendSolanaTransaction();
          } else {
            await SendTransactionFunction();
          }
        }
      } else {
        setALert({
          message: "Insufficient funds",
          open: true,
        });
      }
    } else {
      alert("Please enter amount");
    }
  };

  async function SendTransactionFunction() {
    await sendTransaciton(
      selectedGasValue,
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL],
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][CHAIN_TX],
      NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][COINGECKO_ID]
    );
  }

  /* effects */
  useEffect(() => {
    web3 = new Web3(
      new Web3.providers.HttpProvider(
        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL]
      )
    );

    const singleFromTokenPrice = usdAmount / +tokenAmount;
    setTokenPrice(singleFromTokenPrice);
    (async () => {
      let userExists = (await getStorageSyncValue("userInfo")) as USERINFO;
      Object.keys(userExists).forEach((wallet) => {
        Object.keys(
          userExists[wallet][CHAINS][
            NETWORKCHAIN[+network as keyof typeof NETWORKCHAIN].chain
          ].accounts
        ).forEach((element) => {
          if (
            userExists[wallet][CHAINS][
              NETWORKCHAIN[+network as keyof typeof NETWORKCHAIN].chain
            ][ACCOUNTS][element].address.toLowerCase() === address.toLowerCase()
          ) {
            dispatch(
              addSelectedToken({
                walletName: wallet,
                accountName:
                  userExists[wallet][CHAINS][
                    NETWORKCHAIN[+network as keyof typeof NETWORKCHAIN].chain
                  ][ACCOUNTS][element].name,
              })
            );
          }
        });
      });
    })();
  }, []);

  useEffect(() => {
    if (
      network !== SupportedChainId.NEAR &&
      network !== SupportedChainId.NEAR_TESTNET &&
      network !== SupportedChainId.SOLANA_MAINNET &&
      network !== SupportedChainId.SOLANA_DEVNET
    ) {
      (async () => {
        console.log("web3333", web3);
        const { safeLow, average, fast, avgWait, fastWait, safeLowWait } =
          await calculateGasSpeed(tokenAddress, web3, address, network);
        console.log("safelow", safeLow, average, fast);
        dispatch(setSendTransactionPrice(average));
        dispatch(selectGasFees(average));
        setGasPrice({ safeLow, average, fast, avgWait, fastWait, safeLowWait }); // these are the averages
      })();
      dispatch(
        checkTransactionReceipt(
          web3,
          transactions[`${network}${address}`],
          network,
          address
        )
      );
    }
  }, [tokenAddress]);

  useEffect(() => {
    const transactionPrice = AMOUNT * tokenPriceInUsd + +selectedGasValue;
    console.log({
      MYAMOUN: AMOUNT,
      tokenPriceInUsd,
    });

    dispatch(setSendTransactionPrice(transactionPrice));
    if (
      network !== SupportedChainId.NEAR &&
      network !== SupportedChainId.NEAR_TESTNET &&
      network !== SupportedChainId.SOLANA_DEVNET &&
      network !== SupportedChainId.SOLANA_MAINNET
    ) {
      (async () => {
        try {
          console.log(web3, "web3");
          web3 = new Web3(
            new Web3.providers.HttpProvider(
              NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][NODE_URL]
            )
          );
          if (web3) {
            console.log("run actual gas price");
            const contract = new web3.eth.Contract(
              abi,
              tokenAddress || NATIVE_TOKEN_ADDRESS
            );
            let currentGasPrice = await getGasPrice(network);
            console.log("check mar address ko", address);
            const [estimateGas, ethPriceInUSd] = [
              await contract.methods
                .transfer(
                  "0x8c0200D7fe703889F5986c9742cC6fbAE6049123",
                  Number(value) * 10 ** 9
                )
                .estimateGas({ from: address }),
              await fetchUsdRate(
                NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                  NATIVE_TOKEN_COINGECKO_ID
                ]
              ),
            ];

            const gasPriceSelection =
              ((parseFloat(selectedGasValue) / estimateGas) * 10 ** 9) /
              parseFloat(ethPriceInUSd);

            let actual_gas_price = gasPriceSelection || currentGasPrice.average;

            dispatch(SET_GAS_PRICE(Math.ceil(actual_gas_price.toString())));
          }
        } catch (error) {
          console.log("err-----", error);
        }
      })();
    } else if (
      network === SupportedChainId.NEAR ||
      network === SupportedChainId.NEAR_TESTNET
    ) {
      console.log("Near chain is being  followed");
      (async () => {
        const { nearAmountInUsd } = await getNearChainGasPrice();
        console.log({ nearAmountInUsd });

        dispatch(selectGasFees(nearAmountInUsd));

        dispatch(setSendTransactionPrice(Number(nearAmountInUsd)));
      })();
    }
  }, [selectedGasValue]);

  useEffect(() => {
    if (
      network === SupportedChainId.SOLANA_MAINNET ||
      network === SupportedChainId.SOLANA_DEVNET
    ) {
      console.log("GETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
      getSolanaTransactionFees();
      dispatch(selectGasFees(gasPrice.average.toString()));
      dispatch(setSendTransactionPrice(gasPrice.average));
    }
  }, [gasPrice]);

  return (
    <Step3WrapperStyled
      animate={{ y: 0 }}
      transition={{ ease: "easeOut", duration: 0.5 }}
      initial={{ y: 100 }}
    >
      <div className="r-c-fs width">
        <Text size={20} weight={500}>
          Send {tokenName}
        </Text>
        <FontAwesomeIcon
          icon={faSortDown}
          className="step3Icon"
          onClick={() => setStep(1)}
        />
      </div>
      <Text
        size={14}
        weight={400}
        customStyle={{ marginTop: "5px" }}
        className="width"
      >
        {tokenAmount.toFixed(5)}{" "}
        <span style={{ opacity: 0.7 }}>{tokenName}</span>{" "}
        <span style={{ color: "#7B7A7F" }}>Available</span>
      </Text>
      <div className="r-c-fs">
        <SearchLayout>
          <StyledAmountInput
            placeholder="0"
            onChange={handleChange}
            value={value}
          />
        </SearchLayout>
        <div className="c-fs-c" style={{ marginTop: "20px" }}>
          <Text size={17} weight={400}>
            {tokenName}
          </Text>
          <Text dim={true} size={14} weight={400}>
            ~
            {millify(usdAmount, {
              precision: 4,
            })}
            USD
          </Text>
        </div>
      </div>

      <Text size={17} weight={400} dim={true} className="width">
        To
      </Text>
      <GenericBackgroundBox
        margintop={10}
        className="genericBox"
        style={{ marginBottom: multiAccountExist ? "0px" : "100px" }}
      >
        <ImageContent
          src={RecieveSVG}
          Size={{ width: "20px", height: "20px" }}
        />
        <Text size={17} weight={500} style={{ marginLeft: "20px" }}>
          {truncateAddress(recieverAddress)}
        </Text>
      </GenericBackgroundBox>
      {multiAccountExist && (
        <>
          <Text size={17} weight={400} dim={true} className="width">
            From
          </Text>
          <GenericBackgroundBox margintop={10} className="genericBox">
            <ImageContent
              src={Bnb}
              Size={{ width: "20px", height: "20px", borderRadius: "50%" }}
            />
            <div className="walletHeading">
              <Text size={20} weight={500} style={{ opacity: 0.7 }}>
                {accountName}
              </Text>
              <Text size={17} weight={400} dim={true}>
                {walletName}
              </Text>
            </div>
          </GenericBackgroundBox>
        </>
      )}

      <TransactionFee
        gasPrice={Number(selectedGasValue) || 0}
        loading={false}
        setStep={setStep}
        transactionPrice={AMOUNT <= tokenAmount ? sendTransactionPrice : 0 || 0}
        isShowTitle={false}
        modalProps={{
          gasPrice,
          open,
          handleClose: () => {},
          hideSlippage: true,
          gasOptionIndex,
          setGasOptionIndex,
          slippageOptionIndex,
          setSlippageOptionIndex,
          handleClick: handleTransaction,
        }}
      />

      <Text style={{ marginTop: "10px", color: "#FF0000" }}>
        {alertMessage.open && alertMessage.message}
      </Text>
    </Step3WrapperStyled>
  );
};
export default Step3;
