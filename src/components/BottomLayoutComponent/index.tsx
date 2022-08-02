import { FC, useState, ChangeEvent, memo } from "react";

import { StartAdornment, TokenAccordion, SearchBar } from "components";
import { Search } from "assets/Icons";
import { StepsProps as PROPS } from "interfaces";

const BottomLayoutComponent: FC<PROPS> = ({
  setCurrentStep,
  isSwap,
  setToken,
  tokensHistory,
  handleClose,
  isShow,
  setFromToken,
}) => {
  /* global-state */

  /* local-state */
  const [value, setValue] = useState("");

  /* hooks */

  /* functions */

  /* effects */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <>
      <SearchBar
        StartAdornment={<StartAdornment Icon={Search} />}
        placeholder="Search..."
        onChange={handleChange}
        value={value}
      />
      {/* <RecentTabs /> */}
      <TokenAccordion
        value={value}
        setCurrentStep={setCurrentStep}
        isSwap={isSwap}
        setToken={setToken}
        tokensHistory={tokensHistory}
        handleClose={handleClose}
        isShow={isShow}
        setFromToken={setFromToken}
      />
    </>
  );
};

export default memo(BottomLayoutComponent);
