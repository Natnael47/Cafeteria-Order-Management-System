import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordResetToken, setPasswordResetToken] = useState("");
    const [message, setMessage] = useState("");

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
                setMessage("Password has been successfully reset.");
                navigate("/")
            } else {
                setMessage(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            setMessage("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex mt-20 justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-6 items-start p-8 w-[340px] sm:w-[400px] border rounded-xl text-zinc-600 text-sm shadow-lg bg-white"
            >
                <h2 className="text-3xl font-bold text-primary text-center w-full">
                    Reset Your Password
                </h2>
                <p className="text-gray-600 text-center w-full mb-4">
                    Enter your new password below to reset it.
                </p>

                <div className="w-full">
                    <label htmlFor="newPassword" className="text-gray-700 mb-1 font-medium">
                        New Password
                    </label>
                    <input
                        name="newPassword"
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword}
                        type="password"
                        placeholder="New Password"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="confirmPassword" className="text-gray-700 mb-1 font-medium">
                        Confirm Password
                    </label>
                    <input
                        name="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark text-lg transition-transform transform hover:scale-105 w-full shadow-md"
                >
                    Reset Password
                </button>

                {message && (
                    <p className="text-center w-full text-gray-700 mt-2">{message}</p>
                )}
            </form>
        </div>
    );
};

export default ResetPassword;
