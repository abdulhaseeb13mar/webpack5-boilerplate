import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";

import AppFlowRoutes from "routes/app";
import AuthFlowRoutes from "routes/auth";
import { RootState } from "interfaces";

const Routes = () => {
  /* global-state */
  const { isLoggedIn } = useSelector((state: RootState) => state.app);

  /* local-state */

  /* hooks */

  /* functions */

  /* effects */

  return (
    <BrowserRouter>
      {isLoggedIn ? <AppFlowRoutes /> : <AuthFlowRoutes />}
    </BrowserRouter>
  );
};

export default Routes;
