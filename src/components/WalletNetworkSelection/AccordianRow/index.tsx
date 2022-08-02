import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/pro-solid-svg-icons";
import { useNavigate } from "react-router";

import { ImageContent, Text } from "@styled";
import { AccordianPlaceholder } from "assets/images";
import { AccordianRow as Props, RootState, USERINFO } from "interfaces";
import { CopyWhite } from "assets/Icons";
import {
  ACCOUNTS,
  CHAINS,
  NEAR_TESTNET,
  SupportedChainId,
} from "utils/constants";
import { getStorageSyncValue } from "@constants";
import {
  setCurrentAccountAddress,
  setUserAddress,
  setWalletNumber,
} from "@slices/appSlice";
import { changeAccount } from "@slices/walletSlice/wallet.actions";
import { setNearAccountId, setNearAccountNetwork } from "@slices/walletSlice";

const AccordianRow: FC<Props> = ({
  selected,
  logo,
  text,
  isLast,
  isHeading,
  onClick,
  copy,
  setCopied,
  address,
  isChecked,
  setCurrentAccountIndex,
  index,
  walletIndex,
  setCopyIndex,
}) => {
  /* global-state */
  const { chain } = useSelector((state: RootState) => state.wallet);

  /* local-state */

  /* hooks */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* functions */

  /* effects */

  return (
    <motion.div
      layout
      className="r-c-sb"
      style={{
        padding: `12px 13px 12px ${isHeading ? "13" : "2"}px`,
        borderBottom: `${isLast ? "0" : "1"}px solid rgba(255,255,255,0.05)`,
        marginLeft: isHeading ? 0 : 15,

        cursor: "pointer",
      }}
      onClick={() => {
        if (!copy && onClick) {
          onClick();
        }
      }}
    >
      <div
        className="r-c-fs"
        style={{
          width: "240px",
        }}
        onClick={async () => {
          console.log(setCurrentAccountIndex, "heerere");
          if (setCurrentAccountIndex) {
            console.log("clicked", "hennene");
            if (text === "Click to create Account id") {
              const isUserExist = (await getStorageSyncValue(
                "userInfo"
              )) as USERINFO;
              console.log("isUserEXists888", isUserExist, walletIndex);
              const accountAddress = Object.keys(
                isUserExist[`wallet${walletIndex}`][CHAINS][NEAR_TESTNET][
                  ACCOUNTS
                ]
              )[0];
              const accountId =
                isUserExist[`wallet${walletIndex}`][CHAINS][NEAR_TESTNET][
                  ACCOUNTS
                ][accountAddress].address;
              dispatch(setNearAccountId(accountId));
              dispatch(setNearAccountNetwork(SupportedChainId.NEAR_TESTNET));
              console.log(accountId, "accountid");
              console.log({ accountId });

              if (accountId?.length === 0) navigate("/near");
            }
            dispatch(setUserAddress(address));
            dispatch(setCurrentAccountAddress(address));
            console.log("i should not run when netwrok selection happens");

            setCurrentAccountIndex({
              walletIndex: walletIndex || 0,
              accountIndex: index || 0,
            });

            dispatch(setWalletNumber(walletIndex || 1));
            dispatch(changeAccount(index || 0, address || "", chain));

            if (copy && onClick) onClick();
          }
        }}
      >
        {isChecked ? (
          <FontAwesomeIcon
            className="accordian-thumb-image"
            icon={faCircle}
            style={{ color: "rgb(0, 214, 125)" }}
          />
        ) : (
          <div
            className="accordian-thumb-image"
            style={{
              backgroundImage: `url(${logo ? logo : AccordianPlaceholder})`,
              display: isHeading ? "none" : "block",
            }}
          />
        )}
        <Text weight={400} size={15} style={{ opacity: isHeading ? 1 : 0.7 }}>
          {text.replace("_", " ")}
        </Text>
      </div>
      {copy && (
        <>
          <ImageContent
            src={CopyWhite}
            Size={{ width: "20px", height: "20px" }}
            onClick={() => {
              if (setCopied) setCopied(true);
              console.log(walletIndex, "walletIndex");
              if (setCopyIndex && walletIndex)
                setCopyIndex({
                  walletIndex: walletIndex - 1 || 0,
                  accountIndex: index || 0,
                });

              navigator.clipboard.writeText(address || "");
            }}
          />
        </>
      )}
      {selected && (
        <CheckCircle style={{ color: "#00D67D", width: 20, height: 20 }} />
      )}
    </motion.div>
  );
};

export default AccordianRow;
