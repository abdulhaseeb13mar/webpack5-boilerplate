import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import Routing from "routes/index";
import "./index.css";
import Child from "./child1";
import Theme from "theme";

import { store } from "@redux/store";

let persistor = persistStore(store);

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Theme>
          <Routing />
          {/* <Child /> */}
        </Theme>
      </PersistGate>
    </Provider>
  );
};

export default App;
