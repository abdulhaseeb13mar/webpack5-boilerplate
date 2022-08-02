import { FC } from "react";

import { ImageContent, Text } from "@styled";
import { GenericBoxContent as PROPS } from "interfaces";

const GenericBackgroundBoxContent: FC<PROPS> = ({
  title,
  imageSrc,
  address,
  isAddress,
  customColor,
}) => {
  return (
    <div
      className="r-c-fs content"
      style={{
        cursor: "pointer",
      }}
    >
      <ImageContent
        src={imageSrc}
        style={{
          marginLeft: "14px",
          width: "20px",
          height: "20px",
          opacity: 0.5,
        }}
      />
      <Text size={15} weight={400} className="marginLeft">
        {title}
      </Text>
      {isAddress && (
        <Text size={10} className="marginLeft" customColor="#7B7A7F">
          ({address})
        </Text>
      )}
    </div>
  );
};

export default GenericBackgroundBoxContent;
