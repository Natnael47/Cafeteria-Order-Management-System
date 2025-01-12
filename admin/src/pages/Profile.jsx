import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { AdminContext } from "../context/AdminContext";

Modal.setAppElement("#root");

const Profile = () => {
    const navigate = useNavigate();
    const { token, userData, setUserData, loadUserProfileData } = useContext(AdminContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for editable form data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: { line1: "", line2: "" },
        image: null,
    });

    // Load user profile data on mount
    useEffect(() => {
        loadUserProfileData();
    }, [loadUserProfileData]);

    // Populate formData with userData when opening the modal
    const openModal = () => {
        if (userData) {
            setFormData({
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                phone: userData.phone || "",
                address: userData.address || { line1: "", line2: "" },
                image: null,
            });
        }
        setIsModalOpen(true);
    };

    // Handle input changes
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
    };

    const handleUpdateProfile = async () => {
        const formPayload = new FormData();
        formPayload.append("firstName", formData.firstName);
        formPayload.append("lastName", formData.lastName);
        formPayload.append("email", formData.email);
        formPayload.append("phone", formData.phone);
        formPayload.append("address", JSON.stringify(formData.address)); // Pass address as a JSON string
        if (formData.image) {
            formPayload.append("image", formData.image); // Ensure the field is named 'image'
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/update-admin-profile`,
                formPayload,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        token,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setUserData(response.data.updatedProfile);
                setIsModalOpen(false);
                loadUserProfileData(); // Refresh data to ensure consistency
            } else {
                toast.error(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
        }
    };

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/admin/change-password`,
                {
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                },
                {
                    headers: { token },
                }
            );

            if (response.data.success) {
                toast.success("Password updated successfully!");
                setIsPasswordModalOpen(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                toast.error(response.data.message || "Failed to change password.");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("An error occurred while changing the password.");
        }
    };

    return (
        <div className="m-5 w-full max-w-6xl">
            {/* Header Section */}
            <div className="flex flex-row items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Admin profile</h1>
            </div>

            {userData ? (
                <div className="bg-white shadow-xl px-8 py-5 border rounded-lg w-full">
                    {/* Profile Info */}
                    <div className="flex items-center gap-6 mb-6">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
                            src={`${backendUrl}/empIMG/${userData.image}`}
                            alt={`${userData.firstName}'s profile`}
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                {`${userData.firstName} ${userData.lastName}`}
                            </h2>
                            <p className="text-xl text-gray-600">{userData.email}</p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg">Phone</h3>
                            <p>{userData.phone}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Address</h3>
                            <p>
                                {userData.address.line1}, {userData.address.line2}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button
                            onClick={openModal}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg shadow-lg hover:bg-red-700"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white rounded-lg shadow-xl w-[800px] mx-auto p-8 outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center"
            >
                <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                <form className="space-y-6">
                    <div className="flex items-center gap-4 mb-8 text-gray-500">
                        <label htmlFor="profile-img">
                            <img
                                className="w-24 h-24 border-2 border-blue-300 bg-gray-100 rounded-full cursor-pointer object-cover"
                                src={
                                    formData.image
                                        ? URL.createObjectURL(formData.image)
                                        : `${backendUrl}/empIMG/${userData.image}`
                                }
                                alt="Current Profile"
                            />
                        </label>
                        <input
                            id="profile-img"
                            type="file"
                            onChange={handleImageChange}
                            hidden
                        />
                        <p>Upload New Picture</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="First Name"
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Last Name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Email"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Phone"
                            />
                        </div>

                        {/* Address Line 1 */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Address Line 1</label>
                            <input
                                type="text"
                                name="line1"
                                value={formData.address.line1}
                                onChange={handleAddressChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Address Line 1"
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Address Line 2</label>
                            <input
                                type="text"
                                name="line2"
                                value={formData.address.line2}
                                onChange={handleAddressChange}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Address Line 2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        {/* Save Changes Button */}
                        <button
                            onClick={handleUpdateProfile}
                            type="button"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                        >
                            Save Changes
                        </button>

                        {/* Cancel Button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onRequestClose={() => setIsPasswordModalOpen(false)}
                className="bg-white rounded-lg shadow-xl w-[800px] mx-auto p-8 outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Change Password</h2>
                <div className="space-y-6">
                    {/* Old Password */}
                    <div className="flex flex-col relative">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Old Password</label>
                        <input
                            type={showOldPassword ? "text" : "password"} // Toggle input type
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            placeholder="Enter your current password"
                        />
                        <button
                            type="button"
                            className="absolute top-10 right-3 text-[#22C55E] hover:text-green-700"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <Eye /> : <EyeOff />}
                        </button>
                    </div>

                    {/* New Password and Confirm Password */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* New Password */}
                        <div className="flex flex-col relative">
                            <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"} // Toggle input type
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                placeholder="Enter a new password"
                            />
                            <button
                                type="button"
                                className="absolute top-10 right-3 text-[#22C55E] hover:text-green-700"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col relative">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"} // Toggle input type
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                placeholder="Confirm your new password"
                            />
                            <button
                                type="button"
                                className="absolute top-10 right-3 text-[#22C55E] hover:text-green-700"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-between gap-4 mt-8">
                    <button
                        onClick={handleChangePassword}
                        className="w-1/2 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Change Password
                    </button>
                    <button
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="w-1/2 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>

        </div>
    );


};

export default Profile;
