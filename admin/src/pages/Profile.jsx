import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Profile = () => {
    const navigate = useNavigate();
    const { token, userData, setUserData, loadUserProfileData } = useContext(AdminContext);
    const [editMode, setEditMode] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: { line1: '', line2: '' },
        image: null,
    });

    useEffect(() => {
        loadUserProfileData();
    }, [loadUserProfileData]);

    useEffect(() => {
        if (userData) {
            setUpdatedData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || { line1: '', line2: '' },
                image: null,
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setUpdatedData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handleUpdateProfile = async () => {
        const formData = new FormData();
        formData.append('firstName', updatedData.firstName);
        formData.append('lastName', updatedData.lastName);
        formData.append('email', updatedData.email);
        formData.append('phone', updatedData.phone);
        formData.append('address[line1]', updatedData.address.line1);
        formData.append('address[line2]', updatedData.address.line2);
        if (updatedData.image) {
            formData.append('image', updatedData.image);
        }

        // Log form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.post(`${backendUrl}/api/admin/update-admin-profile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token,
                },
            });

            if (response.data.success) {
                alert('Profile updated successfully!');
                setUserData(response.data.updatedProfile);
                setEditMode(false);
                loadUserProfileData(); // Ensure latest data is fetched
            } else {
                alert(response.data.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };


    return (
        <div className="m-5 w-full max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Admin Profile</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
            </div>

            {userData ? (
                <div className="bg-white shadow-xl px-8 py-8 border rounded-lg w-full">
                    <div className="flex items-center gap-6 mb-6">
                        <img
                            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
                            src={updatedData.image ? URL.createObjectURL(updatedData.image) : `${backendUrl}/empIMG/${userData.image}`}
                            alt={`${updatedData.firstName}'s profile`}
                        />
                        <div>
                            {editMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={updatedData.firstName}
                                        onChange={handleInputChange}
                                        className="border-b-2 border-gray-300 p-1"
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={updatedData.lastName}
                                        onChange={handleInputChange}
                                        className="border-b-2 border-gray-300 p-1 ml-2"
                                        placeholder="Last Name"
                                    />
                                </>
                            ) : (
                                <h2 className="text-3xl font-bold text-gray-800">
                                    {`${userData.firstName} ${userData.lastName}`}
                                </h2>
                            )}
                            <p className="text-xl text-gray-600">
                                {editMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={updatedData.email}
                                        onChange={handleInputChange}
                                        className="border-b-2 border-gray-300 p-1"
                                        placeholder="Email"
                                    />
                                ) : (
                                    userData.email
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg">Phone</h3>
                            {editMode ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={updatedData.phone}
                                    onChange={handleInputChange}
                                    className="border-b-2 border-gray-300 p-1"
                                    placeholder="Phone"
                                />
                            ) : (
                                <p>{userData.phone}</p>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Address</h3>
                            {editMode ? (
                                <>
                                    <input
                                        type="text"
                                        name="line1"
                                        value={updatedData.address.line1}
                                        onChange={handleAddressChange}
                                        className="border-b-2 border-gray-300 p-1"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        type="text"
                                        name="line2"
                                        value={updatedData.address.line2}
                                        onChange={handleAddressChange}
                                        className="border-b-2 border-gray-300 p-1 mt-2"
                                        placeholder="Address Line 2"
                                    />
                                </>
                            ) : (
                                <p>{userData.address.line1}, {userData.address.line2}</p>
                            )}
                        </div>
                    </div>

                    {editMode && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg">Profile Image</h3>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="border p-2 rounded-lg"
                            />
                        </div>
                    )}

                    <div className="mt-6 flex gap-4">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleUpdateProfile}
                                    className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setEditMode(false)}
                                    className="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
