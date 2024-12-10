import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const MyProfile = () => {
    const { userData, setUserData, token, loadUserProfileData } = useContext(StoreContext);
    const [isEdit, setIsEdit] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isViewProfile, setIsViewProfile] = useState(false);
    const [isUpdateAddress, setIsUpdateAddress] = useState(false);

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

    // Load user data into the state when component mounts
    useEffect(() => {
        console.log("User Data:", userData); // Debug log
        setEditedData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            gender: userData.gender || "",
            phone: userData.phone || "",
            dob: userData.dob || "",
            address: userData.address || { line1: "", line2: "" },
        });
        setUpdatedAddress(userData.address || { line1: "", line2: "" });
    }, [userData]);


    // Handle profile edit submission
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
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the profile.");
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
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setIsChangePassword(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while changing the password.");
        }
    };

    // Handle address update submission
    const handleAddressUpdate = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/update-address`,
                updatedAddress,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsUpdateAddress(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the address.");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar Navigation */}
            <div className="w-1/10 flex flex-col p-4 gap-4">
                <button
                    className={`py-3 px-4 rounded-lg border text-green-700 font-semibold transition-colors ${isEdit ? "bg-green-100" : "hover:bg-green-50"}`}
                    onClick={() => {
                        setIsEdit(true);
                        setIsChangePassword(false);
                        setIsViewProfile(false);
                        setIsUpdateAddress(false);
                    }}
                >
                    Edit Profile
                </button>
                <button
                    className={`py-3 px-4 rounded-lg border text-green-700 font-semibold transition-colors ${isChangePassword ? "bg-green-100" : "hover:bg-green-50"}`}
                    onClick={() => {
                        setIsEdit(false);
                        setIsChangePassword(true);
                        setIsViewProfile(false);
                        setIsUpdateAddress(false);
                    }}
                >
                    Change Password
                </button>
                <button
                    className={`py-3 px-4 rounded-lg border text-green-700 font-semibold transition-colors ${isViewProfile ? "bg-green-100" : "hover:bg-green-50"}`}
                    onClick={() => {
                        setIsViewProfile(true);
                        setIsEdit(false);
                        setIsChangePassword(false);
                        setIsUpdateAddress(false);
                    }}
                >
                    View Profile
                </button>
                <button
                    className={`py-3 px-4 rounded-lg border text-green-700 font-semibold transition-colors ${isUpdateAddress ? "bg-green-100" : "hover:bg-green-50"}`}
                    onClick={() => {
                        setIsUpdateAddress(true);
                        setIsEdit(false);
                        setIsChangePassword(false);
                        setIsViewProfile(false);
                    }}
                >
                    Update Address
                </button>
            </div>

            {/* Main Content */}
            <div className="w-9/10 p-8 bg-gray-100">
                {/* Edit Profile Section */}
                {isEdit && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-green-700 mb-6">Edit Profile</h2>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.firstName}
                            onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.lastName}
                            onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.email}
                            onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Gender"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.gender}
                            onChange={(e) => setEditedData({ ...editedData, gender: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.phone}
                            onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Date of Birth"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.dob}
                            onChange={(e) => setEditedData({ ...editedData, dob: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address Line 1"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.address.line1}
                            onChange={(e) =>
                                setEditedData({ ...editedData, address: { ...editedData.address, line1: e.target.value } })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Address Line 2"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={editedData.address.line2}
                            onChange={(e) =>
                                setEditedData({ ...editedData, address: { ...editedData.address, line2: e.target.value } })
                            }
                        />
                        <button
                            className="bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800"
                            onClick={handleProfileEdit}
                        >
                            Save Changes
                        </button>
                    </div>
                )}

                {/* View Profile Section */}
                {isViewProfile && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-green-700 mb-6">View Profile</h2>
                        <p className="mb-4"><strong>First Name:</strong> {userData.firstName}</p>
                        <p className="mb-4"><strong>Last Name:</strong> {userData.lastName}</p>
                        <p className="mb-4"><strong>Email:</strong> {userData.email}</p>
                        <p className="mb-4"><strong>Gender:</strong> {userData.gender}</p>
                        <p className="mb-4"><strong>Phone:</strong> {userData.phone}</p>
                        <p className="mb-4"><strong>Date of Birth:</strong> {userData.dob}</p>
                        <p className="mb-4"><strong>Address Line 1:</strong> {userData.address?.line1}</p>
                        <p className="mb-4"><strong>Address Line 2:</strong> {userData.address?.line2}</p>
                    </div>
                )}

                {/* Update Address Section */}
                {isUpdateAddress && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-green-700 mb-6">Update Address</h2>
                        <input
                            type="text"
                            placeholder="Address Line 1"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={updatedAddress.line1}
                            onChange={(e) => setUpdatedAddress({ ...updatedAddress, line1: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Address Line 2"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={updatedAddress.line2}
                            onChange={(e) => setUpdatedAddress({ ...updatedAddress, line2: e.target.value })}
                        />
                        <button
                            className="bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800"
                            onClick={handleAddressUpdate}
                        >
                            Save Address
                        </button>
                    </div>
                )}

                {/* Change Password Section */}
                {isChangePassword && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold text-green-700 mb-6">Change Password</h2>
                        <input
                            type="password"
                            placeholder="Old Password"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full p-3 mb-4 border rounded-lg"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button
                            className="bg-green-700 text-white py-3 px-6 rounded-lg hover:bg-green-800"
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
