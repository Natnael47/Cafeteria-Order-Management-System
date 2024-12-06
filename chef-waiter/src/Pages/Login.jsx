import axios from "axios";
import { Eye, EyeClosed } from 'lucide-react';
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { ChefContext } from "../Context/ChefContext";
import { InventoryContext } from "../Context/InventoryContext";

const Login = () => {
    const [state, setState] = useState("Chef");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setCToken } = useContext(ChefContext);
    const { setIToken } = useContext(InventoryContext);

    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === "Chef") {
                const { data } = await axios.post(backendUrl + "/api/employee/login-chef", { email, password });
                if (data.success) {
                    localStorage.setItem('cToken', data.token);
                    setCToken(data.token);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(backendUrl + "/api/employee/login-barista", { email, password });
                if (data.success) {
                    localStorage.setItem('iToken', data.token);
                    setIToken(data.token);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 via-blue-500 to-green-300">
            <div className="flex flex-col gap-6 p-10 bg-white rounded-2xl shadow-2xl max-w-sm w-full">
                {/* Title */}
                <p className="text-2xl font-extrabold text-gray-800 text-center">
                    <span className="text-green-600">{state}</span> Login
                </p>

                {/* Email Field */}
                <div className="w-full">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        required
                    />
                </div>

                {/* Password Field */}
                <div className="w-full">
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 text-gray-500 hover:text-green-600 focus:outline-none"
                        >
                            {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    className="w-full py-3 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition duration-300"
                >
                    Login
                </button>

                {/* Toggle Login Type */}
                {state === "Chef" ? (
                    <p className="text-center text-gray-600">
                        Inventory Manager Login?{" "}
                        <span
                            className="text-green-600 font-medium cursor-pointer hover:underline"
                            onClick={() => setState("Inventory Manager")}
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p className="text-center text-gray-600">
                        Chef Login?{" "}
                        <span
                            className="text-green-600 font-medium cursor-pointer hover:underline"
                            onClick={() => setState("Chef")}
                        >
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
