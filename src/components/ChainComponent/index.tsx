/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import { faSortDown } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

import { ChainComponentProps as PROPS, RootState } from "interfaces";
import { NETWORKCHAIN } from "utils/constants";
import { ListItemValueBox } from "components";
import {
  ListItemStyled,
  ImageContent,
  Text,
  NameBoxStyled,
  HeadingBox,
} from "@styled";

const ChainComponent: FC<PROPS> = ({ value, onClick }) => {
  /* global-state */
  const { tokensHistory } = useSelector((state: RootState) => state.wallet);

  /* local-state */
  const [total, setTotal] = useState(0);

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    let sum = 0;
    Object.keys(tokensHistory[value]).forEach((element) => {
      sum += +tokensHistory[value][element].priceInUSD;
    });
    setTotal(sum);
  }, []);

  return (
    <ListItemStyled
      onClick={onClick}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <ImageContent
        Logo={false}
        Opacity={false}
        top={false}
        src={`${NETWORKCHAIN[value as keyof typeof NETWORKCHAIN].LOGO}`}
        Size={{
          width: "30px",
          height: "30px",
          marginLeft: "10px",
        }}
      />
      <NameBoxStyled>
        <HeadingBox>
          <Text customStyle={{ marginLeft: "10px", marginRight: "2px" }}>
            {NETWORKCHAIN[value as keyof typeof NETWORKCHAIN].NAME}
          </Text>
          <FontAwesomeIcon icon={faSortDown} className="sortDownIcon" />
        </HeadingBox>
      </NameBoxStyled>

      <ListItemValueBox isChain={true} usdAmount={total} />
    </ListItemStyled>
  );
};

export default ChainComponent;
