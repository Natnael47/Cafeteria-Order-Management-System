import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const navigate = useNavigate()

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

    const value = {
        token, setToken, navigate
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;