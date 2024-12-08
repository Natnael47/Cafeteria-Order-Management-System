import { LogOut } from 'lucide-react';
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';


const Navbar = () => {

    const { token, setToken, navigate } = useContext(AdminContext);

    const logout = () => {
        navigate('/');
        token && setToken('');
        token && localStorage.removeItem('token');
        localStorage.removeItem('currentView');
    }

    return (
        <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b-2 border-black bg-[#F1FAF2] shadow-md">
            <div className="flex items-center gap-2 text-xs">
                <img className="w-36 sm:w-40 cursor-pointer hover:scale-105 transition-transform duration-300" src={assets.logo2} alt="" />
                <p className="border px-4 py-1 rounded-full border-gray-800 font-bold mt-3 text-black shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    Admin
                </p>
            </div>
            <button
                className="flex items-center gap-2 bg-black text-white text-sm px-10 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:scale-105 transition-all duration-300"
                onClick={logout}
            >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
            </button>
        </div>
    );
}

export default Navbar