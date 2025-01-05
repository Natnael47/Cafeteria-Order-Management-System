import axios from 'axios';
import { ChevronDown, LogOut, User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Navbar = () => {
    const { token, setToken, navigate } = useContext(AdminContext);
    const [profile, setProfile] = useState(null); // Handle single profile object
    const [showDropdown, setShowDropdown] = useState(false); // Toggle dropdown menu

    // Fetch the admin profile data when the component mounts
    useEffect(() => {
        if (token) {
            getProfile();
        }
    }, [token]);

    const getProfile = async () => {
        try {
            const { data } = await axios.get(
                `${backendUrl}/api/admin/get-profile`,  // Ensure the correct endpoint
                { headers: { token } }
            );
            if (data.success) {
                setProfile(data.admin);  // Set the admin profile data
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const logout = () => {
        navigate('/');
        setToken(''); // Clear token
        localStorage.removeItem('token');
        localStorage.removeItem('currentView');
    };

    // Get the first letter of the admin's first name
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
                {/* Profile section with first letter */}
                {profile ? (
                    <div
                        onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown on click
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold text-lg cursor-pointer"
                    >
                        {getFirstLetter(profile.firstName)} {/* Display first letter */}
                        <ChevronDown className="text-white ml-2 transition-transform duration-300 group-hover:rotate-180" />
                    </div>
                ) : (
                    <span>Loading...</span> // Loading state if profile is not yet fetched
                )}

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute right-0 top-12 z-30 bg-white rounded-lg shadow-2xl border border-gray-200 p-5 w-64 flex flex-col gap-4">
                        {/* Profile Section */}
                        <div className="flex items-center gap-4 border-b pb-4">
                            <div className="w-14 h-14 bg-green-100 border-2 border-green-600 text-green-600 text-2xl font-bold rounded-full flex items-center justify-center shadow-sm">
                                {profile?.firstName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{profile?.firstName} {profile?.lastName}</p>
                                <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                        </div>
                        {/* Menu Options */}
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
