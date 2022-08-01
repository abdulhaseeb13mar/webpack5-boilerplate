import { useState } from "react";
import { useSelector } from "react-redux";

import Step1 from "components/Passwords/Step1";
import Step2 from "components/Passwords/Step2";
import Step3 from "components/Passwords/Step3";
import Step4 from "components/Passwords/Step4";
import Login from "components/Passwords/Login";
import { RootState } from "interfaces";
import Main from "components/Passwords/main";

const Landing = () => {
  /* global-state */
  const { isUserExists } = useSelector((state: RootState) => state.app);

  /* local-state */
  const [currentStep, setCurrentStep] = useState(1);

  /* hooks */

  /* functions */

  /* effects */

  /* constants */
  const ContentArray = [
    isUserExists
      ? {
          content: (
            <Login
              changeStep={(step) => setCurrentStep(step)}
              currentStep={currentStep}
            />
          ),
        }
      : {
          content: (
            <Step1
              changeStep={(step) => setCurrentStep(step)}
              currentStep={currentStep}
            />
          ),
        },
    {
      content: (
        <Step2
          changeStep={(step) => setCurrentStep(step)}
          currentStep={currentStep}
        />
      ),
    },
    {
      content: (
        <Step3
          changeStep={(step) => setCurrentStep(step)}
          currentStep={currentStep}
        />
      ),
    },
    {
      content: (
        <Step4
          changeStep={(step) => setCurrentStep(step)}
          currentStep={currentStep}
        />
      ),
    },
  ];

  return <Main ContentArray={ContentArray} currentStep={currentStep} />;
};

export default Landing;
