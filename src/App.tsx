import { Provider } from "react-redux";
import "./styles.css";
import Child from "./child1";

import { store } from "@redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <Child />
    </Provider>
  );
};

export default App;
