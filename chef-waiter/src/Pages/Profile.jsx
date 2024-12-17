import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../App";
import { AppContext } from "../Context/AppContext";

const Profile = () => {
    const { cToken, iToken, profileData, get_Profile_Data } = useContext(AppContext);

    // State for toggling views
    const [showChangePassword, setShowChangePassword] = useState(false);

    // Password fields
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Load profile data on component mount
    useEffect(() => {
        if (cToken || iToken) {
            get_Profile_Data();
        }
    }, [cToken, iToken]);

    // Handle password change form submission
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/employee/change-password`, // Backend endpoint
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        ctoken: cToken || "", // Send cToken in the headers
                        itoken: iToken || "", // Send iToken if cToken is empty
                    },
                }
            );

            if (response.data.success) {
                toast.success("Password changed successfully!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setShowChangePassword(false); // Go back to profile view
            } else {
                toast.error(response.data.message || "Failed to change password.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    if (!profileData) {
        return <div className="text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col items-start m-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <button
                    className="px-4 py-2 bg-green-600 hover:bg-[#22C55E] text-white font-medium rounded-lg shadow-md transition duration-200"
                    onClick={() => setShowChangePassword(!showChangePassword)}
                >
                    {showChangePassword ? "Back to Profile" : "Change Password"}
                </button>
            </div>

            {/* Conditional Rendering */}
            {!showChangePassword ? (
                // Profile Display
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                    <div className="flex items-center gap-6">
                        {/* Profile Picture */}
                        <img
                            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
                            src={`${backendUrl}/empIMG/${profileData.image}`}
                            alt={`${profileData.firstName}'s profile`}
                        />
                        {/* Name and Position */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {profileData.firstName} {profileData.lastName}
                            </h1>
                            <p className="text-gray-600 text-lg mt-1">
                                {profileData.position} - {profileData.shift}
                            </p>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
                            <p className="text-gray-700">
                                <strong>Education:</strong> {profileData.education}
                            </p>
                            <p className="text-gray-700">
                                <strong>Phone:</strong> {profileData.phone}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Salary</h2>
                            <p className="text-2xl font-bold text-gray-800">${profileData.salary}</p>
                        </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg shadow-inner mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Address</h2>
                        <p className="text-gray-700">
                            {profileData.address.line1}, {profileData.address.line2}
                        </p>
                    </div>
                </div>
            ) : (
                // Change Password Form
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Change Password
                    </h2>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Old Password */}
                        <div className="relative">
                            <label className="block text-gray-700 mb-1">Old Password</label>
                            <input
                                type={showOldPassword ? "text" : "password"} // Toggle input type for old password
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full p-3 border rounded focus:outline-green-500"
                                required
                            />
                            <button
                                type="button"
                                className="absolute top-10 right-3 text-[#22C55E] hover:text-green-700"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                            >
                                {showOldPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {/* New Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-gray-700 mb-1">New Password</label>
                                <input
                                    type={showNewPassword ? "text" : "password"} // Toggle input type for new password
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-3 border rounded focus:outline-green-500"
                                    required
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
                            <div className="relative">
                                <label className="block text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"} // Toggle input type for confirm password
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-3 border rounded focus:outline-green-500"
                                    required
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#22C55E] hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition duration-200"
                        >
                            Change Password
                        </button>
                    </form>

                </div>
            )}
        </div>
    );
};

export default Profile;
