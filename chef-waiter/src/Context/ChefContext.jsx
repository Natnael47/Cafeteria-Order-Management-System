import { createContext, useState } from "react";

export const ChefContext = createContext();

const ChefContextProvider = (props) => {

    const [cToken, setCToken] = useState(localStorage.getItem('cToken') ? localStorage.getItem('cToken') : '');

    const value = {
        cToken, setCToken
    }
    return (
        <ChefContext.Provider value={value}>
            {props.children}
        </ChefContext.Provider>
    )
}

export default ChefContextProvider;