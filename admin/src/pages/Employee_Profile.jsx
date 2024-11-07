import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Employee_Profile = () => {
    const { employeeId } = useParams();
    const { getEmployeeData, employeeProfile, token } = useContext(AdminContext);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'Male',
        phone: '',
        position: 'Executive Chef',
        shift: 'Opening Shift',
        education: '',
        experience: '1 Year',
        salary: '',
        address: { line1: '', line2: '' },
        about: '',
        image: null,
    });

    const [originalImage, setOriginalImage] = useState(null); // To track the original image before any changes

    useEffect(() => {
        if (employeeId && !isEditing) {
            getEmployeeData(employeeId);
        }
    }, [employeeId, isEditing, getEmployeeData]);

    useEffect(() => {
        if (employeeProfile) {
            setFormData({
                ...employeeProfile,
                address: employeeProfile.address || { line1: '', line2: '' },
                image: `${backendUrl}/empIMG/${employeeProfile.image}`
            });
            setOriginalImage(employeeProfile.image); // Save the original image for canceling changes
        }
    }, [employeeProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

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

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            ...employeeProfile,
            address: employeeProfile.address || { line1: '', line2: '' },
            image: `${backendUrl}/empIMG/${employeeProfile.image}`,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "address") {
                    form.append(key, JSON.stringify(formData[key]));
                } else {
                    form.append(key, formData[key]);
                }

            });
            //console.log("Form Data being sent:", formData);
            if (formData.image instanceof File) form.append("image", formData.image);

            await axios.post(`${backendUrl}/api/admin/update-employee`, form, { headers: { token } });
            setIsEditing(false);
            toast.success("Employee profile updated successfully");
            getEmployeeData(employeeId);
        } catch (error) {
            console.error("Error updating employee profile:", error);
            toast.error("Failed to update employee profile");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // console.log("Selected Image:", file); // Log the selected file
        setFormData((prev) => ({ ...prev, image: file }));
    };


    return (
        <div className="m-5 w-full">
            <p className="mb-3 text-lg font-semibold">{isEditing ? "Edit Employee" : "Employee Profile"}</p>
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
                                            : formData.image
                                    }
                                    alt="Employee"
                                />
                            </label>
                            <input
                                onChange={handleImageChange}
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

                        <div className="flex flex-col lg:flex-row items-start gap-10">
                            <div className="flex flex-col gap-4 w-full lg:flex-1">
                                <div>
                                    <label>Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full lg:flex-1">
                                <div>
                                    <label>Position</label>
                                    <select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="Executive Chef">Executive Chef</option>
                                        <option value="Pastry Chef">Pastry Chef</option>
                                        <option value="Waitstaff/Servers">Waitstaff/Servers</option>
                                        <option value="Baristas">Baristas</option>
                                        <option value="Bartenders">Bartenders</option>
                                        <option value="Cashier">Cashier</option>
                                        <option value="Inventory Manager">Inventory Manager</option>
                                        <option value="Bar Manager">Bar Manager</option>
                                        <option value="Cleaner/Janitorial Staff">Cleaner/Janitorial Staff</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Shift</label>
                                    <select
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="Opening Shift">Opening Shift</option>
                                        <option value="Midday Shift">Midday Shift</option>
                                        <option value="Afternoon Shift">Afternoon Shift</option>
                                        <option value="Closing Shift">Closing Shift</option>
                                        <option value="Weekend Shift">Weekend Shift</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Education</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Experience</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                    >
                                        <option value="1 Year">1 Year</option>
                                        <option value="2 Year">2 Years</option>
                                        <option value="3 Year">3 Years</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Salary</label>
                                    <input
                                        type="number"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        className="border rounded px-3 py-2 w-full"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Address</label>
                            <input
                                type="text"
                                name="line1"
                                value={formData.address.line1 || ''}
                                onChange={handleAddressChange}
                                className="border rounded px-3 py-2 w-full mt-2"
                                placeholder="Address Line 1"
                            />
                            <input
                                type="text"
                                name="line2"
                                value={formData.address.line2 || ''}
                                onChange={handleAddressChange}
                                className="border rounded px-3 py-2 w-full mt-2"
                                placeholder="Address Line 2"
                            />
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button type="button" onClick={handleCancelEdit} className="btn btn-danger">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-gray-600">
                        <div className="flex items-center gap-4 mb-8">
                            <img
                                className="w-16 rounded-full"
                                src={formData.image}
                                alt="Employee"
                            />
                            <p className="text-lg">{`${formData.firstName} ${formData.lastName}`}</p>
                        </div>

                        <div className="flex flex-col gap-6 lg:flex-row">
                            <div className="flex flex-col gap-4 w-full lg:flex-1">
                                <p><strong>Email:</strong> {formData.email}</p>
                                <p><strong>Phone:</strong> {formData.phone}</p>
                                <p><strong>Gender:</strong> {formData.gender}</p>
                                <p><strong>Position:</strong> {formData.position}</p>
                            </div>
                            <div className="flex flex-col gap-4 w-full lg:flex-1">
                                <p><strong>Shift:</strong> {formData.shift}</p>
                                <p><strong>Education:</strong> {formData.education}</p>
                                <p><strong>Experience:</strong> {formData.experience}</p>
                                <p><strong>Salary:</strong> ${formData.salary}</p>
                            </div>
                        </div>

                        <div>
                            <p><strong>Address:</strong></p>
                            <p>{formData.address.line1}</p>
                            <p>{formData.address.line2}</p>
                        </div>

                        <div>
                            <p><strong>About:</strong> {formData.about}</p>
                        </div>

                        <div className="mt-4">
                            <button onClick={handleEditToggle} className="btn btn-primary">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employee_Profile;
