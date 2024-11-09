import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AppContextProvider from "./Context/AppContext.jsx";
import ChefContextProvider from "./Context/ChefContext.jsx";
import InventoryContextProvide from "./Context/InventoryContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChefContextProvider>
      <InventoryContextProvide>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </InventoryContextProvide>
    </ChefContextProvider>
  </BrowserRouter>
);
