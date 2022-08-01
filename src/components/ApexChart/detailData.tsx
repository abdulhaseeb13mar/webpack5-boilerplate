/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from "react";
import { useSelector } from "react-redux";

import ApexChart from "./index";
import {
  categoryInterface,
  DetailedDataProps as PROPS,
  RootState,
} from "interfaces";
import { STATIC_TIME_GRAPH_DATA } from "theme/constants";

const DetailData: FC<PROPS> = ({ startAnimate }) => {
  /* global-state */
  const { totalWalletData } = useSelector((state: RootState) => state.app);

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  /* constants */
  const timeData: categoryInterface = {
    daycategory: STATIC_TIME_GRAPH_DATA,
    weekcategory: STATIC_TIME_GRAPH_DATA,
    monthcategory: STATIC_TIME_GRAPH_DATA,
  };

  return <ApexChart data={totalWalletData} categorydata={timeData} />;
};

export default DetailData;
