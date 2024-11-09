import axios from "axios";
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
        <form onSubmit={onSubmitHandler} className="min-h-[100vh] flex items-center bg-gray-100">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-xl bg-white">
                <p className="text-2xl font-bold text-black m-auto">
                    <span className="text-primary"> {state} </span> Login
                </p>
                <div className="w-full">
                    <p className="text-black font-semibold">Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        placeholder="Email"
                        type="email"
                        value={email}
                        required
                    />
                </div>
                <div className="w-full">
                    <p className="text-black font-semibold">Password</p>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-[#DADADA] rounded w-full p-2 mt-1"
                            placeholder="Password"
                            type={showPassword ? "text" : "password"} // Toggle input type based on showPassword
                            value={password}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                            className="absolute right-2 top-2 text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"} {/* Button text changes based on state */}
                        </button>
                    </div>
                </div>
                <button className="bg-primary text-white w-full py-2 rounded-md text-base font-bold mt-2 hover:bg-[#269231]">
                    Login
                </button>
                {state === "Chef" ? (
                    <p className="text-center mt-4 text-black">
                        Inventory Manager Login?{" "}
                        <span
                            className="text-blue-800 underline cursor-pointer"
                            onClick={() => setState("Inventory Manager")}
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p className="text-center mt-4 text-black">
                        Chef Login?{" "}
                        <span
                            className="text-blue-800 underline cursor-pointer"
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
