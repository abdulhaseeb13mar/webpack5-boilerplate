import { useState } from "react";
import { Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router";

import { BackIcon, QuestionCircle } from "assets/Icons";
import { WrapperBackground } from "components";
import { CustomBox, ImageContent, Text } from "@styled";
import Import from "../import";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const Settings = () => {
  /* global-state */

  /* local-state */
  const [step, setStep] = useState(1);

  /* hooks */
  const navigate = useNavigate();

  /* functions */
  const BackPress = async () => {
    if (step !== 1) {
      setStep(1);
    } else if (step === 1) {
      navigate("/index.html");
    }
  };

  /* effects */

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
        <Text style={{ marginRight: "12px" }}>Settings</Text>
        <Tooltip title="Help" placement="bottom">
          <ImageContent
            alt="?"
            src={QuestionCircle}
            Size={{ width: "18px", height: "18px" }}
          />
        </Tooltip>
      </CustomBox>

      {step === 1 ? (
        <Step1 setStep={setStep} />
      ) : step === 2 ? (
        <Step2 setStep={setStep} />
      ) : step === 3 ? (
        <Step3 setStep={setStep} />
      ) : step === 4 ? (
        <Import accountImport={true} />
      ) : step === 5 ? (
        <Import accountImport={false} />
      ) : null}
    </WrapperBackground>
  );
};

export default Settings;
