import { connect, utils } from "near-api-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "../interfaces";
import { addSelectedToken } from "@slices/sendTransaction";

import { CONFIG, NEAR_ADDRESS } from "../utils/constants";

export const useGasPrice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { nativeTokenPrice } = useSelector((state: RootState) => state.wallet);
  const { selectedToken, selectedGasValue } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const {
    tokenAddress,
    amount,
    tokenAmount,
    tokenNetwork: network,
    nativeTokenInUsd,
  } = selectedToken;
  const getNearChainGasPrice = async () => {
    try {
      console.log("getNearChainGasPrice");
      const near = await connect(
        //    @ts-ignore
        CONFIG[network as keyof typeof CONFIG]
      );
      //    @ts-ignore
      const response = await near.connection.provider.gasPrice(null);

      const nativeAmountNear = (
        Number(utils.format.formatNearAmount(response.gas_price)) *
        10 ** 12
      ).toFixed(4);
      console.log(
        response.gas_price,
        utils.format.formatNearAmount(response.gas_price),
        Number(utils.format.formatNearAmount(response.gas_price)) * 10 ** 12,
        (
          Number(utils.format.formatNearAmount(response.gas_price)) *
          10 ** 12
        ).toFixed(4),
        nativeAmountNear,
        nativeTokenInUsd
      );
      return {
        nativeAmountNear: +nativeAmountNear,
        nearAmountInUsd: (+nativeAmountNear * +nativeTokenInUsd).toFixed(6),
      };
    } catch (error: any) {
      throw new Error();
    }
  };
  const checkInsufficientGasFunds = async () => {
    let makeTransaction = false;

    if (tokenAddress === NEAR_ADDRESS) {
      let transactionAmount = amount;
      const gasFeeAmount = +selectedGasValue / +nativeTokenInUsd;
      const totalAmount = gasFeeAmount + +amount;
      console.log(
        totalAmount,
        "our near fess",
        tokenAmount,
        totalAmount,
        tokenAmount < totalAmount
      );
      if (tokenAmount < totalAmount) {
        console.log("entered here");
        transactionAmount = Number(amount) - gasFeeAmount;
        makeTransaction = true;
        console.log({ transactionAmount });
      } else {
        makeTransaction = true;
        transactionAmount = amount;
      }
      if (transactionAmount < 0) {
        alert("InSuffficient funds");
        makeTransaction = false;
        navigate("/index.html");
      }
      console.log(transactionAmount, "transaction");
      dispatch(addSelectedToken({ amount: transactionAmount.toString() }));
      return makeTransaction;
    }
  };
  return {
    getNearChainGasPrice,
    checkInsufficientGasFunds,
  };
};
