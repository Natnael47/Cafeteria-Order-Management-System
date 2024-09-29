import { createContext } from "react";

export const WaiterContext = createContext();

const WaiterContextProvider = (props) => {
    const value = {


    }
    return (
        <WaiterContext.Provider value={value}>
            {props.children}
        </WaiterContext.Provider>
    )
}

export default WaiterContextProvider;