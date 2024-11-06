import axios from "axios";
import { createContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [employees, setEmployees] = useState([]);
    const [employeeProfile, setEmployeeProfile] = useState({}); // Initialize as an object

    const getAllEmployees = async () => {
        try {
            if (!token) return; // Ensure token exists
            const { data } = await axios.post(
                `${backendUrl}/api/admin/get-employees`,
                {},
                { headers: { token } }
            );
            if (data.success) {
                setEmployees(data.employees);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getEmployeeData = useCallback(
        async (empId) => {
            try {
                if (!token) return; // Ensure token exists
                const { data } = await axios.get(
                    `${backendUrl}/api/admin/employee-profile/${empId}`,
                    { headers: { token } }
                );
                if (data.success) {
                    setEmployeeProfile(data.employeeProfile);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        },
        [token] // Add token as a dependency
    );

    const value = {
        token,
        setToken,
        navigate,
        employees,
        getAllEmployees,
        employeeProfile,
        getEmployeeData,
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
