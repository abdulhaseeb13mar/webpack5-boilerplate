import { FC, useEffect, useState, ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import { PublicKey } from "@solana/web3.js";
import { connect } from "near-api-js";

import {
  CheckCircle,
  Circle,
  ClipBoard,
  HistoryIcon,
  Search,
} from "assets/Icons";
import {
  SearchBar,
  Switch,
  AddressInsertionComponent,
  StartAdornment,
  ButtonBox,
  GenericBackgroundBoxContent,
} from "components";
import { GenericBackgroundBox, Text, WrapperStyled } from "@styled";
import {
  CONFIG,
  NATIVE_TOKEN_ADDRESS,
  NATIVE_TOKEN_COINGECKO_ID,
  NETWORKCHAIN,
  RPC_URL,
  SupportedChainId,
  SUPPORTEDCHAINS,
  ZERO_ADDRESS,
} from "utils/constants";
import { RootState, StepsProps as PROPS } from "interfaces";
import { formatAddress } from "utils/addressFormatter";
import { conciseAddress } from "@constants";
import {
  checkAccountStatus,
  fetchUsdRate,
  getChainAddressWithSecretKeys,
  isStringIncludesTheValue,
  SolanaInitialTasks,
} from "utils";
import { addSelectedToken } from "@slices/sendTransaction";
import { setKeyPair } from "@slices/walletSlice";

const web3 = new Web3(RPC_URL);

const Step2: FC<PROPS> = ({ setCurrentStep }) => {
  /* global-state */
  const { chain } = useSelector((state: RootState) => state.wallet);
  const [nearValidAddress, setNearValidAddress] = useState(false);
  const { addressBook, selectedToken, recentRecipient } = useSelector(
    (state: RootState) => state.sendTransaction
  );
  const { tokenNetwork: network, address: userAccountAddress } = selectedToken;

  /* local-state */
  const [value, setValue] = useState("");
  const [isValue, setIsValue] = useState(false);
  const [solanaValidAddress, setSolanaValidAddress] = useState(false);
  const [open, setOpen] = useState(false);
  const [savedAddress, setSavedAddress] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [isSwitch, setSwitch] = useState(false);
  const [address, setAddress] = useState("");

  /* hooks */
  const dispatch = useDispatch();
  console.log({ recentRecipient });

  /* functions */
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    // await validateSolanaAddress(event.target.value);
  };

  const findSavedUser = () => {
    const result = addressBook.filter((item) => {
      return item.ADDRESS.toLowerCase() === value.toLowerCase();
    });
    return result;
  };

  const validateSolanaAddress = (addr: string) => {
    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(addr);
      let isValid = PublicKey.isOnCurve(publicKey.toBytes());
      console.log({ isValid });

      return isValid;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const isValidAddress = (value: string) => web3.utils.isAddress(value);

  const state = async () => {
    const near = await connect(
      // @ts-ignore
      CONFIG[network as keyof typeof CONFIG]
    );
    const accountInfo = await near.account(value);
    const state = await checkAccountStatus(accountInfo);
    return state;
  };

  const handleSwitchChange = () => {
    setSwitch(!isSwitch);
  };

  const EndAdornment = () => {
    return (
      <span className="endAdornment">{`(${formatAddress(address)})`}</span>
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function onPasteHandler(): Promise<void> {
    const text = await navigator.clipboard.readText();
    setValue(text);
  }

  const setkeyPairSolana = async () => {
    const solanaAddressWithSecretKeys = await getChainAddressWithSecretKeys(
      SUPPORTEDCHAINS.SOLANA
    );

    const importedAccount = await SolanaInitialTasks(
      solanaAddressWithSecretKeys[
        userAccountAddress as keyof typeof solanaAddressWithSecretKeys
      ]
    );
    dispatch(setKeyPair(importedAccount));
  };

  const validateAlladdress = (address: string) => {
    let validate: {
      [key: string]: boolean;
    } = {};
    if (network === SupportedChainId.NEAR_TESTNET) {
      if (
        isValidAddress(address) ||
        isStringIncludesTheValue(address, ".near") ||
        validateSolanaAddress(address)
      ) {
        validate = {
          ...validate,
          [network]: false,
        };
      } else
        validate = {
          ...validate,
          [network]: true,
        };
    } else if (network === SupportedChainId.NEAR) {
      if (
        isStringIncludesTheValue(address, ".testnet") ||
        validateSolanaAddress(address) ||
        isValidAddress(address)
      ) {
        validate = {
          ...validate,
          [network]: false,
        };
      } else
        validate = {
          ...validate,
          [network]: true,
        };
    } else if (
      network === SupportedChainId.SOLANA_DEVNET ||
      network === SupportedChainId.SOLANA_MAINNET
    ) {
      if (validateSolanaAddress(address)) {
        validate = {
          ...validate,
          [network]: true,
        };
      } else
        validate = {
          ...validate,
          [network]: false,
        };
    } else {
      if (isValidAddress(address)) {
        validate = {
          ...validate,
          [network]: true,
        };
      } else {
        validate = {
          ...validate,
          [network]: false,
        };
      }
    }

    return validate;
  };

  /* effects */
  useEffect(() => {
    if (value.length > 0) {
      setIsValue(true);
      if (
        value.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase() &&
        value.toLowerCase() !== ZERO_ADDRESS
      ) {
        const isSavedUser = findSavedUser();

        if (isSavedUser.length > 0) {
          if (
            network === SupportedChainId.NEAR ||
            network === SupportedChainId.NEAR_TESTNET
          ) {
            (async () => {
              const stateOf = await state();
              setNearValidAddress(stateOf);
              setSavedAddress(stateOf);
            })();
            setNearValidAddress(true);
          } else if (
            network === SupportedChainId.SOLANA_DEVNET ||
            network === SupportedChainId.SOLANA_MAINNET
          ) {
            const result = validateSolanaAddress(value);
            setSolanaValidAddress(result);
            setSavedAddress(result);
          } else {
            const result = isValidAddress(value);
            console.log({ result });
            setValidAddress(result);
            setSavedAddress(result);
          }
          setAddress(isSavedUser[0].ADDRESS);
        } else {
          setValidAddress(false);

          if (
            network === SupportedChainId.NEAR ||
            network === SupportedChainId.NEAR_TESTNET
          ) {
            if (value.length === 64) setNearValidAddress(true);
            else if (value.length > 6) {
              (async () => {
                const stateof = await state();
                if (stateof) {
                  setNearValidAddress(true);
                } else setNearValidAddress(false);
              })();
            }
          }
          if (network === SupportedChainId.SOLANA_DEVNET) {
            (async () => {
              setSolanaValidAddress(validateSolanaAddress(value));
            })();
          } else {
            if (isValidAddress(value)) setValidAddress(true);
            else setValidAddress(false);
            setSavedAddress(false);
          }
        }
      }
    } else setIsValue(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <motion.div
      animate={{ y: 0 }}
      transition={{ ease: "easeOut", duration: 0.5 }}
      initial={{ y: 100 }}
      style={{ overflowY: "hidden" }}
    >
      <AddressInsertionComponent
        open={open}
        setOpen={setOpen}
        handleClose={handleClose}
        walletAddress={value}
        navigate={setCurrentStep}
      />
      <SearchBar
        onChange={handleChange}
        placeholder="Type address or ENS..."
        value={value}
        StartAdornment={
          <StartAdornment
            Icon={
              (validAddress || nearValidAddress || solanaValidAddress) &&
              value.length > 0 &&
              validateAlladdress(value)[network]
                ? CheckCircle
                : Search
            }
          />
        }
        EndAdornment={
          savedAddress && validateAlladdress(value)[network] ? (
            <EndAdornment />
          ) : (
            <></>
          )
        }
      />
      {(network === SupportedChainId.NEAR_TESTNET ||
        network === SupportedChainId.NEAR) &&
      value.length > 0 ? (
        !nearValidAddress ? (
          <Text customColor={"red"} size={14} weight={500} lineHeight="30px">
            Invalid Account address
          </Text>
        ) : (
          ""
        )
      ) : !validateAlladdress(value)[network] && value.length > 0 ? (
        <Text customColor={"red"} size={14} weight={500} lineHeight="30px">
          Invalid Account address
        </Text>
      ) : (
        ""
      )}
      {(network === SupportedChainId.NEAR ||
      network === SupportedChainId.NEAR_TESTNET
        ? nearValidAddress
        : validateAlladdress(value)[network]) &&
        value.length > 0 && (
          <AnimatePresence exitBeforeEnter>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {!savedAddress && (
                <Box className="r-c-fs center">
                  <Switch
                    checked={isSwitch}
                    handleSwitchChange={handleSwitchChange}
                  />
                  <Text
                    customColor={isSwitch ? "#3DF2BC" : "#7B7A7F"}
                    size={15}
                    weight={500}
                  >
                    Save to Address Book
                  </Text>
                </Box>
              )}
              {validateAlladdress(value)[network] && (
                <Box
                  onClick={async () => {
                    if (isSwitch) setOpen(true);
                    if (!isSwitch) {
                      const nativeTokenInUsd = await fetchUsdRate(
                        NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                          NATIVE_TOKEN_COINGECKO_ID
                        ]
                      );
                      console.log({ nativeTokenInUsd, network });
                      if (
                        network === SupportedChainId.SOLANA_DEVNET ||
                        network === SupportedChainId.SOLANA_MAINNET
                      ) {
                        await setkeyPairSolana();
                      }
                      dispatch(
                        addSelectedToken({
                          recieverAddress: value,
                          nativeTokenInUsd,
                          amount: "0",
                        })
                      );
                      setCurrentStep(3);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <ButtonBox
                    title="Send"
                    marginTop={savedAddress ? 15 : 1}
                    customColor="#23212A"
                  />
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        )}

      <WrapperStyled value={isValue} layout transition={{ ease: "easeInOut" }}>
        <GenericBackgroundBox
          margintop={30}
          id="pasteButton"
          onClick={onPasteHandler}
        >
          <GenericBackgroundBoxContent
            imageSrc={ClipBoard}
            title=" Paste from clipboard"
            isAddress={true}
          />
        </GenericBackgroundBox>

        {addressBook.length > 0 && (
          <Text size={13} customColor="#5E5E64" className="addressBookStyle">
            FROM ADDRESS BOOK
          </Text>
        )}
        {addressBook.map((item, index) => {
          return (
            <GenericBackgroundBox
              key={index}
              style={{
                opacity: validateAlladdress(item.ADDRESS)[network] ? 1 : 0.5,

                pointerEvents: validateAlladdress(item.ADDRESS)[network]
                  ? "auto"
                  : "none",
              }}
              margintop={10}
              onClick={async () => {
                // if (validAddress) {
                const nativeTokenInUsd = await fetchUsdRate(
                  NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                    NATIVE_TOKEN_COINGECKO_ID
                  ]
                );
                console.log({ nativeTokenInUsd, network });
                if (
                  network === SupportedChainId.SOLANA_DEVNET ||
                  network === SupportedChainId.SOLANA_MAINNET
                ) {
                  await setkeyPairSolana();
                }
                dispatch(
                  addSelectedToken({
                    recieverAddress: item.ADDRESS,
                    nativeTokenInUsd,
                    amount: "0",
                  })
                );
                setCurrentStep(3);
                // }
              }}
            >
              <GenericBackgroundBoxContent
                imageSrc={Circle}
                title={item.NAME}
                address={conciseAddress(item.ADDRESS)}
                isAddress={true}
              />
            </GenericBackgroundBox>
          );
        })}
        {recentRecipient &&
          recentRecipient[chain as keyof typeof recentRecipient] && (
            <>
              <Text
                size={13}
                customColor="#5E5E64"
                className="addressBookStyle"
              >
                RECENT
              </Text>

              <GenericBackgroundBox
                style={{
                  opacity: validateAlladdress(
                    recentRecipient[chain as keyof typeof recentRecipient]
                  )[network]
                    ? 1
                    : 0.5,

                  pointerEvents: validateAlladdress(
                    recentRecipient[chain as keyof typeof recentRecipient]
                  )[network]
                    ? "auto"
                    : "none",
                }}
                margintop={10}
                onClick={async () => {
                  const nativeTokenInUsd = await fetchUsdRate(
                    NETWORKCHAIN[network as keyof typeof NETWORKCHAIN][
                      NATIVE_TOKEN_COINGECKO_ID
                    ]
                  );
                  if (
                    network === SupportedChainId.SOLANA_DEVNET ||
                    network === SupportedChainId.SOLANA_MAINNET
                  ) {
                    await setkeyPairSolana();
                  }
                  dispatch(
                    addSelectedToken({
                      recieverAddress:
                        recentRecipient[chain as keyof typeof recentRecipient],
                      nativeTokenInUsd,
                      amount: "0",
                    })
                  );
                  setCurrentStep(3);
                }}
              >
                <GenericBackgroundBoxContent
                  imageSrc={HistoryIcon}
                  title="Recent"
                  address={conciseAddress(
                    recentRecipient[chain as keyof typeof recentRecipient]
                  )}
                  isAddress={true}
                />
              </GenericBackgroundBox>
            </>
          )}
      </WrapperStyled>
    </motion.div>
  );
};

export default Step2;
