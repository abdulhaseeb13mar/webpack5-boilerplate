import { FC } from "react";

import { SwitchTab, SwitchTabDiv } from "@styled";
import { SwitchTabProps } from "interfaces";

const SwitchTabs: FC<SwitchTabProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <SwitchTabDiv
      onChange={(e, v) => setActiveTab(tabs[v])}
      value={tabs.indexOf(activeTab)}
      TabIndicatorProps={{
        style: {
          display: "none",
          marginLeft: "2px",
        },
      }}
    >
      {tabs.map((e, i) => {
        return (
          <SwitchTab key={i} label={e} disableRipple active={e === activeTab} />
        );
      })}
    </SwitchTabDiv>
  );
};

export default SwitchTabs;
