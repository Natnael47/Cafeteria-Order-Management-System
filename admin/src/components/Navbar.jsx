import axios from 'axios';
import { ChevronDown, LogOut, User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Navbar = () => {
    const { token, setToken, navigate } = useContext(AdminContext);
    const [profile, setProfile] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, [token]);

    const getProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/get-profile`,
                { headers: { token } }
            );
            if (data.success) {
                setProfile(data.admin);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = async () => {
        try {
            // Send a POST request to the logout endpoint with the token in the headers
            const response = await axios.post(
                `${backendUrl}/api/admin/logout`,
                {}, // Empty body as the token is passed in headers
                {
                    headers: {
                        token
                    },
                }
            );

            // Check if the logout was successful
            if (response.data.success) {
                // Navigate to the home page and clear token-related storage
                navigate('/');
                setToken('');
                localStorage.removeItem('token');
                localStorage.removeItem('currentView');
                toast.success('Logout successful');
            } else {
                // Show error message if the response indicates failure
                toast.error(response.data.message);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error('Error logging out:', error);
            toast.error('Something went wrong. Please try again.');
        }
    };


    const getFirstLetter = (name) => name && name[0].toUpperCase();

    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b-2 border-black bg-[#F1FAF2] shadow-md">
            <div className="flex items-center gap-2 text-xs">
                <img className="w-36 sm:w-40 cursor-pointer hover:scale-105 transition-transform duration-300" src={assets.logo2} alt="" />
                <p className="border px-4 py-1 rounded-full border-gray-800 font-bold mt-3 text-black shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    Admin
                </p>
            </div>
            <div className="relative flex items-center gap-2">
                {profile ? (
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold text-lg cursor-pointer"
                    >
                        <div className='bg-black rounded-full flex items-center gap-2 px-2 py-1 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                            <div className="w-10 h-10 bg-gray-100 text-green-800 text-lg font-semibold rounded-full flex items-center justify-center border-2 border-green-500">
                                {profile.image ? (
                                    <img
                                        src={`${backendUrl}/empIMG/${profile.image}`}
                                        alt="Admin"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    getFirstLetter(profile.firstName)
                                )}
                            </div>
                            <ChevronDown className="text-white transition-transform duration-300 group-hover:rotate-180" />
                        </div>
                    </div>

                ) : (
                    <span>Loading...</span>
                )}

                {showDropdown && (
                    <div className="absolute right-0 top-12 z-30 bg-white rounded-lg shadow-2xl border border-gray-200 p-5 w-64 flex flex-col gap-4">
                        <div className="flex items-center gap-4 border-b pb-4">
                            {profile.image ? (
                                <img
                                    src={`${backendUrl}/empIMG/${profile.image}`}
                                    alt="Admin"
                                    className="w-14 h-14 object-cover rounded-full border-2 border-green-600"
                                />
                            ) : (
                                <div className="w-14 h-14 bg-green-100 border-2 border-green-600 text-green-600 text-2xl font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {getFirstLetter(profile.firstName)}
                                </div>
                            )}
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{profile.firstName} {profile.lastName}</p>
                                <p className="text-sm text-gray-500">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div
                                onClick={() => navigate('/profile')}
                                className="flex items-center gap-3 cursor-pointer hover:bg-green-100 p-3 rounded-lg transition-all"
                            >
                                <User className="text-green-600 w-6 h-6" />
                                <span className="text-gray-800 font-medium">Profile</span>
                            </div>
                            <div
                                onClick={logout}
                                className="flex items-center gap-3 cursor-pointer hover:bg-red-100 p-3 rounded-lg transition-all"
                            >
                                <LogOut className="text-red-600 w-6 h-6" />
                                <span className="text-red-600 font-medium">Logout</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
