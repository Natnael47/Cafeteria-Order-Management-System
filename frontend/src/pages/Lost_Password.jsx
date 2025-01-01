import axios from "axios";
import { KeyRound } from "lucide-react";
import React, { useState } from "react";
import { toast } from 'react-toastify';
import { backendUrl } from "../App";

const LostPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(`${backendUrl}/api/user/password-recovery`, { email });
            if (response.data.success) {
                toast.success("Password recovery email sent. Please check your inbox.");
            } else {
                setMessage(response.data.message || "Failed to send recovery email.");
                toast.error("Failed to send recovery email.");
            }
        } catch (error) {
            console.error("Error during password recovery:", error);
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col lg:flex-row gap-8 items-center p-10 w-[90%] max-w-[800px] border rounded-xl text-gray-700 bg-white shadow-2xl"
            >
                <div className="flex flex-col items-center w-full lg:w-1/2">
                    <KeyRound className="text-primary text-5xl mb-4" />
                    <h2 className="text-4xl font-extrabold text-primary mb-2 text-center">
                        Password Recovery
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Forgot your password? Enter your email below, and we'll send you a recovery link.
                    </p>
                </div>
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                    <div className="w-full">
                        <label htmlFor="email" className="block text-gray-600 mb-2 font-medium">
                            Email Address
                        </label>
                        <input
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="Enter your email"
                            required
                            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary hover:bg-primary-dark"
                            } text-white py-3 px-6 rounded-lg font-semibold text-lg transition-transform transform hover:scale-105 w-full shadow-md`}
                    >
                        {loading ? "Sending..." : "Send Recovery Email"}
                    </button>
                    {message && (
                        <p className="text-center w-full text-gray-700 mt-2">{message}</p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default LostPassword;
