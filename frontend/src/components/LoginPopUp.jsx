import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { StoreContext } from '../context/StoreContext';

const LoginPopUp = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const { setToken } = useContext(StoreContext);

    const [data, setData] = useState({
        firstName: "",
        gender: "",
        email: "",
        password: ""
    });

    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let url = `${backendUrl}/api/user/`;

        url += currState === "Login" ? "login" : "register";

        const response = await axios.post(url, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    };

    // Lock scroll when popup is open and restore when closed
    useEffect(() => {
        // Disable scrolling on body when login popup is visible
        document.body.style.overflow = "hidden";

        // Cleanup to restore scroll when the popup is closed
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    return (
        <div className="absolute z-10 w-full h-full bg-gray-700/90 grid place-items-center">
            <form onSubmit={onLogin} className="w-[max(23vw,330px)] text-gray-500 bg-white flex flex-col gap-6 p-6 rounded-md text-sm animate-fadeIn">
                <div className="flex justify-between items-center text-black text-[16px]">
                    <h2 className='font-semibold'>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" className="w-4 cursor-pointer" />
                </div>
                <div className="flex flex-col">
                    {currState === "Sign Up" && (
                        <>
                            <label htmlFor="firstName" className="text-gray-600 mb-2 font-semibold">First Name</label>
                            <input
                                name="firstName"
                                onChange={onChangeHandler}
                                value={data.firstName}
                                type="text"
                                placeholder="First Name"
                                required
                                className="border border-gray-500 p-2 rounded-md focus:outline-none mb-2"
                            />
                            <label htmlFor="gender" className="text-gray-600 mb-2 font-semibold">Gender</label>
                            <select
                                name="gender"
                                onChange={onChangeHandler}
                                value={data.gender}
                                required
                                className="border border-gray-500 p-2 rounded-md focus:outline-none mb-2"
                            >
                                <option value="" disabled>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </>
                    )}
                    <label htmlFor="email" className="text-gray-600 mb-2 font-semibold">Email</label>
                    <input
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        type="email"
                        placeholder="Your Email"
                        required
                        className="border border-gray-500 p-2 rounded-md focus:outline-none mb-2"
                    />
                    <label htmlFor="password" className="text-gray-600 mb-2 font-semibold">Password</label>
                    <div className="relative">
                        <input
                            name="password"
                            onChange={onChangeHandler}
                            value={data.password}
                            type={showPassword ? "text" : "password"} // Toggle input type based on showPassword
                            placeholder="Password"
                            required
                            className="border border-gray-500 p-2 rounded-md focus:outline-none w-full"
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
                <button type="submit" className="bg-primary text-white py-2 rounded-md font-semibold hover:bg-black text-[14px] transition-colors">
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </button>
                <div className="flex items-start gap-2 -mt-4">
                    <input type="checkbox" required className="mt-1 cursor-pointer" />
                    <p className="text-xs">By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login" ? (
                    <p className="text-start">
                        Create a new account? <span onClick={() => setCurrState("Sign Up")} className="text-red-500 font-medium cursor-pointer">Click here</span>
                    </p>
                ) : (
                    <p className="text-start">
                        Already have an account? <span onClick={() => setCurrState("Login")} className="text-red-500 font-medium cursor-pointer">Login here</span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopUp;
