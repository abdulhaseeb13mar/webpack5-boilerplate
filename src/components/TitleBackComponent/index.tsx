import { TitleStyled, Text } from "components/styled";
import React from "react";

const TitleBackComponent = () => {
  return (
    <TitleStyled>
      <Text size={14} weight={400} dim={true} style={{ marginBottom: "5px" }}>
        {}
      </Text>
      <Text size={20} weight={500}></Text>
    </TitleStyled>
  );
};

export default TitleBackComponent;
