import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AppContextProvider from "./Context/AppContext.jsx";
import ChefContextProvider from "./Context/ChefContext.jsx";
import WaiterContextProvider from "./Context/WaiterContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChefContextProvider>
      <WaiterContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </WaiterContextProvider>
    </ChefContextProvider>
  </BrowserRouter>
);
