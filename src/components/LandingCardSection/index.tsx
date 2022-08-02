import { useEffect, useState } from "react";

import { Dollar, Plus } from "assets/Icons";
import { RecieveSVG } from "assets/images";
import { CardBox, ImageContent, Text } from "@styled";

const LandingCardSection = () => {
  /* global-state */

  /* local-state */
  const [options, setOptions] = useState<
    {
      title: string;
      src: string;
    }[]
  >([]);

  /* hooks */

  /* functions */

  /* effects */
  useEffect(() => {
    setOptions([
      {
        title: "Buy Crypto with Card",
        src: Dollar,
      },
      {
        title: "Deposit or receive",
        src: RecieveSVG,
      },
      {
        title: "Connect a wallet",
        src: Plus,
      },
    ]);
  }, []);

  return (
    <>
      <Text customStyle={{ marginTop: "25px" }}>
        It's a bit cold and empty here...
      </Text>
      <Text customStyle={{ marginBottom: "20px" }}>
        Let's get some crypto in.
      </Text>
      {options.map((value, index) => {
        return (
          <CardBox key={index}>
            <ImageContent
              src={value.src}
              Size={{ width: "17px", height: "17px", marginLeft: "5px" }}
            />
            <Text customStyle={{ marginLeft: "20px" }}>{value.title}</Text>
          </CardBox>
        );
      })}
      {/* <Text
        size={15}
        weight={500}
        customStyle={{ opacity: "0.5", marginTop: "30px" }}
      >
        Wanna Switch theme?
      </Text>
      <Text size={15} weight={500} customStyle={{ marginTop: "5px" }}>
        Dark <span style={{ opacity: "0.5" }}> / Light</span>
      </Text> */}
    </>
  );
};

export default LandingCardSection;
