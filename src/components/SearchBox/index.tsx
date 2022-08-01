import { FC } from "react";

import { SearchBarProps as PROPS } from "interfaces";
import { Search, StyledInputBase } from "@styled";

const SearchBar: FC<PROPS> = ({
  placeholder,
  onChange,
  value,
  customPadding,
  StartAdornment,
  EndAdornment,
  name,
  disable,
}) => {
  return (
    <div>
      <Search>
        <StyledInputBase
          placeholder={placeholder}
          inputProps={{ "aria-label": "search" }}
          value={value}
          name={name}
          onChange={onChange}
          padding={customPadding}
          startAdornment={StartAdornment}
          endAdornment={EndAdornment}
          autoComplete="off"
          readOnly={disable}
        />
      </Search>
    </div>
  );
};

export default SearchBar;
