// Import necessary modules
import axios from "axios";
import { LockKeyhole, MapPinHouse, UserPen } from "lucide-react";
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
            <div className="w-[280px] flex flex-col p-4 max-h-[75vh] gap-6 border-r border-gray-300 bg-white shadow-lg rounded-xl">
                <button
                    className={`py-3 px-4 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-sm ${currentView === "editProfile"
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:shadow-md"
                        }`}
                    onClick={() =>
                        setCurrentView(currentView === "editProfile" ? "viewProfile" : "editProfile")
                    }
                >
                    <UserPen className="text-lg" />
                    Edit Profile
                </button>

                <button
                    className={`py-3 px-4 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-sm ${currentView === "changePassword"
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:shadow-md"
                        }`}
                    onClick={() =>
                        setCurrentView(currentView === "changePassword" ? "viewProfile" : "changePassword")
                    }
                >
                    <LockKeyhole className="text-lg" />
                    Change Password
                </button>

                <button
                    className={`py-3 px-4 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-sm ${currentView === "updateAddress"
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 hover:shadow-md"
                        }`}
                    onClick={() =>
                        setCurrentView(currentView === "updateAddress" ? "viewProfile" : "updateAddress")
                    }
                >
                    <MapPinHouse className="text-lg" />
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
                            <h1 className="text-3xl font-bold text-gray-800 ml-2">My Profile</h1>
                        </div>

                        {/* Profile Container */}
                        <div className="max-w-4xl bg-white shadow-lg rounded-lg p-6">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-20 h-20 bg-green-100 border-2 border-green-400 text-green-700 text-3xl font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {userData?.firstName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-gray-800">{userData.firstName} {userData.lastName}</p>
                                    <p className="text-sm font-medium text-gray-500">
                                        <span className="text-gray-700">Email:</span>
                                        <span className="text-green-600 font-medium"> {userData.email}</span>
                                    </p>
                                    <p className="text-sm text-gray-700">Phone: {userData.phone}</p>
                                </div>
                            </div>

                            {/* Profile Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information Section */}
                                <div className="bg-gray-50 p-5 rounded-lg shadow-inner border-l-4 border-green-400">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h2>
                                    <p className="text-gray-700"><strong>Gender:</strong> {userData.gender}</p>
                                    <p className="text-gray-700 mt-2"><strong>Date of Birth:</strong> {userData.dob}</p>
                                </div>

                                {/* Address Section */}
                                <div className="bg-gray-50 p-5 rounded-lg shadow-inner border-l-4 border-green-400">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Address</h2>
                                    <p className="text-gray-700">
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={editedData.email}
                                    onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Gender */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={editedData.dob}
                                    onChange={(e) => setEditedData({ ...editedData, dob: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex justify-between gap-4 mt-8">
                            {/* Submit Button */}
                            <button
                                className="w-1/2 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={handleProfileEdit}
                            >
                                Save Changes
                            </button>
                            {/* Cancel Button */}
                            <button
                                className="w-1/2 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                onClick={() => setCurrentView("viewProfile")}
                            >
                                Cancel
                            </button>
                        </div>
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={updatedAddress.line2}
                                    onChange={(e) => setUpdatedAddress({ ...updatedAddress, line2: e.target.value })}
                                    placeholder="Enter additional address details (optional)"
                                />
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex justify-between gap-4 mt-8">
                            {/* Submit Button */}
                            <button
                                className="w-1/2 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={handleAddressUpdate}
                            >
                                Save Address
                            </button>
                            {/* Cancel Button */}
                            <button
                                className="w-1/2 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                onClick={() => setCurrentView("viewProfile")}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Change Password Section */}
                {currentView === "changePassword" && (
                    <div className="bg-white p-8 rounded-lg shadow-xl relative">
                        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Change Password</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {/* Old Password */}
                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Old Password</label>
                                <input
                                    type="password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
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
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
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
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        placeholder="Confirm your new password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className="flex justify-between gap-4 mt-8">
                            {/* Submit Button */}
                            <button
                                className="w-1/2 bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                onClick={handlePasswordChange}
                            >
                                Change Password
                            </button>
                            {/* Cancel Button */}
                            <button
                                className="w-1/2 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                onClick={() => setCurrentView("viewProfile")}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyProfile;
