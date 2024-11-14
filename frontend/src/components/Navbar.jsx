import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

export const Navbar = ({ setShowLogin, setShowFeedback }) => {
    const location = useLocation();
    const { getTotalCartAmount, token, setToken, navigate, setShowSearch, getCartItems } = useContext(StoreContext);

    const [menu, setMenu] = useState("");
    const [hasShadow, setHasShadow] = useState(false);

    useEffect(() => {
        // Scroll to the top only if the path is not the home page
        if (location.pathname === "/menu" || location.pathname === "/about" || location.pathname === "/contact") {
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
        // Event listener to toggle shadow on scroll
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

    // Scroll to the top and lock the scroll when Sign In is clicked
    const handleSignInClick = () => {
        window.scrollTo(0, 0);  // Scroll to the top of the page
        setShowLogin(true);  // Show the login popup
    };

    return (
        <div className={`fixed top-0 w-full bg-[#F0F9F1] z-50 transition-shadow duration-300 ${hasShadow ? 'shadow-md' : ''} flex justify-between items-center py-5 px-40`}>
            <Link to='/'>
                <img src={assets.logo2} alt="Logo" className="w-[150px] md:w-[120px] lg:w-[150px]" />
            </Link>
            <ul className="flex list-none gap-5 text-black text-lg lg:gap-4 md:gap-3 md:text-base sm:flex">
                <Link
                    to='/'
                    onClick={() => setMenu("home")}
                    className={menu === "home" ? "border-b-2 border-black pb-1 font-semibold" : ""}
                >
                    Home
                </Link>
                <span
                    onClick={handleMenuClick}
                    className={menu === "menu" ? "border-b-2 border-black pb-1 font-semibold cursor-pointer" : "cursor-pointer"}
                >
                    Menu
                </span>
                <Link
                    to='/about'
                    onClick={() => setMenu("about")}
                    className={menu === "about" ? "border-b-2 border-black pb-1 font-semibold" : ""}
                >
                    About
                </Link>
                <Link
                    to='/contact'
                    onClick={() => setMenu("contact-us")}
                    className={menu === "contact-us" ? "border-b-2 border-black pb-1 font-semibold" : ""}
                >
                    Contact Us
                </Link>
            </ul>
            <div className="flex items-center gap-10 md:gap-8">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="Search" className="w-[30px] md:w-[22px] lg:w-[20px] cursor-pointer" />
                <div className="relative flex items-center gap-[30px]">
                    <Link to='/cart' className="relative">
                        <img src={assets.cart_icon} alt="Cart" className="cursor-pointer w-8" />
                        <div className={`absolute w-4 h-4 -top-[8px] -right-[10px] rounded-full text-[10px] bg-red-600 text-white flex justify-center items-center transition ${getTotalCartAmount() === 0 ? "opacity-0" : "opacity-100"}`}>
                            {getCartItems()}
                        </div>
                    </Link>
                </div>

                {!token ? (
                    <button onClick={handleSignInClick} className="bg-[#39db4a] text-white text-lg font-medium py-2 px-6 rounded-full transition hover:bg-black">Sign In</button>
                ) : (
                    <div className="relative flex items-center gap-2 cursor-pointer group">
                        <img src={assets.profile_icon} alt="Profile" />
                        <img className="w-2.5" src={assets.drop_down_icon} alt="Dropdown" />
                        <div className="absolute right-0 top-0 pt-14 z-20 hidden group-hover:block">
                            <div className="bg-[#FBFDFB] rounded border border-primary p-4 flex flex-col gap-4 min-w-[160px]">
                                <p onClick={() => navigate('/myprofile')} className="cursor-pointer hover:text-primary">My Profile</p>
                                <p onClick={() => navigate('/myorders')} className="cursor-pointer hover:text-primary">My Orders</p>
                                <p onClick={() => setShowFeedback(true)} className="cursor-pointer hover:text-primary">Feedback</p>
                                <p onClick={logout} className="cursor-pointer hover:text-red-500">Logout</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
