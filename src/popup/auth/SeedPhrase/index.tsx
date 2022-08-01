import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@mui/material";

import { WrapperBackground } from "components";
import { scrollListener } from "utils";
import { CustomBox, ImageContent, Text } from "@styled";
import { BackIcon, QuestionCircle } from "assets/Icons";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { getStorageSyncValue, removeStorageSyncValue } from "@constants";
import { RootState } from "interfaces";
import { checkUser } from "@slices/appSlice";

const Seedphrase = () => {
  /* global-state */
  const { isUserSavedMnemonic } = useSelector((state: RootState) => state.app);
  const { nearAccountId } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [step, setStep] = useState(1);

  /* hooks */
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* functions */
  const BackPress = async () => {
    console.log("back pressed", isUserSavedMnemonic);
    if (step === 2) {
      setStep(1);
    } else if (
      step === 1 &&
      !isUserSavedMnemonic &&
      nearAccountId.length === 0
    ) {
      console.log("here???");
      await removeStorageSyncValue("userInfo");
      await removeStorageSyncValue("hashedPassword");
      await removeStorageSyncValue("accounts");

      await removeStorageSyncValue("expiry");

      dispatch(checkUser(false));
      navigate("/index.html");
    } else {
      console.log("here");
      navigate("/index.html");
    }
  };

  /* effects */
  useEffect(() => {
    let mounted = true;

    const userExists = async () => {
      if (mounted) {
        const isUserExist = (await getStorageSyncValue("userInfo")) as object;
        let WalletCount = Object.keys(isUserExist).length;
        if (WalletCount === 0) {
          navigate("/index.html");
        }
      }
    };

    userExists();

    const onScroll = () => {
      scrollListener();
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
      mounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WrapperBackground boxHeight={545}>
      <CustomBox className="r-c-sb" height="55px" padding="0 14px">
        <Box
          className="r-c-c"
          onClick={BackPress}
          style={{ cursor: "pointer" }}
        >
          <ImageContent
            width="6px"
            src={BackIcon}
            alt="<"
            style={{ marginRight: "6px", cursor: "pointer" }}
          />
          <Text customColor="#807989"> Back</Text>
        </Box>
        <Text style={{ marginRight: "12px" }}>New Wallet</Text>
        <Tooltip title="Help" placement="bottom">
          <ImageContent
            alt="?"
            src={QuestionCircle}
            Size={{ width: "18px", height: "18px" }}
          />
        </Tooltip>
      </CustomBox>
      {step === 1 ? <Step1 setStep={setStep} /> : <Step2 />}
    </WrapperBackground>
  );
};
export default Seedphrase;
