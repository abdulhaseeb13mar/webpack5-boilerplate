import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  SearchBar,
  SelectAccountModal,
  ButtonBox,
  StartAdornment,
} from "components";
import { Text, CustomBox } from "@styled";
import { Wallet } from "assets/Icons";

const ImportAccount = () => {
  /* global-state */

  /* local-state */
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  /* hooks */

  /* functions */
  function handleClose() {
    setOpen(false);
  }

  // const onRecover = () => {
  //   try {
  //     setButtonClicked(true);
  //     let mnemonicWallet = ethers.Wallet.fromMnemonic(seedPhrase);
  //     console.log({ mnemonicWallet });
  //     setIsMemonicTrue(true);
  //     addWallet(password, mnemonicWallet);
  //   } catch (e) {
  //     console.log(e);
  //     setIsMemonicTrue(false);
  //   }
  // };

  /* effects */

  return (
    <CustomBox padding="50px 30px" className="c-c-c">
      <Text size={18}>Create a new account</Text>

      <Text size={13} customColor="#807989" style={{ margin: "30px 0px" }}>
        Add another account inside your wallet.
      </Text>

      <CustomBox width="100%">
        <Text
          size={13}
          weight={600}
          customColor="#5E5E64"
          className="addressBookStyle"
          customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
        >
          NAME
        </Text>
        <SearchBar
          onChange={(e) => {
            setName(e.target.value);
          }}
          name={"Enter Nickname"}
          placeholder={"Enter Nickname"}
          value={name}
          StartAdornment={<StartAdornment Icon={Wallet} />}
          customPadding={6}
        />
      </CustomBox>

      <CustomBox width="100%" padding="0 8px" margin="20px 0px">
        <Text
          size={13}
          weight={600}
          customColor="#5E5E64"
          className="addressBookStyle"
          customStyle={{ marginBottom: "10px", paddingLeft: "2px" }}
        >
          WALLET
        </Text>
        <CustomBox
          onClick={() => {
            setOpen(true);
          }}
          className="r-c-sb"
          backgroundColor="#22202A"
          width="100%"
          padding="10px 12px"
          borderRadius="12px"
          style={{ cursor: "pointer" }}
        >
          <Text>Wallet 1</Text>
          <ArrowDropDownIcon style={{ color: "grey" }} />
        </CustomBox>
      </CustomBox>

      <ButtonBox
        marginTop={10}
        title={"Save"}
        customColor="rgba(255, 255, 255, 0.04)"
        handleClick={() => {}}
        customStyle={{ width: "fitContent", padding: "0px 14px" }}
      />

      <SelectAccountModal
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        walletList={["Wallet 1", "Wallet 2"]}
      />
    </CustomBox>
  );
};

export default ImportAccount;
