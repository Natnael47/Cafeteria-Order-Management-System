import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import { backendUrl } from '../App';
import { StoreContext } from '../context/StoreContext';

const Login = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const { setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location

    // Get the redirectTo URL from the query parameters
    const redirectTo = new URLSearchParams(location.search).get('redirectTo') || '/'; // Default to '/' if not available

    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
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
                if (setShowLogin) setShowLogin(false);

                navigate(redirectTo);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login/register:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <form onSubmit={onLogin} className="min-h-[80vh]  flex items-center">
            <div className="flex flex-col gap-6 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-xl bg-gradient-to-br from-white via-gray-100 to-gray-200">
                <h2 className="text-4xl font-extrabold text-primary text-center w-full">
                    {currState === 'Sign Up' ? "Create Account" : "Login"}
                </h2>
                <p className="text-gray-600 text-center w-full">
                    Please {currState === 'Sign Up' ? "sign up" : "log in"} to order food.
                </p>

                {currState === "Sign Up" && (
                    <div className="w-full">
                        <label htmlFor="fullName" className="text-gray-700 mb-1 font-medium">
                            Full Name
                        </label>
                        <input
                            name="fullName"
                            onChange={onChangeHandler}
                            value={data.fullName}
                            type="text"
                            placeholder="Full Name"
                            required
                            className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                        />
                    </div>
                )}

                <div className="w-full">
                    <label htmlFor="email" className="text-gray-700 mb-1 font-medium">
                        Email
                    </label>
                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your Email"
                        required
                        className="border border-gray-300 rounded-lg w-full p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="password" className="text-gray-700 mb-1 font-medium">
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
                            className="border border-gray-300 rounded-lg w-full p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500 hover:text-primary transition-colors"
                        >
                            {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark text-lg transition-transform transform hover:scale-105 w-full shadow-lg"
                >
                    {currState === 'Sign Up' ? "Sign Up" : "Login"}
                </button>

                <p className="text-center w-full text-gray-600 mt-2">
                    {currState === "Login" ? (
                        <>Don't have an account?{" "}
                            <span
                                onClick={() => setCurrState("Sign Up")}
                                className="text-primary font-medium cursor-pointer hover:underline"
                            >
                                Sign up
                            </span>
                        </>
                    ) : (
                        <>Already have an account?{" "}
                            <span
                                onClick={() => setCurrState("Login")}
                                className="text-primary font-medium cursor-pointer hover:underline"
                            >
                                Login here
                            </span>
                        </>
                    )}
                </p>

                <div className="relative w-full flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-3 text-gray-400">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    type="button"
                    className="flex items-center justify-center gap-3 w-full border border-gray-300 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-transform transform hover:scale-105"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                    {currState === 'Sign Up' ? "Sign up with Google" : "Login with Google"}
                </button>
            </div>
        </form>
    );
};

export default Login;
