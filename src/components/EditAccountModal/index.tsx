import { FC, useState } from "react";

import { selectWalletModal as PROPS } from "interfaces";
import { CustomBox, Text } from "@styled";
import { ButtonBox, SearchBar, BasicModal } from "components";

const EditAccountModal: FC<PROPS> = ({ handleClose, setOpen, open }) => {
  /* global-state */

  /* local-state */
  const [name, setName] = useState("");

  /* hooks */

  /* functions */

  /* effects */

  return (
    <BasicModal open={open} handleClose={handleClose} zoom={false}>
      <CustomBox
        padding="50px 20px"
        className="c-c-c"
        width="90%"
        borderRadius="12px"
        backgroundColor="#191721"
      >
        <Text size={18}>Edit Account</Text>

        <Text size={13} customColor="#807989" style={{ margin: "15px 0px" }}>
          ***
        </Text>

        <CustomBox width="100%">
          <Text
            size={13}
            weight={600}
            customColor="#5E5E64"
            className="addressBookStyle"
            customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
          >
            ACCOUNT NAME
          </Text>
          <SearchBar
            onChange={(e: any) => {
              setName(e.target.value);
            }}
            name={"Enter name..."}
            placeholder={"Enter name..."}
            value={name}
            customPadding={6}
          />
        </CustomBox>

        <ButtonBox
          marginTop={30}
          title={"Save"}
          customColor="rgba(255, 255, 255, 0.04)"
          handleClick={() => {
            setOpen(false);
          }}
          customStyle={{ width: "fitContent", padding: "0px 14px" }}
        />
      </CustomBox>
    </BasicModal>
  );
};

export default EditAccountModal;
