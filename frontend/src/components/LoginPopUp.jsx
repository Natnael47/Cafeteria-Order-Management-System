import axios from 'axios';
import React, { useContext, useState } from 'react';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { StoreContext } from '../context/StoreContext';

const LoginPopUp = ({ setShowLogin }) => {

    const [currState, setCurrState] = useState("Login");

    const { setToken } = useContext(StoreContext);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = backendUrl;
        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false);
        } else {
            alert(response.data.message);
        }
    };

    return (
        <div className="absolute z-10 w-full h-full bg-gray-700/90 grid place-items-center">
            <form onSubmit={onLogin} className="w-[max(23vw,330px)] text-gray-500 bg-white flex flex-col gap-6 p-6 rounded-md text-sm animate-fadeIn">
                <div className="flex justify-between items-center text-black text-[16px]">
                    <h2 className='font-semibold'>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" className="w-4 cursor-pointer" />
                </div>
                <div className="flex flex-col gap-5">
                    {currState === "Login" ? null : <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required className="border border-gray-300 p-2 rounded-md focus:outline-none" />}
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required className="border border-gray-300 p-2 rounded-md focus:outline-none" />
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required className="border border-gray-300 p-2 rounded-md focus:outline-none" />
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
}

export default LoginPopUp;
