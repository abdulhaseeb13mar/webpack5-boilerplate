import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

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
          <Child />
        </Theme>
      </PersistGate>
    </Provider>
  );
};

export default App;
