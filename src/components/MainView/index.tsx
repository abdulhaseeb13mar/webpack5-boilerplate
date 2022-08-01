import { DollarSVG, PlusSVG, RecieveSVG } from "assets/images";
import { GenericBox, ImageContent, Text } from "@styled";

const MainView = () => {
  return (
    <>
      <div className="mainview-container">
        <Text primary={true} size={14} weight={500}>
          It's a bit cold and empty here... <br />
          Let's get some crypto in.
        </Text>
        <GenericBox
          style={{
            display: "flex",
            padding: "16px",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: "36px",
          }}
        >
          <ImageContent
            Size={{ width: "14px", height: "17px" }}
            src={DollarSVG}
          />
          <Text weight={400} style={{ marginLeft: "15px" }}>
            Buy crypto with card
          </Text>
        </GenericBox>
        <GenericBox
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "16px",
            justifyContent: "space-evenly",
            marginTop: "14px",
          }}
        >
          <ImageContent
            Size={{ width: "14px", height: "17px" }}
            src={RecieveSVG}
          />
          <Text
            weight={400}
            style={{ marginLeft: "15px", paddingRight: "12px" }}
          >
            Deposite or recieve
          </Text>
        </GenericBox>
        <GenericBox
          style={{
            display: "flex",
            padding: "16px",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: "14px",
          }}
        >
          <ImageContent
            Size={{ width: "14px", height: "17px" }}
            src={PlusSVG}
          />
          <Text
            weight={400}
            style={{ marginLeft: "15px", paddingRight: "30px" }}
          >
            Connect a wallet
          </Text>
        </GenericBox>
      </div>
      <div></div>
    </>
  );
};

export default MainView;
