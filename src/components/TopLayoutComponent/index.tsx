import { FC } from "react";

import { TopLayoutProps as PROPS } from "interfaces";
import { ImageContent, Text, UpArrowStyled } from "@styled";

const TopLayoutComponent: FC<PROPS> = ({ text, TopImage, onTopImageClick }) => {
  return (
    <>
      <div className="r-c-fs topImage">
        <UpArrowStyled>
          <ImageContent
            src={TopImage}
            style={{
              width: "25px",
              height: "25px",
              cursor: "pointer",

              padding: "4px",
            }}
            onClick={onTopImageClick}
          />
        </UpArrowStyled>

        <Text
          size={24}
          weight={400}
          style={{
            marginLeft: "14px",
            opacity: 0.8,
          }}
        >
          {text}
        </Text>
      </div>
    </>
  );
};

export default TopLayoutComponent;
