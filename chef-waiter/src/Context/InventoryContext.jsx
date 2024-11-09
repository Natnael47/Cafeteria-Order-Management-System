import { createContext, useState } from "react";

export const InventoryContext = createContext();

const InventoryContextProvide = (props) => {

    const [iToken, setIToken] = useState(localStorage.getItem('iToken') ? localStorage.getItem('iToken') : '');

    const value = {
        iToken, setIToken
    }
    return (
        <InventoryContext.Provider value={value}>
            {props.children}
        </InventoryContext.Provider>
    )
}

export default InventoryContextProvide;