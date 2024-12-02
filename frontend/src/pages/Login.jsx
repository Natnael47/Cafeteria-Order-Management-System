import axios from 'axios';
import React, { useContext, useState } from 'react';
import { backendUrl } from '../App'; // Ensure this is correctly imported
import { StoreContext } from '../context/StoreContext';

const Login = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const { setToken, navigate } = useContext(StoreContext);

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });


    // State to manage password visibility
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
                if (setShowLogin) setShowLogin(false);
                navigate('/');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login/register:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <form
            onSubmit={onLogin}
            className="min-h-[80vh] flex items-center"
        >
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                <h2 className="text-2xl font-semibold">
                    {currState === 'Sign Up' ? "Create Account" : "Login"}
                </h2>
                <p>Please {currState === 'Sign Up' ? "Sign up" : "Log in"} to order food.</p>

                {currState === "Sign Up" && (
                    <>
                        <div className="w-full">
                            <label htmlFor="fullName" className="text-gray-600 mb-2 font-semibold">
                                Full Name
                            </label>
                            <input
                                name="fullName"
                                onChange={onChangeHandler}
                                value={data.fullName}
                                type="text"
                                placeholder="Full Name"
                                required
                                className="border border-zinc-300 rounded w-full p-2 mt-1"
                            />
                        </div>
                    </>
                )}

                <div className="w-full">
                    <label htmlFor="email" className="text-gray-600 mb-2 font-semibold">
                        Email
                    </label>
                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your Email"
                        required
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="password" className="text-gray-600 mb-2 font-semibold">
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
                            className="border border-zinc-300 rounded w-full p-2"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-2 text-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white py-2 rounded-md font-semibold hover:bg-black text-base transition-colors w-full"
                >
                    {currState === 'Sign Up' ? "Sign Up" : "Login"}
                </button>

                {currState === "Login" ? (
                    <p>
                        Create a new account?{" "}
                        <span
                            onClick={() => setCurrState("Sign Up")}
                            className="text-red-500 font-medium cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <span
                            onClick={() => setCurrState("Login")}
                            className="text-red-500 font-medium cursor-pointer"
                        >
                            Login here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
