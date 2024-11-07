import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Employee_Profile = () => {
    const { employeeId } = useParams();
    const { getEmployeeData, employeeProfile, token } = useContext(AdminContext);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    // Fetch employee data when employeeId changes
    useEffect(() => {
        if (employeeId) {
            getEmployeeData(employeeId);
        }
    }, [employeeId, getEmployeeData]);

    // Update form data when employee profile changes
    useEffect(() => {
        if (employeeProfile) {
            setFormData(employeeProfile);
        }
    }, [employeeProfile]);

    if (!employeeProfile) return <p>Loading...</p>;

    // Handle changes in simple input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle changes in nested address fields
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    // Toggle between edit and view mode
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Save updated profile data to backend
    const handleSave = async (e) => {
        e.preventDefault();

        try {
            // Prepare form data for submission
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "address" && typeof formData[key] === "object") {
                    form.append(key, JSON.stringify(formData[key]));
                } else {
                    form.append(key, formData[key]);
                }
            });

            // Append image file if it is a File object
            if (formData.image instanceof File) {
                form.append("image", formData.image);
            }

            // Send POST request to update employee data
            await axios.post(`${backendUrl}/api/admin/update-employee`, form, {
                headers: { token: token },
            });

            setIsEditing(false);
            getEmployeeData(employeeId); // Refresh employee data after update
        } catch (error) {
            console.error("Error updating employee profile:", error);
        }
    };

    return (
        <div className="m-5 w-full">
            <p className="mb-3 text-lg font-semibold">Employee Profile</p>
            <div className="bg-white px-8 py-8 border rounded w-full max-w-5xl max-h-[88vh] overflow-scroll">
                {isEditing ? (
                    <form onSubmit={handleSave} className="text-gray-600">
                        <div className="flex items-center gap-4 mb-8">
                            <label htmlFor="emp-img">
                                <img
                                    className="w-16 rounded-full cursor-pointer"
                                    src={
                                        formData.image instanceof File
                                            ? URL.createObjectURL(formData.image)
                                            : `${backendUrl}/empIMG/${employeeProfile.image}`
                                    }
                                    alt="Employee"
                                />
                            </label>
                            <input
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                type="file"
                                id="emp-img"
                                hidden
                            />
                            <input
                                onChange={handleInputChange}
                                name="firstName"
                                value={formData.firstName || ''}
                                className="border rounded px-3 py-2"
                                placeholder="First Name"
                                required
                            />
                            <input
                                onChange={handleInputChange}
                                name="lastName"
                                value={formData.lastName || ''}
                                className="border rounded px-3 py-2"
                                placeholder="Last Name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold">Personal Information</h3>
                                <input
                                    onChange={handleInputChange}
                                    name="gender"
                                    value={formData.gender || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Gender"
                                />
                                <input
                                    onChange={handleInputChange}
                                    name="email"
                                    value={formData.email || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Email"
                                    type="email"
                                />
                                <input
                                    onChange={handleInputChange}
                                    name="phone"
                                    value={formData.phone || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Phone"
                                />
                                <input
                                    onChange={handleAddressChange}
                                    name="line1"
                                    value={formData.address?.line1 || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Address Line 1"
                                />
                                <input
                                    onChange={handleAddressChange}
                                    name="line2"
                                    value={formData.address?.line2 || ''}
                                    className="border rounded px-3 py-2 mt-2"
                                    placeholder="Address Line 2"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">Professional Details</h3>
                                <input
                                    onChange={handleInputChange}
                                    name="experience"
                                    value={formData.experience || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Experience"
                                />
                                <input
                                    onChange={handleInputChange}
                                    name="salary"
                                    value={formData.salary || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Salary"
                                    type="number"
                                />
                                <input
                                    onChange={handleInputChange}
                                    name="shift"
                                    value={formData.shift || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Shift"
                                />
                                <input
                                    onChange={handleInputChange}
                                    name="education"
                                    value={formData.education || ''}
                                    className="border rounded px-3 py-2"
                                    placeholder="Education"
                                />
                            </div>
                        </div>

                        <textarea
                            onChange={handleInputChange}
                            name="about"
                            value={formData.about || ''}
                            className="w-full px-4 pt-2 border rounded mt-4"
                            placeholder="About"
                            rows={5}
                        />
                        <button type="submit" className="bg-black px-6 py-2 mt-4 text-white rounded-md">
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <img className="w-[200px] rounded-full"
                                src={`${backendUrl}/empIMG/${employeeProfile.image}`} alt="Employee" />
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {employeeProfile.firstName} {employeeProfile.lastName}
                                </h2>
                                <p className="text-gray-500">{employeeProfile.position}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold">Personal Information</h3>
                                <p><strong>Gender:</strong> {employeeProfile.gender}</p>
                                <p><strong>Email:</strong> {employeeProfile.email}</p>
                                <p><strong>Phone:</strong> {employeeProfile.phone}</p>
                                <p><strong>Address:</strong> {employeeProfile.address?.line1}, {employeeProfile.address?.line2}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Professional Details</h3>
                                <p><strong>Experience:</strong> {employeeProfile.experience}</p>
                                <p><strong>Salary:</strong> ${employeeProfile.salary}</p>
                                <p><strong>Shift:</strong> {employeeProfile.shift}</p>
                                <p><strong>Education:</strong> {employeeProfile.education}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="font-semibold">About</h3>
                            <p className="whitespace-pre-wrap">{employeeProfile.about}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleEditToggle} className="bg-black px-6 py-2 mt-4 text-white rounded-md">
                    {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
            </div>
        </div>
    );
};

export default Employee_Profile;
