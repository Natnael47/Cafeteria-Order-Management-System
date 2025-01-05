import axios from 'axios';
import { ChevronDown, LogOut, User } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../../admin/src/assets/assets';
import { backendUrl } from '../App';
import { AppContext } from '../Context/AppContext';

const Navbar = () => {
    const { cToken, iToken, profileData, get_Profile_Data, setCToken, setIToken, navigate } = useContext(AppContext);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (cToken || iToken) {
            get_Profile_Data();
        }
    }, [cToken, iToken]);

    const logout = async (token, setToken, tokenType) => {
        try {
            const headers = {};
            if (tokenType === 'cToken') {
                headers.ctoken = token;
            } else if (tokenType === 'iToken') {
                headers.itoken = token;
            }

            const response = await axios.post(
                `${backendUrl}/api/employee/logout-employee`,
                {},
                { headers: headers, }
            );

            if (response.data.success) {
                setToken('');
                localStorage.removeItem(tokenType);
                localStorage.removeItem('sortAttribute');
                localStorage.removeItem('sortOrder');
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('Error logging out');
        }
    };

    const getFirstLetter = (name) => name && name[0].toUpperCase();

    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b-2 border-black bg-gradient-to-r from-[#F1FAF2] via-[#E8F5E9] to-[#F1FAF2] shadow-md">
            {/* Left Section */}
            <div className="flex items-center gap-4 text-sm">
                <img
                    className="w-36 sm:w-40 cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    src={assets.logo2}
                    alt="Logo"
                />
                <p className="border px-3 py-1 mt-3 rounded-full border-black font-semibold text-black shadow-sm">
                    {cToken ? 'Chef' : 'Inventory'}
                </p>
            </div>

            {/* Right Section */}
            <div className="relative flex items-center gap-2">
                {profileData ? (
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold text-lg cursor-pointer"
                    >
                        <div className='bg-black rounded-full flex items-center gap-2 px-2 py-1 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                            <div className="w-10 h-10 bg-gray-100 text-green-800 text-lg font-semibold rounded-full flex items-center justify-center border-2 border-green-500">
                                {profileData.image ? (
                                    <img
                                        src={`${backendUrl}/empIMG/${profileData.image}`}
                                        alt="Employee"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    getFirstLetter(profileData.firstName)
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
                            {profileData.image ? (
                                <img
                                    src={`${backendUrl}/empIMG/${profileData.image}`}
                                    alt="Employee"
                                    className="w-14 h-14 object-cover rounded-full border-2 border-green-600"
                                />
                            ) : (
                                <div className="w-14 h-14 bg-green-100 border-2 border-green-600 text-green-600 text-2xl font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {getFirstLetter(profileData.firstName)}
                                </div>
                            )}
                            <div>
                                <p className="text-lg font-semibold text-gray-800">{profileData.firstName} {profileData.lastName}</p>
                                <p className="text-sm text-gray-500">{profileData.email}</p>
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
                                onClick={() => logout(cToken || iToken, cToken ? setCToken : setIToken, cToken ? 'cToken' : 'iToken')}
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
