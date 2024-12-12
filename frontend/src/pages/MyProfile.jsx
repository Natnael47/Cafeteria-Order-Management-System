// Import necessary modules
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const MyProfile = () => {
    // Context and state management
    const { userData, setUserData, token, loadUserProfileData } = useContext(StoreContext);
    const [currentView, setCurrentView] = useState("viewProfile"); // Tracks the active section

    // State for editing profile, address, and password
    const [editedData, setEditedData] = useState({});
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [updatedAddress, setUpdatedAddress] = useState({
        line1: "",
        line2: "",
    });

    // Load user data into state when the component mounts
    useEffect(() => {
        setEditedData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            gender: userData.gender || "",
            phone: userData.phone || "",
            dob: userData.dob || "",
        });
        setUpdatedAddress(userData.address || { line1: "", line2: "" });
    }, [userData]);

    // Handle profile data submission
    const handleProfileEdit = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/update-profile`,
                editedData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setCurrentView("viewProfile");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the profile.");
        }
    };

    // Handle address update submission
    const handleAddressUpdate = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/update-profile`, // Using the same API endpoint as requested
                { ...editedData, address: updatedAddress },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setCurrentView("viewProfile");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the address.");
        }
    };

    // Handle password change submission
    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/change-password`,
                {
                    currentPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setCurrentView("viewProfile");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while changing the password.");
        }
    };

    return (
        <div className="flex h-[80vh]">
            {/* Sidebar Navigation */}
            <div className="w-[250px] flex flex-col p-4 max-h-[75vh] gap-4 border-r border-gray-300">
                <button
                    className={`py-3 px-4 rounded-lg border font-semibold transition-colors ${currentView === "editProfile" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setCurrentView(currentView === "editProfile" ? "viewProfile" : "editProfile")}
                >
                    Edit Profile
                </button>
                <button
                    className={`py-3 px-4 rounded-lg border font-semibold transition-colors ${currentView === "changePassword" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setCurrentView(currentView === "changePassword" ? "viewProfile" : "changePassword")}
                >
                    Change Password
                </button>
                <button
                    className={`py-3 px-4 rounded-lg border font-semibold transition-colors ${currentView === "updateAddress" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setCurrentView(currentView === "updateAddress" ? "viewProfile" : "updateAddress")}
                >
                    Update Address
                </button>
            </div>

            {/* Main Content */}
            <div className="w-full max-h-[75vh] px-4 overflow-y-auto">
                {/* View Profile Section */}
                {currentView === "viewProfile" && (
                    <div className="flex flex-col m-5 w-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-semibold text-gray-700 ml-2">My Profile</h1>
                        </div>

                        {/* Profile Container */}
                        <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
                            {/* Profile Header */}
                            <div className="flex flex-col items-start">
                                <h1 className="text-2xl font-bold text-gray-800">{userData.firstName} {userData.lastName}</h1>
                                <p className="text-gray-600 mt-1">Email: {userData.email}</p>
                                <p className="text-gray-600">Phone: {userData.phone}</p>
                            </div>

                            {/* Profile Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                                    <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                                    <p className="text-gray-700 mt-2"><strong>Gender:</strong> {userData.gender}</p>
                                    <p className="text-gray-700"><strong>Date of Birth:</strong> {userData.dob}</p>
                                </div>

                                {/* Address Section */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                                    <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                                    <p className="text-gray-700 mt-2">
                                        {userData.address?.line1 || "N/A"}<br />
                                        {userData.address?.line2 || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Profile Section */}
                {currentView === "editProfile" && (
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Edit Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedData.firstName}
                                    onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                                    placeholder="Enter your first name"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedData.lastName}
                                    onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                                    placeholder="Enter your last name"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedData.email}
                                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Gender */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedData.gender}
                                    onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
                                >
                                    <option value="" disabled>
                                        Select Gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedData.phone}
                                    onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={editedData.dob}
                                    onChange={(e) => setEditedData({ ...editedData, dob: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Save Changes Button */}
                        <button
                            className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={handleProfileEdit}
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                {/* Update Address Section */}
                {currentView === "updateAddress" && (
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Update Address</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Address Line 1 */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Address Line 1</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={updatedAddress.line1}
                                    onChange={(e) => setUpdatedAddress({ ...updatedAddress, line1: e.target.value })}
                                    placeholder="Enter your primary address"
                                />
                            </div>

                            {/* Address Line 2 */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Address Line 2</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={updatedAddress.line2}
                                    onChange={(e) => setUpdatedAddress({ ...updatedAddress, line2: e.target.value })}
                                    placeholder="Enter additional address details (optional)"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={handleAddressUpdate}
                        >
                            Save Address
                        </button>
                    </div>
                )}

                {/* Change Password Section */}
                {currentView === "changePassword" && (
                    <div className="bg-white p-8 rounded-lg shadow-xl">
                        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Change Password</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Old Password */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Old Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    placeholder="Enter your current password"
                                />
                            </div>

                            {/* New Password and Confirm New Password */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* New Password */}
                                <div className="flex flex-col">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        placeholder="Enter a new password"
                                    />
                                </div>

                                {/* Confirm New Password */}
                                <div className="flex flex-col">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm your new password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="mt-8 w-full bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={handlePasswordChange}
                        >
                            Change Password
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyProfile;
