import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { store } from "@redux/store";
import Routing from "routes/index";
import Theme from "theme";

let persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Theme>
          <Routing />
        </Theme>
      </PersistGate>
    </Provider>
  );
}

export default App;
