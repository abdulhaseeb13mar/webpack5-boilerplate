import { FC, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";

import { GasModalProps as PROPS } from "interfaces";
import { setSlippage } from "@slices/sendTransaction";
import { BasicModal, CustomAmountComponent } from "components";
import { AdvanceOptionStyled } from "@styled";
import Step1 from "./Step1";

const AdvanceOptionModal: FC<PROPS> = ({
  open,
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
  const [step, setStep] = useState(1);
  const [slippage, setSlippageValue] = useState("");

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const handleSlippageChange = (event: ChangeEvent<HTMLInputElement>) => {
    let amount: any = event.target.value.trim();
    if (
      _.isNumber(parseFloat(amount)) &&
      !isNaN(amount) &&
      !amount.includes("-")
    ) {
      setSlippageValue(amount);
      console.log(parseFloat(parseFloat(amount).toFixed(2)), "the amount");
    }
  };

  /* effects */

  return (
    <BasicModal open={open} handleClose={handleClose} top={290} zoom={false}>
      <AdvanceOptionStyled>
        {step === 1 ? (
          <Step1
            gasPrice={gasPrice}
            setStep={setStep}
            handleClose={handleClose}
            hideSlippage={hideSlippage}
            gasOptionIndex={gasOptionIndex}
            setGasOptionIndex={setGasOptionIndex}
            slippageOptionIndex={slippageOptionIndex}
            setSlippageOptionIndex={setSlippageOptionIndex}
          />
        ) : (
          step !== 2 && (
            <CustomAmountComponent
              handleChange={handleSlippageChange}
              value={slippage}
              title={"Set custom Slippage"}
              onCancel={() => {
                setStep(1);

                dispatch(
                  setSlippage(parseFloat(parseFloat(slippage).toFixed(2)))
                );
              }}
            />
          )
        )}
      </AdvanceOptionStyled>
    </BasicModal>
  );
};

export default AdvanceOptionModal;
