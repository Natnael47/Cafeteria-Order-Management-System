import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';

const EmployeesList = () => {

    const { token, employees, getAllEmployees } = useContext(AdminContext);

    useEffect(() => {
        if (token) {
            getAllEmployees();
        }
    }, [token]);

    return (
        <div>

        </div>
    )
}

export default EmployeesList