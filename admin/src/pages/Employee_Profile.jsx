import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Employee_Profile = () => {
    const { employeeId } = useParams();
    const { getEmployeeData, employeeProfile } = useContext(AdminContext);

    useEffect(() => {
        if (employeeId) {
            getEmployeeData(employeeId);
        }
    }, [employeeId, getEmployeeData]);

    // Show a loading message if the employee profile is not yet loaded
    if (!employeeProfile) return <p>Loading...</p>;

    // Extract properties with default values to avoid undefined errors
    const {
        firstName = "", lastName = "", gender = "", email = "", phone = "",
        position = "", experience = "", salary = "", shift = "", education = "",
        about = "", address = {}, image = ""
    } = employeeProfile;

    return (
        <div className="m-5 w-full">
            <p className="mb-3 text-lg font-semibold">Employee Profile</p>
            <div className="bg-white px-8 py-8 border rounded w-full max-w-5xl max-h-[88vh] overflow-scroll">

                <div className="flex items-center gap-4 mb-8 text-gray-700">
                    <img
                        className="w-[200px] rounded-full"
                        src={`${backendUrl}/empIMG/${image}`}
                        alt="Employee"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">
                            {firstName} {lastName}
                        </h2>
                        <p className="text-gray-500">{position}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-gray-600">
                    <div>
                        <h3 className="font-semibold">Personal Information</h3>
                        <p><strong>Gender:</strong> {gender}</p>
                        <p><strong>Email:</strong> {email}</p>
                        <p><strong>Phone:</strong> {phone}</p>
                        <p><strong>Address:</strong> {address.line1 || ""}, {address.line2 || ""}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Professional Details</h3>
                        <p><strong>Experience:</strong> {experience}</p>
                        <p><strong>Salary:</strong> ${salary}</p>
                        <p><strong>Shift:</strong> {shift}</p>
                        <p><strong>Education:</strong> {education}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold">About</h3>
                    <p className="whitespace-pre-wrap">{about}</p>
                </div>
            </div>
        </div>
    );
};

export default Employee_Profile;
