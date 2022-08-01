import { FC } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersSimple, faGasPump } from "@fortawesome/pro-light-svg-icons";
import { useDispatch } from "react-redux";
import { faPercent } from "@fortawesome/pro-regular-svg-icons";

import { SelectionBox, ButtonBox } from "components";
import { Text } from "@styled";
import { AdvanceOptionStepProps as PROPS } from "interfaces";
import {
  selectGasFees,
  setGasSpeed,
  setSlippage,
  setSwapTransactionTime,
} from "@slices/sendTransaction";

const Step1: FC<PROPS> = ({
  setStep,
  handleClose,
  gasPrice,
  hideSlippage,
  gasOptionIndex,
  setGasOptionIndex,
  setSlippageOptionIndex,
  slippageOptionIndex,
}) => {
  /* global-state */

  /* local-state */

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const handleGasOption = (index: number) => {
    const selectedGasValue = gasOptionList[index].value;

    dispatch(selectGasFees(selectedGasValue));

    dispatch(setGasSpeed(gasOptionList[index].title));
    console.log(gasOptionList[index].time, "the time");

    dispatch(setSwapTransactionTime(gasOptionList[index].time));
    setGasOptionIndex(index);
  };

  const handleSlippageOption = (index: number) => {
    console.log(index, "index");
    console.log(
      parseInt(slippageOptionList[index].title.toString().slice(0, 1)),
      "title"
    );
    const slippage = parseInt(
      slippageOptionList[index].title.toString().slice(0, 1)
    );

    dispatch(setSlippage(slippage));
    setSlippageOptionIndex(index);
  };

  const customGas = () => setStep(2);

  const CustomSlippage = () => setStep(3);

  /* effects */

  /* constants */
  const gasOptionList = [
    {
      title: "Slow",
      value:
        gasPrice.safeLow === 0
          ? gasPrice.safeLow.toFixed(0)
          : gasPrice.safeLow < 1
          ? gasPrice.safeLow.toFixed(8)
          : gasPrice.safeLow.toFixed(4),
      isIcon: false,
      time: gasPrice.safeLowWait,
    },
    {
      title: "Average",
      value:
        gasPrice.average === 0
          ? gasPrice.average.toFixed(0)
          : gasPrice.average < 1
          ? gasPrice.average.toFixed(8)
          : gasPrice.average.toFixed(4),
      isIcon: false,
      time: gasPrice.avgWait,
    },
    {
      title: "Fast",
      value:
        gasPrice.fast === 0
          ? gasPrice.fast.toFixed(0)
          : gasPrice.fast < 1
          ? gasPrice.fast.toFixed(8)
          : gasPrice.fast.toFixed(4),
      isIcon: false,
      time: gasPrice.fastWait,
    },
  ];

  const slippageOptionList = [
    { title: "0.1%", isIcon: false },
    { title: "0.5%", isIcon: false },
    { title: "1%", isIcon: false },
    { title: 0, isIcon: true },
  ];

  return (
    <motion.div>
      <div className="r-c-fs">
        <FontAwesomeIcon
          icon={faGasPump}
          className="statsIcon"
          style={{ marginRight: "0px" }}
        />
        <Text customStyle={{ marginLeft: "10px" }}>Gas Fees</Text>
      </div>
      <SelectionBox
        OptionList={gasOptionList}
        showDollar={true}
        Icon={
          <FontAwesomeIcon
            icon={faSlidersSimple}
            className="statsIcon"
            style={{ marginRight: "0px" }}
          />
        }
        handleOption={handleGasOption}
        optionIndex={gasOptionIndex}
        gasOptionList={true}
        height={65}
        customSelection={customGas}
      />
      {!hideSlippage && (
        <>
          <div className="r-c-fs slippage">
            <FontAwesomeIcon
              icon={faPercent}
              className="statsIcon"
              style={{ marginRight: "0px" }}
            />
            <Text customStyle={{ marginLeft: "10px" }}>Slippage</Text>
          </div>
          <SelectionBox
            OptionList={slippageOptionList}
            Icon={
              <FontAwesomeIcon
                icon={faSlidersSimple}
                className="statsIcon"
                style={{ marginRight: "0px" }}
              />
            }
            handleOption={handleSlippageOption}
            optionIndex={slippageOptionIndex}
            gasOptionList={false}
            height={40}
            customSelection={CustomSlippage}
          />
        </>
      )}
      <ButtonBox
        title="OK"
        customColor="#23242B"
        marginTop={20}
        customStyle={{ width: "100% ", padding: "25px" }}
        handleClick={handleClose}
      />
    </motion.div>
  );
};

export default Step1;
