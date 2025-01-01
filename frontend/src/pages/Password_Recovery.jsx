import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Assuming Lucide icons are being used
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { backendUrl } from "../App";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordResetToken, setPasswordResetToken] = useState("");
    const [message, setMessage] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Extract the token from the URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("confirm");
        if (token) {
            setPasswordResetToken(token);
        }
    }, []);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!passwordResetToken) {
            setMessage("Invalid or missing password reset token.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match. Please try again.");
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
                passwordResetToken,
                newPassword,
            });

            if (response.data.success) {
                toast.success("Password has been successfully reset.");
                // Navigate to another page or show success message
            } else {
                setMessage(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            toast.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-6 p-8 w-[90%] max-w-[600px] border rounded-lg bg-white shadow-2xl text-gray-700"
            >
                <h2 className="text-4xl font-bold text-primary text-center mb-4">
                    Reset Your Password
                </h2>
                <p className="text-gray-500 text-center mb-6">
                    Enter your new password below to reset it.
                </p>

                {/* New Password */}
                <div className="relative w-full">
                    <label htmlFor="newPassword" className="text-gray-700 mb-2 font-medium">
                        New Password
                    </label>
                    <input
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        placeholder="Enter your new password"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                    <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-10 text-gray-500 hover:text-primary"
                    >
                        {showNewPassword ? <Eye /> : <EyeOff />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative w-full">
                    <label htmlFor="confirmPassword" className="text-gray-700 mb-2 font-medium">
                        Confirm Password
                    </label>
                    <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        placeholder="Confirm your new password"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-10 text-gray-500 hover:text-primary"
                    >
                        {showConfirmPassword ? <Eye /> : <EyeOff />}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-transform transform hover:scale-105 w-full shadow-md"
                >
                    Reset Password
                </button>

                {/* Message */}
                {message && (
                    <p className="text-center w-full text-gray-700 mt-2">{message}</p>
                )}
            </form>
        </div>
    );
};

export default ResetPassword;
