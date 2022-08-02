import { FC } from "react";
import { Routes, Route } from "react-router-dom";

import {
  Dashboard,
  Send,
  Swap,
  Settings,
  Near,
  DappConnect,
  DappChangeNetwork,
  DappTransaction,
} from "popup/app";
import { withRouter } from "utils/withRouter";
import { APPSCREENS } from "theme/constants";
import { Seedphrase } from "popup/auth";

const AppFlowRoutes: FC = () => {
  return (
    <Routes>
      <Route path={APPSCREENS.dashboard} element={<Dashboard />} />
      {/* <Route
            path={APPSCREENS.importAccount}
            element={<Import accountImport={true} />}
          /> */}
      {/* <Route path={APPSCREENS.importAccount} element={<ImportAccount />} /> */}
      <Route path={APPSCREENS.settings} element={<Settings />} />
      <Route path={APPSCREENS.dapp}>
        <Route path={APPSCREENS.connect} element={<DappConnect />} />
        <Route
          path={APPSCREENS.changeNetwork}
          element={<DappChangeNetwork />}
        />
        <Route path={APPSCREENS.tx} element={<DappTransaction />} />
      </Route>
      <Route path={APPSCREENS.send} element={<Send />} />
      <Route path={APPSCREENS.swap} element={<Swap />} />
      <Route path={APPSCREENS.near} element={<Near />} />
      <Route path={APPSCREENS.seedphrase} element={<Seedphrase />} />
    </Routes>
  );
};

export default withRouter(AppFlowRoutes as any);
