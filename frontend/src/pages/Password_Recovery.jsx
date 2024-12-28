import axios from "axios";
import React, { useState } from "react";

const PasswordRecovery = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/api/user/password-recovery", { email });
            if (response.data.success) {
                setMessage("A password recovery link has been sent to your email.");
            } else {
                setMessage("Unable to send recovery link. Please try again.");
            }
        } catch (error) {
            console.error("Error during password recovery:", error);
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
                    Cozy Password Recovery
                </h2>
                <p className="text-gray-600 text-center w-full mb-4">
                    Submit the form below to reset your password, and a link will be emailed to you.
                </p>

                <div className="w-full">
                    <label htmlFor="email" className="text-gray-700 mb-1 font-medium">
                        Email
                    </label>
                    <input
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        placeholder="Your Email"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark text-lg transition-transform transform hover:scale-105 w-full shadow-md"
                >
                    Submit Request
                </button>

                {message && (
                    <p className="text-center w-full text-gray-700 mt-2">{message}</p>
                )}
            </form>
        </div>
    );
};

export default PasswordRecovery;
