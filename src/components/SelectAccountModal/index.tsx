import { FC } from "react";

import { selectWalletModal as PROPS } from "interfaces";
import { CustomBox, ImageContent, Text } from "@styled";
import { Bnb } from "assets/images";
import { BasicModal } from "components";

const selectAccountModal: FC<PROPS> = ({
  handleClose,
  setOpen,
  open,
  walletList,
}) => {
  return (
    <BasicModal open={open} handleClose={handleClose} zoom={false}>
      <CustomBox
        // height="40vh"
        backgroundColor="#191a22"
        width="90%"
        borderRadius="12px"
        padding="20px"
        // className="c-c-c"
        style={{ outline: "none" }}
      >
        {/* <CustomBox className="r-c-c"> */}
        <Text
          size={16}
          weight={600}
          // customColor="#5E5E64"
          customStyle={{ marginBottom: "10px" }}
        >
          Select Wallet
        </Text>
        {/* </CustomBox> */}
        {walletList &&
          walletList.map((wallet, index) => {
            return (
              <CustomBox
                key={index}
                className="r-c-sb"
                backgroundColor="#22202A"
                width="100%"
                padding="10px 12px"
                borderRadius="12px"
                margin="15px 0px"
                style={{ cursor: "pointer" }}
              >
                <Text>{wallet}</Text>
                <ImageContent
                  src={Bnb}
                  Size={{ width: "20px", height: "20px", borderRadius: "50%" }}
                />
              </CustomBox>
            );
          })}
      </CustomBox>
    </BasicModal>
  );
};

export default selectAccountModal;
