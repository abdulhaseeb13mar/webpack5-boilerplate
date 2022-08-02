import { FC } from "react";
import { motion } from "framer-motion";
import { faPercent } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CustomAmountComponentProps as PROPS } from "interfaces";
import { ButtonBox } from "components";
import { SearchLayout, Text, StyledAmountInput, FooterStyled } from "@styled";

const CustomAmountComponent: FC<PROPS> = ({
  title,
  value,
  handleChange,
  onCancel,
}) => {
  return (
    <motion.div
      layout
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Text
        customColor="#FCF6FF"
        size={17}
        weight={400}
        customStyle={{ marginTop: "20px" }}
      >
        {title}
      </Text>
      <Text
        customColor="rgba(255, 255, 255, 0.6)"
        size={15}
        customStyle={{
          margin: "10px 0px 20px 0px",
        }}
      >
        In order to receive <span className="white">NEAR</span> you need a
        compatible wallet
      </Text>
      <SearchLayout
        style={{
          flexDirection: "row",
        }}
      >
        <StyledAmountInput
          placeholder="0"
          onChange={handleChange}
          value={value}
        />
        <FontAwesomeIcon
          icon={faPercent}
          style={{ fontSize: "24px" }}
          className="lightGray"
        />
      </SearchLayout>
      <FooterStyled>
        <ButtonBox
          title={"Cancel"}
          customColor={"#191721"}
          customStyle={{ width: "45%" }}
          handleClick={onCancel}
        />
        <ButtonBox
          title={"OK"}
          customColor={"#24232B"}
          customStyle={{ width: "45%" }}
          handleClick={onCancel}
        />
      </FooterStyled>
    </motion.div>
  );
};

export default CustomAmountComponent;
