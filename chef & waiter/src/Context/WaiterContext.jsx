import { createContext, useState } from "react";

export const WaiterContext = createContext();

const WaiterContextProvider = (props) => {

    const [wToken, setWToken] = useState(localStorage.getItem('wToken') ? localStorage.getItem('wToken') : '');

    const value = {
        wToken, setWToken
    }
    return (
        <WaiterContext.Provider value={value}>
            {props.children}
        </WaiterContext.Provider>
    )
}

export default WaiterContextProvider;