import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Profile = () => {
    const navigate = useNavigate();
    const { token } = useContext(AdminContext);  // Token from AdminContext
    const [profile, setProfile] = useState(null);  // Admin profile data
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: 'Male',
        image: null,
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data } = await axios.get(
                    `${backendUrl}/api/admin/get-profile`,
                    { headers: { token } }
                );
                if (data.success) {
                    setProfile(data.admin);
                    setFormData({
                        ...data.admin,
                        image: data.admin.image ? data.admin.image : null,
                    });
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (token) {
            getProfile();  // Fetch profile data when token is available
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleEditToggle = () => setIsEditing(!isEditing);

    const handleSave = async (e) => {
        e.preventDefault();
        // Add logic to save the form data
        // You can call an API to save the updated profile data here.
        setIsEditing(false);
    };

    return (
        <div className="m-5 w-full max-w-6xl">
            <div className="flex flex-row items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    {isEditing ? 'Edit Admin Profile' : 'Admin Profile'}
                </h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition duration-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
            </div>

            <div className="bg-white shadow-lg px-8 py-8 border rounded-lg w-full">
                {isEditing ? (
                    <form onSubmit={handleSave} className="text-gray-600">
                        <div className="flex items-center gap-6 mb-8">
                            <label htmlFor="admin-img">
                                <img
                                    className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-indigo-400 hover:border-indigo-600 transition-all"
                                    src={
                                        formData.image instanceof File
                                            ? URL.createObjectURL(formData.image)
                                            : formData.image
                                    }
                                    alt="Admin"
                                />
                            </label>
                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="admin-img"
                                hidden
                            />
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-700">Name</label>
                                <input
                                    onChange={handleInputChange}
                                    name="name"
                                    value={formData.name || ''}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Admin Name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender || 'Male'}
                                    onChange={handleInputChange}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-semibold">Change Password</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Old Password</label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordData.oldPassword || ''}
                                        onChange={handlePasswordChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword || ''}
                                        onChange={handlePasswordChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword || ''}
                                        onChange={handlePasswordChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                Save
                            </button>
                            <button
                                onClick={handleEditToggle}
                                type="button"
                                className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="flex items-center gap-6 mb-6">
                            <img
                                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
                                src={profile?.image || '/default-avatar.png'}
                                alt="Admin"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
                                <p className="text-gray-600">{formData.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold">Phone</h3>
                                <p>{formData.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Address</h3>
                                <p>{formData.address}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Gender</h3>
                                <p>{formData.gender}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleEditToggle}
                            className="mt-6 px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
