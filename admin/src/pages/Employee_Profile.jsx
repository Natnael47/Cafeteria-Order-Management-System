// Employee_Profile.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext'; // Adjust the path if necessary

const Employee_Profile = () => {
    const { employeeData } = useContext(AdminContext); // Assuming employeeData is an array of employees
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        // Set default selected employee on load, adjust index as necessary
        if (employeeData && employeeData.length > 0) {
            setSelectedEmployee(employeeData[0]);
        }
    }, [employeeData]);

    if (!selectedEmployee) {
        return <p>Loading...</p>;
    }

    const {
        firstName,
        lastName,
        gender,
        email,
        phone,
        position,
        shift,
        education,
        experience,
        salary,
        address,
        about,
    } = selectedEmployee;

    return (
        <div className="employee-profile">
            <h2>{firstName} {lastName}</h2>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Position:</strong> {position}</p>
            <p><strong>Shift:</strong> {shift}</p>
            <p><strong>Education:</strong> {education}</p>
            <p><strong>Experience:</strong> {experience}</p>
            <p><strong>Salary:</strong> ${salary}</p>
            <div>
                <strong>Address:</strong>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
            </div>
            <p><strong>About:</strong> {about}</p>
        </div>
    );
};

export default Employee_Profile;
