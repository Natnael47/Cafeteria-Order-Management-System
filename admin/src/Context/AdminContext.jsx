import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const navigate = useNavigate()

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

    const [employees, setEmployees] = useState([]);

    const getAllEmployees = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/get-employees', {}, { headers: { token } });
            if (data.success) {
                setEmployees(data.employees);
                console.log(data.employees);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);

        }
    }

    const value = {
        token, setToken, navigate, employees, getAllEmployees
    }
    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;