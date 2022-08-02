import { Box } from "@mui/material";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RectangleVertical } from "../../../assets/Icons";
import {
  CustomBox,
  GenericBox,
  ImageContent,
  Text,
} from "../../../components/styled";
import { getStorageSyncValue } from "../../../constants";
import { RootState, USERINFO } from "../../../interfaces";

import * as Bip39 from "bip39";
import { SupportedChainId } from "../../../utils/constants";
import { addUserWallet } from "../../../utils/addWallet";
import { useNavigate } from "react-router";
import {
  setAccountNumber,
  setNewWallet,
  setWalletNumber,
} from "@slices/appSlice";

const Step1: FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setStep }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { network } = useSelector((state: RootState) => state.wallet);
  // let ChainArray = Object.keys(NETWORKCHAIN).map((element) => {
  //   return {
  //     tokenName: element.replace("_", " "),

  //     tokenSymbol: element.replace("_", " "),
  //     priceInUSD: 0,
  //     tokenBalance: 0,
  //     tokenAddress: "",
  //     image: "",
  //     // image: NETWORKCHAIN[element as keyof typeof NETWORKCHAIN][LOGO],
  //   };
  // });
  // const [open, setOpen] = useState(false);

  const walletsButton = [
    {
      text: "Import Account",
      onClick: () => {
        if (
          network !== SupportedChainId.NEAR_TESTNET &&
          network !== SupportedChainId.NEAR
        ) {
          setStep(4);
        } else if (
          network === SupportedChainId.NEAR_TESTNET ||
          network === SupportedChainId.NEAR
        ) {
          setStep(5);
        }
      },
    },
    {
      text: "Create New Account",
      onClick: () => {
        console.log("create new account");
      },
    },
    {
      text: "Manage wallets",
      onClick: () => {
        setStep(2);
      },
    },
    {
      text: "Import existing wallet",
      onClick: () => {
        setStep(5);
      },
    },
    {
      text: "Create a new wallet",
      onClick: async () => {
        // console.log(setOpen(true));
        const isUserExist = (await getStorageSyncValue("userInfo")) as USERINFO;
        const walletNumber = Object.keys(isUserExist).length + 1;
        dispatch(setWalletNumber(walletNumber));
        dispatch(setAccountNumber(0));

        dispatch(setNewWallet(true));
        const generatedMnemonic = Bip39.generateMnemonic();
        let hashedPassword = (await getStorageSyncValue(
          "hashedPassword"
        )) as string;
        await addUserWallet(generatedMnemonic, hashedPassword, false);
        navigate("/seedphrase");
      },
    },
    {
      text: "Manage Address book",
      onClick: () => {
        console.log("4");
      },
    },
  ];

  const networkButton = [
    {
      text: "Connected dapps",
      onClick: () => {
        console.log("one");
      },
    },
    {
      text: "Add new chain",
      onClick: () => {
        setStep(3);
      },
    },
  ];

  const AdvancedSetting = [
    {
      text: "Support",
      onClick: () => {
        console.log("one");
      },
    },
    {
      text: "Advanced Settings",
      onClick: () => {
        console.log("2");
      },
    },
  ];

  return (
    <CustomBox
      //   backgroundColor={"#1d0531"}
      height={"100vh"}
      padding="10px 10px"
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        background:
          "linear-gradient(182.99deg, #200238 2.8%, #0D0F19 50.8%, #05161C 97.81%)",
      }}
    >
      <Box className="r-c-fs" style={{ padding: "17px" }}>
        <ImageContent
          src={RectangleVertical}
          style={{ marginRight: "8px", width: "9px", height: "13px" }}
        />
        <Text size={17} style={{}}>
          Wallets
        </Text>
      </Box>
      {walletsButton.map((item, i) => {
        return (
          <GenericBox
            key={i}
            Heightstyle={{
              width: "100%",
              display: "block",

              textAlign: "start",
              margin: "6px 0px",
            }}
            onClick={item.onClick}
          >
            {item.text}
          </GenericBox>
        );
      })}

      <Box className="r-c-fs" style={{ padding: "17px" }}>
        <ImageContent
          src={RectangleVertical}
          style={{ marginRight: "8px", width: "9px", height: "13px" }}
        />
        <Text size={17} style={{}}>
          Network
        </Text>
      </Box>
      {networkButton.map((item, i) => {
        return (
          <GenericBox
            key={i}
            Heightstyle={{
              width: "100%",
              display: "block",

              textAlign: "start",
              margin: "6px 0px",
            }}
            onClick={item.onClick}
          >
            {item.text}
          </GenericBox>
        );
      })}

      <Box style={{ height: "40px" }}></Box>
      {AdvancedSetting.map((item, i) => {
        return (
          <GenericBox
            key={i}
            Heightstyle={{
              width: "100%",
              display: "block",

              margin: "6px 0px",
            }}
            onClick={item.onClick}
          >
            {item.text}
          </GenericBox>
        );
      })}

      {/* <TokenPanelModal
        open={open}
        handleClose={() => setOpen(false)}
        isSwap={true}
        setToken={() => setOpen(false)}
        tokensHistory={ChainArray}
        isShow={true}
      /> */}
    </CustomBox>
  );
};

export default Step1;
