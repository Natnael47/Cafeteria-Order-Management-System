import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setToken } = useContext(AdminContext);

    // State to manage password visibility
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/admin/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                setToken(response.data.token);
                //console.log(response.data.data);

            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-r from-primary to-[#22C55E]">
            <div className="bg-white shadow-2xl rounded-lg px-8 py-10 max-w-md w-full">
                {/* Title */}
                <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
                    Admin Panel
                </h1>
                <form onSubmit={onSubmitHandler}>
                    {/* Email Input */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none transition duration-200"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            type="email"
                            placeholder="admin@coms.com"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none placeholder-gray-400"
                                placeholder="1q2w3e4r"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-green-600 focus:outline-none"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#22C55E] text-white font-semibold text-lg rounded-lg shadow-md hover:bg-black transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;
