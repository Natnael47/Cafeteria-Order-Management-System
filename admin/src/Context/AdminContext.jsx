import axios from "axios";
import { createContext, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [profile, setProfile] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [time, setTime] = useState("monthly");
    const [reports, setReport] = useState([]);
    const [employeeProfile, setEmployeeProfile] = useState({}); // Initialize as an object
    const [dashboardData, setDashData] = useState({
        users: 0,
        employees: 0,
        orders: 0,
        latestOrders: [],
    });

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

    const getReport = async () => {
        try {
            if (!token) return; // Ensure token exists
            const response = await axios.post(
                `${backendUrl}/api/report/admin/reports`,
                {
                    "timePeriod": time
                },
                { headers: { token } }
            );
            if (response.data.success) {
                setReport(response.data.data);
                //console.log(response.data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/get-profile`,
                { headers: { token } }
            );
            if (data.success) {
                setProfile(data.admin);
                //console.log(data.admin);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/admin/get-profile`, { headers: { token } });
            if (data.success) {
                setUserData({
                    firstName: data.admin.firstName,
                    lastName: data.admin.lastName,
                    email: data.admin.email,
                    phone: data.admin.phone,
                    position: data.admin.position,
                    image: data.admin.image,
                    about: data.admin.about,
                    address: {
                        line1: data.admin.address.line1,
                        line2: data.admin.address.line2
                    },
                    date: data.admin.date
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
            toast.error(error.message);
        }
    };

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        image: null,
        about: '',
        address: { line1: '', line2: '' },
        date: ''
    });

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

    const updateEmployeeData = async (formData, employeeId) => {
        const form = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'address') {
                form.append('address', JSON.stringify(formData[key]));
            } else if (key === 'image' && formData[key] instanceof File) {
                form.append('image', formData[key]);
            } else {
                form.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/update-employee`,
                form,
                { headers: { token, 'Content-Type': 'multipart/form-data' } }
            );
            if (response.data.success) {
                toast.success('Employee profile updated successfully');
                await getEmployeeData(employeeId); // Refresh employee data
            } else {
                toast.error('Failed to update employee profile');
            }
        } catch (error) {
            console.error('Error updating employee profile:', error);
            toast.error('Failed to update employee profile');
        }
    };

    const deleteEmployee = async (employeeId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/employee/delete-employee`,
                { empId: employeeId },
                { headers: { token } }
            );
            if (response.data.success) {
                toast.success("Employee deleted successfully");
                navigate('/employees-list');
            } else {
                toast.error(response.data.message || "Failed to delete the employee");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete the employee");
        }
    };

    const getDashData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/admin/dashboard", { headers: { token } });
            if (response.data.success) {
                setDashData(response.data.data);
            } else {
                toast.error("Error fetching dashboard data");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        token,
        setToken,
        navigate,
        employees,
        getAllEmployees,
        employeeProfile,
        getEmployeeData,
        updateEmployeeData,
        deleteEmployee,
        dashboardData,
        getDashData,
        getProfile,
        profile, setProfile,
        loadUserProfileData, setUserData, userData,
        getReport, reports, setReport, time, setTime
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
