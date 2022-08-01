/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";

import { Notes, Person, Wallet } from "assets/Icons";
import { AddressInsertionProps as PROPS } from "interfaces";
import { StartAdornment, BasicModal, SearchBar } from "components";
import { AddressInsertionStyled, GenericBox, Text } from "@styled";
import { addSelectedToken, addToAddressBook } from "@slices/sendTransaction";

const AddressInsertionComponent: FC<PROPS> = ({
  open,
  handleClose,
  setOpen,
  walletAddress,
  navigate,
}) => {
  /* global-state */

  /* local-state */
  const [value, setValue] = useState({
    NAME: "",
    ADDRESS: "",
    NOTE: "",
  });

  /* hooks */
  const dispatch = useDispatch();

  /* functions */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length < 45) {
      setValue({ ...value, [event.target.name]: event.target.value });
    }
  };

  const handleSave = () => {
    if (
      value.NAME.length > 0 &&
      value.NAME.length < 22 &&
      value.ADDRESS.length > 0
    ) {
      dispatch(addToAddressBook(value));

      dispatch(addSelectedToken({ recieverAddress: value.ADDRESS }));
      setOpen(false);
      navigate(3);
    }
  };

  /* effects */
  useEffect(() => {
    setValue({
      ...value,
      ADDRESS: walletAddress,
    });
  }, [walletAddress]);

  /* constants */
  type ContentType = {
    title: keyof typeof value;
    placeholder: string;
    icon: string;
  }[];

  const Content: ContentType = [
    {
      title: "ADDRESS",
      placeholder: "Type address or ENS...",
      icon: Wallet,
    },
    {
      title: "NAME",
      placeholder: "Enter nickname",
      icon: Person,
    },
    {
      title: "NOTE",
      placeholder: "Write any note",
      icon: Notes,
    },
  ];

  return (
    <BasicModal open={open} handleClose={handleClose} zoom={true}>
      <AddressInsertionStyled>
        <Text size={16} weight={400} customStyle={{ marginTop: "12px" }}>
          Add New Contact
        </Text>
        {Content.map((item, index) => {
          return (
            <div key={index}>
              <Text
                size={13}
                weight={600}
                customColor="#5E5E64"
                className="addressBookStyle"
                customStyle={{ marginBottom: "10px", paddingLeft: "10px" }}
              >
                {item.title}
              </Text>
              <SearchBar
                onChange={handleChange}
                name={item.title.toString()}
                placeholder={item.placeholder}
                value={value[item.title]}
                StartAdornment={<StartAdornment Icon={item.icon} />}
                customPadding={6}
                disable={item.title === "ADDRESS" ? true : false}
              />
            </div>
          );
        })}
        <GenericBox
          style={{
            padding: "10px 16px",
            fontSize: "15px",
            fontWeight: "500",
            marginTop: "25px",
            cursor: !value.NAME || !value.ADDRESS ? "not-allowed" : "pointer",
          }}
          onClick={handleSave}
        >
          Save
        </GenericBox>
      </AddressInsertionStyled>
    </BasicModal>
  );
};

export default AddressInsertionComponent;
