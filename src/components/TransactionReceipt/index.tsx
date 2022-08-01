import { useState } from "react";
import { faCircleXmark } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import { CheckCircle, CopyWhite } from "assets/Icons";
import { conciseAddress } from "@constants";
import { RootState } from "interfaces";
import { setReceiptModal } from "@slices/sendTransaction";
import { BasicModal } from "components";
import {
  TransactionReceiptStyled,
  Text,
  ImageContent,
  GenericBox,
} from "@styled";

const TransactionReceiptModal = () => {
  /* global-state */
  const {
    receipt: { open, from, to, transactionHash, blockNumber, status },
  } = useSelector((state: RootState) => state.sendTransaction);

  /* local-state */
  const [copied, setCopied] = useState(false);

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const handleClose = () => {
    dispatch(setReceiptModal(false));
  };

  /* effects */

  /* constants */
  const content = [
    {
      title: "From",
      value: conciseAddress(from || ""),
    },
    {
      title: "To",
      value: conciseAddress(to || ""),
    },
    {
      title: "Block Number",
      value: blockNumber,
    },
    {
      title: "Transaction Hash",
      value: conciseAddress(transactionHash),
    },
  ];
  return (
    <BasicModal open={open} handleClose={handleClose} zoom={true}>
      <TransactionReceiptStyled>
        <>
          <div className="c-c-c">
            {status === true ? (
              <ImageContent
                src={CheckCircle}
                Size={{ width: "40px", height: "40px", marginTop: "15px" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={faCircleXmark}
                style={{
                  color: "red",
                  width: "40px",
                  height: "40px",
                  marginTop: "15px",
                }}
              />
            )}
            <Text
              size={17}
              customStyle={{ marginTop: "10px", marginBottom: "10px" }}
            >
              Transaction {status === true ? "Successfull" : "Failed"}
            </Text>
          </div>
          {content.map((item, index) => {
            return (
              <div key={index}>
                <Text
                  size={13}
                  weight={600}
                  customColor="#5E5E64"
                  className="addressBookStyle"
                  customStyle={{
                    marginBottom: "0px",
                    marginTop: "0px",
                    paddingLeft: "10px",
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  customStyle={{
                    width: "90%",
                    margin: "auto",
                    padding: "8px",
                    // backgroundColor: "#110F17",
                    opacity: "0.8",
                    borderRadius: "6px",
                    textAlign: "start",
                  }}
                >
                  {item.value}
                  {index === content.length - 1 ? (
                    <ImageContent
                      src={CopyWhite}
                      Size={{
                        width: "20px",
                        height: "20px",
                        marginLeft: "15px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(transactionHash);
                        setCopied(true);
                      }}
                    />
                  ) : (
                    ""
                  )}
                  {index === content.length - 1 && (
                    <Text style={{ color: "#5bd67e", marginTop: "5px" }}>
                      {copied ? "Transaction Hash copied" : " "}
                    </Text>
                  )}
                </Text>
              </div>
            );
          })}
          <GenericBox
            style={{
              padding: "10px 16px",
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "25px",
              cursor: "pointer",
            }}
            onClick={handleClose}
          >
            Close
          </GenericBox>
        </>
      </TransactionReceiptStyled>
    </BasicModal>
  );
};

export default TransactionReceiptModal;
