import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const Employee_Profile = () => {
    const { employeeId } = useParams();
    const { getEmployeeData, employeeProfile } = useContext(AdminContext);

    useEffect(() => {
        if (employeeId) {
            getEmployeeData(employeeId);
        }
    }, [employeeId]); // Only depend on employeeId

    return (
        <div>
            <h1>Employee Profile</h1>
            <pre>{JSON.stringify(employeeProfile, null, 2)}</pre>
        </div>
    );
};

export default Employee_Profile;
