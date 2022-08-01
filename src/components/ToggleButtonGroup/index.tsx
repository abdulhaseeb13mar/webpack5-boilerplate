import { useRef, useState } from "react";
import { ToggleButton } from "@mui/material";
import Box from "@mui/material/Box/Box";

import { ChartButtonGroup, ChartHeader, DefaultItemSpan } from "@styled";

function ToggleButtonGroup() {
  /* global-state */
  const chartRef = useRef(null);

  /* local-state */
  const [state, setState] = useState({
    tvWidget: null,
    activeInterval: "30",
    activeChartType: 1, //1)canldes 2)line chart
    activeTvMethod: 0, //0)auto 1)log 2)%
    timeFrame: ["1D", "1W", "1M", "1Y", "All"],
    chartLoaded: false,
    selectedPair: "",
  });

  /* hooks */

  /* functions */

  /* effects */

  return (
    <div style={{ marginLeft: "12px" }}>
      <ChartHeader ref={chartRef}>
        <Box style={{ display: "flex" }}>
          <ChartButtonGroup
            size="small"
            value={state.activeInterval}
            exclusive
            onChange={(e, newInterval) => {
              setState((state) => ({
                ...state,
                activeInterval: newInterval,
              }));
            }}
          >
            <ToggleButton value="5">
              <DefaultItemSpan DisableNumber={true}>1</DefaultItemSpan> day
            </ToggleButton>
            <ToggleButton value="30">
              <DefaultItemSpan DisableNumber={true}>1</DefaultItemSpan>
              week
            </ToggleButton>
            <ToggleButton value="60">
              <DefaultItemSpan DisableNumber={true}>1</DefaultItemSpan>month
            </ToggleButton>
            <ToggleButton value="1D">
              <DefaultItemSpan DisableNumber={true}>1</DefaultItemSpan>year
            </ToggleButton>
            <ToggleButton value="All">All</ToggleButton>
          </ChartButtonGroup>
        </Box>
      </ChartHeader>
    </div>
  );
}

export default ToggleButtonGroup;
