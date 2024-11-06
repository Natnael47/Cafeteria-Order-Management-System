import axios from "axios";
import { createContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
    const [employees, setEmployees] = useState([]);
    const [employeeProfile, setEmployeeProfile] = useState([]);

    const getAllEmployees = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/get-employees', {}, { headers: { token } });
            if (data.success) {
                setEmployees(data.employees);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getEmployeeData = useCallback(async (empId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/employee-profile/${empId}`, { headers: { token } });
            if (data.success) {
                setEmployeeProfile(data.employeeProfile);
                console.log(data.employeeProfile);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, []); // Use an empty dependency array to memoize the function

    const value = {
        token, setToken,
        navigate,
        employees, getAllEmployees,
        employeeProfile, getEmployeeData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
