import axios from "axios";
import { ArrowLeft } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import { AdminContext } from "../context/AdminContext";

Modal.setAppElement("#root");

const Profile = () => {
    const navigate = useNavigate();
    const { token, userData, setUserData, loadUserProfileData } = useContext(AdminContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        formPayload.append("updatedData[firstName]", formData.firstName);
        formPayload.append("updatedData[lastName]", formData.lastName);
        formPayload.append("updatedData[email]", formData.email);
        formPayload.append("updatedData[phone]", formData.phone);
        formPayload.append("updatedData[address][line1]", formData.address.line1);
        formPayload.append("updatedData[address][line2]", formData.address.line2);
        if (formData.image) {
            formPayload.append("updatedData[image]", formData.image);
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
                alert("Profile updated successfully!");
                setUserData(response.data.updatedProfile);
                setIsModalOpen(false);
                loadUserProfileData(); // Refresh data to ensure consistency
            } else {
                alert(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating the profile.");
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
                            src={
                                formData.image
                                    ? URL.createObjectURL(formData.image)
                                    : `${backendUrl}/empIMG/${userData.image}`
                            }
                            alt={`${formData.firstName}'s profile`}
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                {`${userData.firstName} ${userData.lastName}`}
                            </h2>
                            <p className="text-xl text-gray-600">{userData.email}</p>
                        </div>
                    </div>

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

                    <div className="mt-6">
                        <button
                            onClick={openModal}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-white rounded-lg shadow-lg max-w-lg mx-auto p-6 outline-none"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        className="w-full border p-2 rounded"
                    />
                    <div>
                        <input
                            type="text"
                            name="line1"
                            value={formData.address.line1}
                            onChange={handleAddressChange}
                            placeholder="Address Line 1"
                            className="w-full border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="line2"
                            value={formData.address.line2}
                            onChange={handleAddressChange}
                            placeholder="Address Line 2"
                            className="w-full border p-2 rounded mt-2"
                        />
                    </div>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
