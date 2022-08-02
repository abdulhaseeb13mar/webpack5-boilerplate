import { FC } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

import { RootState } from "interfaces";
import "./Components.css";

const Background: FC = () => {
  /* global-state */
  const { isLoggedIn } = useSelector((state: RootState) => state.app);

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <motion.div
      transition={{ duration: 1.1, ease: "easeInOut" }}
      layout
      className={`bg__container_${isLoggedIn ? "loggedin" : "loggedout"}`}
    >
      <motion.div
        layout
        transition={{ duration: 1.1, ease: "easeInOut" }}
        className="blob blob-one"
      ></motion.div>
      {/* <div className="blob blob-two"></div> */}
      {/* <div className="blob blob-three"></div> */}
    </motion.div>
  );
};

export default Background;
