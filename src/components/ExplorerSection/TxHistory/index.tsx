/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";

import { FlexBox, GenericBox, Text, TxHistoryWrapper } from "@styled";
import Received from "./Received";
import Sent from "./Sent";
import Swap from "./Swap";
import moment from "moment";
import Sending from "./Sending";
import Swapping from "./Swapping";
import { useTxHistory } from "hooks/useTxHistory";
import { TxHistoryProps as PROPS } from "interfaces";

const TxHistory: FC<PROPS> = ({ chain, tokenSymbol, height }) => {
  /* global-state */

  /* local-state */
  const [filteredList, setFilteredList] = useState<any[]>([]);

  /* hooks */
  const { txList } = useTxHistory();

  /* functions */
  const renderSwitch = (item: any) => {
    switch (item.TxType) {
      case "Received":
        return <Received item={item} />;
      case "Sent":
        return <Sent item={item} />;
      case "Swap":
        return <Swap item={item} />;
      case "Sending":
        return <Sending item={item} />;
      case "Swapping":
        return <Swapping item={item} />;
      default:
        return null;
    }
  };

  const checkSameDate = (ts: string | number, i: number) => {
    if (i === 0) {
      return true;
    }
    const prevTs = txList[i - 1].timeStamp;
    const currTs = ts;
    const prevDate = new Date(prevTs).getDate();
    const currDate = new Date(currTs).getDate();
    const diff = prevDate - currDate;
    return diff !== 0;
  };

  /* effects */
  useEffect(() => {
    if (chain && tokenSymbol) {
      const data = txList.filter((value) => {
        if (
          value.symbol !== undefined &&
          value.symbol.toLowerCase() === tokenSymbol.toLowerCase() &&
          value.TxType === "Sent"
        ) {
          return true;
        } else return false;
      });
      console.log("mYTX LIST FILTERED", data, { chain, tokenSymbol });
      setFilteredList(data);
    } else {
      setFilteredList(txList);
    }
  }, [txList]);

  return (
    <TxHistoryWrapper height={height}>
      {filteredList &&
        filteredList.map((item: any, index: number) => {
          return (
            <span key={index}>
              <FlexBox Padding={true}>
                <Text
                  customStyle={{
                    marginLeft: "20px",
                    display: "flex",
                    marginBottom: "5px",
                    opacity: "0.3",
                  }}
                  weight={400}
                  size={14}
                >
                  {checkSameDate(item.timeStamp, index)
                    ? moment(item.timeStamp).format("MMM DD")
                    : null}
                </Text>
                <GenericBox
                  Heightstyle={{
                    flexDirection: "row",
                    padding: "12px 12px 12px 12px",
                    width: "90%",
                  }}
                >
                  {renderSwitch(item)}
                </GenericBox>
              </FlexBox>
            </span>
          );
        })}
    </TxHistoryWrapper>
  );
};

export default TxHistory;
