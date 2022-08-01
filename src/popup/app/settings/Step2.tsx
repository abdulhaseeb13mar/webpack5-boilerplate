import { Box } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { AccountCircle, RectangleVertical } from "../../../assets/Icons";
import { Bnb } from "../../../assets/images";
import { CustomBox, ImageContent, Text } from "../../../components/styled";
import { getStorageSyncValue } from "../../../constants";
import { USERINFO } from "../../../interfaces";
import { decryptMessage } from "../../../utils";
import { CHAINS } from "../../../utils/constants";

const Step1: FC<{
  setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ setStep }) => {
  const [walletInfo, setWalletInfo] = useState<USERINFO>();

  useEffect(() => {
    (async () => {
      const userInfo = (await getStorageSyncValue("userInfo")) as USERINFO;
      setWalletInfo(userInfo);
    })();
  }, []);

  const renderAccounts = () => {
    let data = [];
    for (let info in walletInfo) {
      data.push(
        <RenderWallet walletName={info} data={walletInfo[info]["seedphrase"]} />
      );
      for (let wallet in walletInfo[info][CHAINS]) {
        for (let address in walletInfo[info][CHAINS][wallet]["accounts"]) {
          data.push(
            <RenderRow
              data={walletInfo[info][CHAINS][wallet]["accounts"][address]}
              address={address}
            />
          );
        }
      }
    }

    return data;
  };

  return (
    <CustomBox
      backgroundColor={"#1d0531"}
      height={"100%"}
      padding="0px 10px"
      style={{
        borderTopLeftRadius: "24px",
        borderTopRightRadius: "24px",
        // backgroundImage: `url(${backdropSP})`,
        // backgroundColor: "#0D0F19",
      }}
    >
      <Box className="r-c-fs" style={{ padding: "17px" }}>
        <ImageContent
          src={RectangleVertical}
          style={{ marginRight: "8px", width: "9px", height: "13px" }}
        />
        <Text size={17} style={{}}>
          Manage your wallets
        </Text>
      </Box>
      <CustomBox
        backgroundColor="rgba(255, 255, 255, 0.04)"
        borderRadius="10px"
      >
        {walletInfo && renderAccounts()}
      </CustomBox>
    </CustomBox>
  );
};

const RenderWallet: FC<{ walletName: string; data: string }> = ({
  walletName,
  data,
}) => {
  const [decryptedSeedPhrase, setDecryptedSeedPhrase] = useState(false);

  const showSeedPhrase = async () => {
    if (decryptedSeedPhrase) {
      setDecryptedSeedPhrase(false);
    } else {
      const hashedPassword = (await getStorageSyncValue(
        "hashedPassword"
      )) as string;
      const decryptResult = await decryptMessage(data, hashedPassword);
      setDecryptedSeedPhrase(decryptResult);
    }
  };
  return (
    <>
      <Box
        className="r-c-fs"
        style={{
          width: "100%",

          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          textAlign: "start",
          margin: "6px 0px",
          color: "white",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          cursor: "pointer",
        }}
        onClick={showSeedPhrase}
      >
        {" "}
        <Text size={16} style={{}}>
          {walletName}
        </Text>
        <ImageContent
          src={Bnb}
          style={{ marginLeft: "15px", width: "17px", height: "17px" }}
        />
      </Box>
      {decryptedSeedPhrase && (
        <>
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <Text size={14} style={{}}>
              Seed Phrase
            </Text>
          </Box>
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <Text size={10} style={{}}>
              {decryptedSeedPhrase}
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

const RenderRow: FC<{ data: any; address: string }> = ({ data, address }) => {
  const [decryptedKey, setDecryptedKey] = useState(false);

  const showPrivateKey = async (secret: string, address: string) => {
    if (decryptedKey) {
      setDecryptedKey(false);
    } else {
      const hashedPassword = (await getStorageSyncValue(
        "hashedPassword"
      )) as string;
      const decryptResult = await decryptMessage(secret, hashedPassword);
      setDecryptedKey(decryptResult);
    }
  };

  return (
    <>
      <Box>
        <Box
          className="r-c-sb"
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            margin: "0px 10px",
            cursor: "pointer",
          }}
          onClick={() => showPrivateKey(data.secret, data.address)}
        >
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <ImageContent
              src={AccountCircle}
              style={{
                marginRight: "8px",
                width: "15px",
                height: "15px",
              }}
            />
            <Text size={14} style={{}}>
              {data.name}
            </Text>
          </Box>
        </Box>
      </Box>
      {decryptedKey && (
        <>
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <Text size={14} style={{}}>
              Address
            </Text>
          </Box>
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <Text size={10} style={{}}>
              {address}
            </Text>
          </Box>
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <Text size={14} style={{}}>
              Private Key
            </Text>
          </Box>
          <Box className="r-c-sb" style={{ padding: "10px 0px" }}>
            <Text size={10} style={{}}>
              {decryptedKey}
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default Step1;
