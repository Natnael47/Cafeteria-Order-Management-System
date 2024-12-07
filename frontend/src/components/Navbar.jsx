import { HandPlatter, LogOut, MessageSquareMore, Search, User } from 'lucide-react';
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

export const Navbar = ({ setShowFeedback }) => {
    const location = useLocation();
    const { getTotalCartAmount, token, setToken, navigate, setShowSearch, getCartItems } = useContext(StoreContext);

    const [menu, setMenu] = useState("");
    const [hasShadow, setHasShadow] = useState(false);

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
        navigate('/login'); // Navigate to login page
    };

    return (
        <div
            className={`fixed top-0 w-full bg-gradient-to-r bg-[#F0F9F1] z-50 transition-shadow duration-300 ${hasShadow ? 'shadow-lg' : ''
                } flex justify-between items-center py-4 px-10 md:px-20 lg:px-40`}
        >
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
                        <img src={assets.profile_icon} alt='Profile' className='w-8 transition-transform duration-300 hover:scale-110' />
                        <img src={assets.drop_down_icon} alt='Dropdown' className='w-2.5' />

                        {/* Dropdown Menu */}
                        <div className='absolute right-0 top-0 pt-14 z-20 hidden group-hover:block'>
                            <div className='bg-white rounded-lg shadow-lg border border-green-300 p-4 flex flex-col gap-4 min-w-[160px]'>
                                <p
                                    onClick={() => navigate('/myprofile')}
                                    className='flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors'
                                >
                                    <User /> Profile
                                </p>
                                <p
                                    onClick={() => navigate('/myorders')}
                                    className='flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors'
                                >
                                    <HandPlatter /> Orders
                                </p>
                                <p
                                    onClick={() => setShowFeedback(true)}
                                    className='flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors'
                                >
                                    <MessageSquareMore /> Feedback
                                </p>
                                <p
                                    onClick={logout}
                                    className='flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-700 transition-colors'
                                >
                                    <LogOut /> Logout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
