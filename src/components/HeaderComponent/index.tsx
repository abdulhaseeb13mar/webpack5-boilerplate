import { useNavigate } from "react-router-dom";

import { QuestionCircle, PurpleBackDrop } from "assets/images";
import { ArrowBackIosIcon } from "assets/Icons";
import { ImageContent, Text, ScreenHeaderStyled } from "@styled";

const HeaderComponent = () => {
  /* global-state */

  /* local-state */

  /* hooks */
  const navigate = useNavigate();

  /* functions */
  const func = () => navigate(-1);

  /* effects */

  return (
    <ScreenHeaderStyled
      key="header"
      layout
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={PurpleBackDrop}
        alt="backdrop"
        className="screen-header-backdrop"
      />
      <div className="r-c-c screen-header-back" onClick={func}>
        <ArrowBackIosIcon sx={{ fontSize: 15, color: "#DED4EF" }} />
        <Text size={13} customColor="#DED4EF">
          Back
        </Text>
      </div>
      <Text dim size={20}>
        Title
      </Text>
      <ImageContent
        Logo={false}
        Opacity={true}
        top={false}
        src={QuestionCircle}
        alt=""
      />
    </ScreenHeaderStyled>
  );
};

export default HeaderComponent;
