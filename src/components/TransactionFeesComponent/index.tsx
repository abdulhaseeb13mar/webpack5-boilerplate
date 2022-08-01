import { FC, useState } from "react";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faGasPump, faDollar } from "@fortawesome/pro-solid-svg-icons";
import {
  SingleBoxStyled,
  Text,
  TransaactionTitleStyled,
  TransactionFeeStyled,
  TransactionFeeBottomLayout,
  StatsSection,
  EditSection,
  AdvanceButtonStyled,
  ImageContent,
  ButtonSection,
} from "@styled";
import { RootState, TransactionFeesProps as PROPS } from "interfaces";
import { Gear } from "assets/Icons";
import { RainbowHoldButton, AdvanceOptionModal } from "components";
import useLongPress from "hooks/useLongPress";

const TransactionFee: FC<PROPS> = ({
  gasPrice,
  loading,
  transactionPrice,
  isShowTitle,
  modalProps,
  setStep,
}) => {
  /* global-state */
  const {
    gasPrice: GASPRICE,

    gasOptionIndex,
    setGasOptionIndex,
    slippageOptionIndex,
    setSlippageOptionIndex,
    handleClick,
  } = modalProps;
  const { swapTransactionTime } = useSelector(
    (state: RootState) => state.sendTransaction
  );

  /* local-state */
  const [open, setOpen] = useState(false);

  /* hooks */
  const longPress = useLongPress(() => {
    handleClick && handleClick();
  }, 1000);

  /* functions */
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  /* effects */

  /* constants */
  const boxList = [
    {
      Icon: (
        <FontAwesomeIcon
          icon={faClock}
          className="statsIcon"
          style={{ color: "rgba(254, 180, 49, 1)" }}
        />
      ),
      title: "Time",
      value: `< ${swapTransactionTime || 0} m`,
    },
    {
      Icon: (
        <FontAwesomeIcon
          icon={faGasPump}
          className="statsIcon"
          style={{ color: "rgba(160, 164, 255, 1)" }}
        />
      ),
      title: "Fees",
      value: `
        ${
          gasPrice === 0
            ? 0
            : gasPrice < 1
            ? gasPrice.toFixed(6)
            : gasPrice.toFixed(2)
        } $`,
    },
    {
      Icon: (
        <FontAwesomeIcon
          icon={faDollar}
          className="statsIcon"
          style={{ color: "rgba(61, 242, 188, 1)" }}
        />
      ),
      title: "Total",
      value: `${
        transactionPrice === 0
          ? 0
          : transactionPrice < 0
          ? +transactionPrice.toFixed(6)
          : +transactionPrice.toFixed(6)
      } $`,
    },
  ];

  return (
    <TransactionFeeStyled>
      <TransaactionTitleStyled>
        <Text size={14} weight={400} className="detail">
          Details
        </Text>
        <Text size={14} weight={400} className="dimUnderline">
          Hex
        </Text>
        <Text size={14} weight={400} className="dimUnderline">
          Data
        </Text>
      </TransaactionTitleStyled>
      <TransactionFeeBottomLayout>
        {/* {isShowTitle && <Text style={{ marginTop: "15px" }}>Swaping</Text>} */}
        <StatsSection>
          {boxList.map((value, index) => {
            return (
              <SingleBoxStyled
                key={index}
                border={`${index === boxList.length - 1 ? false : true}`}
              >
                <div className="r-c-fs" style={{ marginBottom: "6px" }}>
                  <Text customStyle={{ display: "flex", alignItems: "center" }}>
                    {value.Icon}
                    {value.title}
                  </Text>
                </div>
                <Text
                  className={`${loading ? "animated" : ""}`}
                  customStyle={{ marginLeft: "10px" }}
                >
                  {value.value}
                </Text>
              </SingleBoxStyled>
            );
          })}
        </StatsSection>
        {!isShowTitle && (
          <>
            <EditSection>
              <AdvanceButtonStyled onClick={handleOpen} width={80} left={20}>
                <ImageContent
                  src={Gear}
                  style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                />
                <Text size={14} weight={400} style={{ marginLeft: "3px" }}>
                  Edit
                </Text>
              </AdvanceButtonStyled>
              <Text size={14} weight={500} style={{ marginRight: "20px" }}>
                USD<span style={{ opacity: 0.5 }}>/ETH</span>
              </Text>
            </EditSection>
            <ButtonSection>
              <AdvanceButtonStyled
                width={120}
                left={5}
                onClick={() => {
                  if (setStep) setStep(1);
                }}
              >
                <Text size={17} weight={500}>
                  Reject
                </Text>
              </AdvanceButtonStyled>

              <RainbowHoldButton
                width={170}
                onHoldComplete={() => {}}
                {...longPress}
              >
                <span style={{ opacity: 0.7 }}>Hold to</span> Confirm
              </RainbowHoldButton>
            </ButtonSection>
          </>
        )}
      </TransactionFeeBottomLayout>
      <AdvanceOptionModal
        gasPrice={GASPRICE}
        open={open}
        handleClose={handleClose}
        hideSlippage={true}
        gasOptionIndex={gasOptionIndex}
        setGasOptionIndex={setGasOptionIndex}
        slippageOptionIndex={slippageOptionIndex}
        setSlippageOptionIndex={setSlippageOptionIndex}
      />
    </TransactionFeeStyled>
  );
};

export default TransactionFee;
