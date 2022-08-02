import { FC, useState } from "react";
import { CustomBox, Text } from "../../../components/styled";
import { SearchBar } from "../../../components";
import ButtonBox from "../../../components/ButtonBox";

const Step3: FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setStep }) => {
  const [name, setName] = useState("");

  return (
    <CustomBox
      padding="50px 20px"
      className="c-c-c"
      backgroundColor="#191721"
      style={{}}
    >
      <Text size={18}>Add Custom Network</Text>

      <Text size={13} customColor="#807989" style={{ margin: "15px 0px" }}>
        ***
      </Text>

      <CustomBox width="100%">
        <Text
          size={13}
          weight={600}
          customColor="#5E5E64"
          className="addressBookStyle"
          customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
        >
          NETWORK NAME
        </Text>
        <SearchBar
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          name={"Enter name..."}
          placeholder={"Enter name..."}
          value={name}
          //   StartAdornment={<StartAdornment Icon={Wallet} />}
          customPadding={6}
        />
      </CustomBox>

      <CustomBox width="100%">
        <Text
          size={13}
          weight={600}
          customColor="#5E5E64"
          className="addressBookStyle"
          customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
        >
          RPC URL
        </Text>
        <SearchBar
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          name={"Enter RPC URL..."}
          placeholder={"Enter Rpc url"}
          value={name}
          //   StartAdornment={<StartAdornment Icon={Wallet} />}
          customPadding={6}
        />
      </CustomBox>

      <CustomBox width="100%">
        <Text
          size={13}
          weight={600}
          customColor="#5E5E64"
          className="addressBookStyle"
          customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
        >
          CHAIN ID
        </Text>
        <SearchBar
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          name={"Enter nickname..."}
          placeholder={"Enter nickname..."}
          value={name}
          //   StartAdornment={<StartAdornment Icon={Wallet} />}
          customPadding={6}
        />
      </CustomBox>

      <CustomBox width="100%">
        <Text
          size={13}
          weight={600}
          customColor="#5E5E64"
          className="addressBookStyle"
          customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
        >
          BLOCK EXPLORER URL (OPTIONAL)
        </Text>
        <SearchBar
          onChange={(e: any) => {
            setName(e.target.value);
          }}
          name={"Enter block explorer url..."}
          placeholder={"Enter block explorer url..."}
          value={name}
          //   StartAdornment={<StartAdornment Icon={Wallet} />}
          customPadding={6}
        />
      </CustomBox>
      <ButtonBox
        marginTop={30}
        title={"Save"}
        customColor="rgba(255, 255, 255, 0.04)"
        handleClick={() => {
          setStep(1);
        }}
        customStyle={{ width: "fitContent", padding: "0px 14px" }}
      />
    </CustomBox>
  );
};

export default Step3;
