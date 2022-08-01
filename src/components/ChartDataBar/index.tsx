import { DataBarContainer } from "@styled";
import ChangeBox from "./ChangeBox";
import ChartBalance from "./ChartBalance";

const ChartDataBar = () => {
  return (
    <DataBarContainer>
      <ChartBalance />
      <ChangeBox />
    </DataBarContainer>
  );
};

export default ChartDataBar;
