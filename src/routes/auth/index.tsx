import { FC, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useDispatch } from "react-redux";

import { APPSCREENS, AUTHSCREENS } from "theme/constants";
import { withRouter } from "utils/withRouter";
import { Landing } from "popup/auth";
import Seedphrase from "popup/auth/SeedPhrase";
import { getStorageSyncValue } from "@constants";
import { USERINFO } from "interfaces";
import { checkUser } from "@slices/appSlice";

const AuthFlowRoutes: FC = () => {
  /* global-state */

  /* local-state */

  /* hooks */
  const dispatch = useDispatch();
  const location = useLocation();

  /* functions */

  /* effects */
  useEffect(() => {
    const fetchUserInformation = async () => {
      const isUserExists = (await getStorageSyncValue("userInfo")) as USERINFO;

      let userLength = Object.keys(isUserExists as object).length;

      if (userLength === 0) {
        console.log("signup");
        dispatch(checkUser(false));
      } else {
        dispatch(checkUser(true));
        console.log("login");
      }
    };

    fetchUserInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames="fade" timeout={800}>
        <Routes>
          <Route path={AUTHSCREENS.landing} element={<Landing />} />
          <Route path={AUTHSCREENS.seedphrase} element={<Seedphrase />} />
          <Route path={APPSCREENS.near} element={<Landing />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default withRouter(AuthFlowRoutes);
