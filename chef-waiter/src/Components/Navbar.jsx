import axios from 'axios'; // Import axios for making API calls
import { LogOut } from 'lucide-react';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../../admin/src/assets/assets';
import { backendUrl } from '../App';
import { ChefContext } from '../Context/ChefContext';
import { InventoryContext } from '../Context/InventoryContext';

const Navbar = () => {
    const { cToken, setCToken } = useContext(ChefContext);
    const { iToken, setIToken } = useContext(InventoryContext);

    const navigate = useNavigate();

    const logout = async (token, setToken, tokenType) => {
        try {
            // Send the logout request to the backend with the token in the correct header
            const headers = {};
            if (tokenType === 'cToken') {
                headers.ctoken = token;
            } else if (tokenType === 'iToken') {
                headers.itoken = token;
            }

            const response = await axios.post(
                `${backendUrl}/api/employee/logout-employee`,
                {},
                {
                    headers: headers, // Send ctoken or itoken as per the type
                }
            );

            if (response.data.success) {
                // Successfully logged out on the backend
                // Clear the token and localStorage
                setToken('');
                localStorage.removeItem(tokenType);

                // Clear sorting data from localStorage
                localStorage.removeItem('sortAttribute');
                localStorage.removeItem('sortOrder');

                // Navigate to the homepage or login page
                navigate('/');
            } else {
                console.error('Logout failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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

            {/* Center Section */}
            <div>
                <p className="text-black font-medium text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Notification
                </p>
            </div>

            {/* Right Section */}
            <div className="flex gap-4">
                {/* Logout Button for cToken (Chef) */}
                {cToken && (
                    <button
                        onClick={() => logout(cToken, setCToken, 'cToken')}
                        className="flex items-center gap-2 bg-black text-white text-sm px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:scale-105 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                )}

                {/* Logout Button for iToken (Inventory) */}
                {iToken && (
                    <button
                        onClick={() => logout(iToken, setIToken, 'iToken')}
                        className="flex items-center gap-2 bg-black text-white text-sm px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:scale-105 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
