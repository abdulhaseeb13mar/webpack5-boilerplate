import { FC } from "react";

import { ListItemValueBoxStyled, Text } from "@styled";
import { ListItemValueBoxProps as PROPS } from "interfaces";

const ListItemValueBox: FC<PROPS> = ({ isChain, usdAmount }) => {
  return (
    <ListItemValueBoxStyled>
      {!isChain && (
        <Text isNumber={true} size={17} weight={500}>
          0
        </Text>
      )}
      <>
        <Text dim={true} customStyle={{ opacity: 0.5 }}>
          {usdAmount.toFixed(3)} USD
        </Text>
      </>
    </ListItemValueBoxStyled>
  );
};

export default ListItemValueBox;
