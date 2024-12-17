import axios from "axios";
import { Eye, EyeOff, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const LoginPopUp = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const { setToken } = useContext(StoreContext);

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        if (name === "fullName") {
            const [firstName = "", ...rest] = value.trim().split(" ");
            const lastName = rest.join(" ");
            setData((prevData) => ({ ...prevData, firstName, lastName }));
        } else {
            setData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let url = `${backendUrl}/api/user/`;

        url += currState === "Login" ? "login" : "register";

        try {
            const response = await axios.post(url, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login/register:", error);
            alert("An error occurred. Please try again.");
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 bg-gray-500/50 grid place-items-center"
            aria-hidden={true}
        >
            <div
                className="absolute inset-0 bg-black opacity-60 pointer-events-none"
                aria-hidden={true}
            ></div>

            <form
                onSubmit={onLogin}
                className="relative bg-white rounded-lg shadow-lg p-8 w-[90%] max-w-md text-gray-800"
            >
                <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-semibold text-center mb-4">
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Please {currState === "Sign Up" ? "sign up" : "log in"} to continue.
                </p>

                {currState === "Sign Up" && (
                    <div className="mb-4">
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            onChange={onChangeHandler}
                            type="text"
                            placeholder="Full Name"
                            required
                            className="mt-1  block w-full rounded-md border border-black shadow-sm focus:ring-primary focus:border-primary sm:text-base px-4 py-3"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your Email"
                        required
                        className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-primary focus:border-primary sm:text-base px-4 py-3"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            className="mt-1 block w-full rounded-md border border-black shadow-sm focus:ring-primary focus:border-primary sm:text-base px-4 py-3"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 rounded-md bg-primary text-white font-medium hover:bg-primary-dark transition"
                >
                    {currState === "Sign Up" ? "Sign Up" : "Login"}
                </button>

                <p className="mt-4 text-sm text-center text-gray-500">
                    {currState === "Login" ? (
                        <>
                            Don't have an account?{" "}
                            <span
                                onClick={() => setCurrState("Sign Up")}
                                className="text-primary cursor-pointer hover:underline"
                            >
                                Sign up
                            </span>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <span
                                onClick={() => setCurrState("Login")}
                                className="text-primary cursor-pointer hover:underline"
                            >
                                Login here
                            </span>
                        </>
                    )}
                </p>

                <div className="relative w-full flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-2 text-gray-400">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 py-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    {currState === "Sign Up" ? "Sign up with Google" : "Login with Google"}
                </button>
            </form>
        </div>
    );
};

export default LoginPopUp;
