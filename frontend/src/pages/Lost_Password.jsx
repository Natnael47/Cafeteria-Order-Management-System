import axios from "axios";
import React, { useState } from "react";
import { backendUrl } from "../App";

const LostPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!email) {
            setMessage("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(`${backendUrl}/api/user/password-recovery`, { email });
            if (response.data.success) {
                setMessage("Password recovery email sent. Please check your inbox.");
            } else {
                setMessage(response.data.message || "Failed to send recovery email.");
            }
        } catch (error) {
            console.error("Error during password recovery:", error);
            setMessage("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex mt-20 justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col gap-6 items-start p-8 w-[340px] sm:w-[400px] border rounded-xl text-zinc-600 text-sm shadow-lg bg-white"
            >
                <h2 className="text-3xl font-bold text-primary text-center w-full">
                    Recover Your Password
                </h2>
                <p className="text-gray-600 text-center w-full mb-4">
                    Enter your email address below, and we’ll send you instructions to reset your password.
                </p>

                <div className="w-full">
                    <label htmlFor="email" className="text-gray-700 mb-1 font-medium">
                        Email Address
                    </label>
                    <input
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Enter your email"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary-dark"
                        } text-white py-3 rounded-lg font-semibold text-lg transition-transform transform hover:scale-105 w-full shadow-md`}
                >
                    {loading ? "Sending..." : "Send Recovery Email"}
                </button>

                {message && (
                    <p className="text-center w-full text-gray-700 mt-2">{message}</p>
                )}
            </form>
        </div>
    );
};

export default LostPassword;
