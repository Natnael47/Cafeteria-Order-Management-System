import { ChevronDown, LogOut, MessageSquareMore, Search, ShoppingBag, User } from 'lucide-react';
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";
import LoginPopUp from './LoginPopup';

export const Navbar = ({ setShowFeedback }) => {
    const location = useLocation();
    const { getTotalCartAmount, token, userData, setToken, navigate, setShowSearch, getCartItems } = useContext(StoreContext);

    const [menu, setMenu] = useState("");
    const [hasShadow, setHasShadow] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        if (location.pathname !== "/") {
            window.scrollTo(0, 0);
        }
    }, [location.pathname]);

    useEffect(() => {
        const path = location.pathname;
        if (path === "/") setMenu("home");
        else if (path === "/menu") setMenu("menu");
        else if (path === "/about") setMenu("about");
        else if (path === "/contact") setMenu("contact-us");
        else setMenu("");
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setHasShadow(true);
            } else {
                setHasShadow(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    const handleMenuClick = () => {
        if (location.pathname === "/") {
            document.getElementById("explore-menu").scrollIntoView({ behavior: "smooth" });
        } else {
            setMenu("menu");
            navigate("/menu");
        }
    };

    const handleSignInClick = () => {
        setShowLogin(true);
        // navigate('/login'); // Navigate to login page
    };

    return (
        <div
            className={`fixed top-0 w-full bg-gradient-to-r bg-[#F0F9F1] z-50 transition-shadow duration-300 ${hasShadow ? 'shadow-lg' : ''
                } flex justify-between items-center py-4 px-10 md:px-20 lg:px-40`}
        >
            {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
            {/* Logo */}
            <Link to='/'>
                <img
                    src={assets.logo2}
                    alt='Logo'
                    className='w-[150px] md:w-[120px] lg:w-[150px] transition-transform duration-300 hover:scale-105'
                />
            </Link>

            {/* Navigation Links */}
            <ul className='flex list-none gap-6 text-black text-lg lg:gap-4 md:gap-3 md:text-base sm:flex'>
                {[
                    { name: 'Home', path: '/', key: 'home' },
                    { name: 'Menu', key: 'menu', isSpan: true },
                    { name: 'About', path: '/about', key: 'about' },
                    { name: 'Contact Us', path: '/contact', key: 'contact-us' },
                ].map((item) =>
                    item.isSpan ? (
                        <span
                            key={item.key}
                            onClick={handleMenuClick}
                            className={`cursor-pointer pb-1 transition-colors duration-300 ${menu === item.key ? 'border-b-2 border-black font-semibold text-black' : 'hover:text-green-500'
                                }`}
                        >
                            {item.name}
                        </span>
                    ) : (
                        <Link
                            key={item.key}
                            to={item.path}
                            onClick={() => setMenu(item.key)}
                            className={`pb-1 transition-colors duration-300 ${menu === item.key ? 'border-b-2 border-black font-semibold text-black' : 'hover:text-green-500'
                                }`}
                        >
                            {item.name}
                        </Link>
                    )
                )}
            </ul>

            {/* Right Section: Search, Cart, and Profile */}
            <div className='flex items-center gap-10 md:gap-8'>
                {/* Search Icon */}
                <Search
                    size={28}
                    onClick={() => setShowSearch(true)}
                    className='cursor-pointer transition-transform duration-300 hover:scale-110'
                />

                {/* Cart Icon */}
                <div className='relative'>
                    <Link to='/cart' className='relative'>
                        <img
                            src={assets.cart_icon}
                            alt='Cart'
                            className='w-8 cursor-pointer transition-transform duration-300 hover:scale-110'
                        />
                        <div
                            className={`absolute w-4 h-4 -top-[8px] -right-[10px] rounded-full text-[10px] bg-red-600 text-white flex justify-center items-center transition ${getTotalCartAmount() === 0 ? 'opacity-0' : 'opacity-100'
                                }`}
                        >
                            {getCartItems()}
                        </div>
                    </Link>
                </div>

                {/* Sign In / Profile Dropdown */}
                {!token ? (
                    <button
                        onClick={handleSignInClick}
                        className='bg-green-500 text-white text-lg font-medium py-2 px-6 rounded-full transition-all duration-300 hover:bg-black hover:shadow-md'
                    >
                        Sign In
                    </button>
                ) : (
                    <div className='relative flex items-center gap-2 cursor-pointer group'>
                        {/* Profile Section */}
                        <div className='bg-primary rounded-full flex items-center gap-2 px-2 py-1 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer'>
                            <div className="w-10 h-10 bg-gray-100 text-green-800 text-lg font-semibold rounded-full flex items-center justify-center border-2 border-green-500">
                                {userData?.firstName?.charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown className="text-white transition-transform duration-300 group-hover:rotate-180" />
                        </div>

                        {/* Dropdown Menu */}
                        <div className='absolute right-0 top-0 pt-14 z-30 hidden group-hover:block'>
                            <div className='bg-white rounded-lg shadow-2xl border border-gray-200 p-5 w-64 flex flex-col gap-4'>
                                {/* Profile Section */}
                                <div className='flex items-center gap-4 border-b pb-4'>
                                    <div className="w-14 h-14 bg-green-100 text-green-600 text-2xl font-bold rounded-full flex items-center justify-center shadow-sm">
                                        {userData?.firstName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
                                        <p className="text-sm text-gray-500">{userData?.email}</p>
                                    </div>
                                </div>
                                {/* Menu Options */}
                                <div className='flex flex-col gap-1'>
                                    <div
                                        onClick={() => navigate('/myprofile')}
                                        className='flex items-center gap-3 cursor-pointer hover:bg-green-100 p-3 rounded-lg transition-all'
                                    >
                                        <User className="text-green-600 w-6 h-6" />
                                        <span className="text-gray-800 font-medium">Profile</span>
                                    </div>
                                    <div
                                        onClick={() => navigate('/myorders')}
                                        className='flex items-center gap-3 cursor-pointer hover:bg-green-100 p-3 rounded-lg transition-all'
                                    >
                                        <ShoppingBag className="text-green-600 w-6 h-6" />
                                        <span className="text-gray-800 font-medium">Orders</span>
                                    </div>

                                    <div
                                        onClick={() => setShowFeedback(true)}
                                        className='flex items-center gap-3 cursor-pointer hover:bg-green-100 p-3 rounded-lg transition-all'
                                    >
                                        <MessageSquareMore className="text-green-600 w-6 h-6" />
                                        <span className="text-gray-800 font-medium">Feedback</span>
                                    </div>
                                    <div
                                        onClick={logout}
                                        className='flex items-center gap-3 cursor-pointer hover:bg-red-100 p-3 rounded-lg transition-all'
                                    >
                                        <LogOut className="text-red-600 w-6 h-6" />
                                        <span className="text-red-600 font-medium">Logout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
