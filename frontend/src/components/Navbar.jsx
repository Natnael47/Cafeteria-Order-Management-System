import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

export const Navbar = ({ setShowLogin, setShowFeedback }) => {

    const [currState, setCurrState] = useState("home");

    const [menu, setMenu] = useState("home");

    const { getTotalCartAmount, token, setToken, navigate, setShowSearch, getCartItems } = useContext(StoreContext);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    return (
        <div className="flex justify-between items-center py-5 ">
            <Link to='/'>
                <img src={assets.logo2} alt="Logo" className="w-[150px] md:w-[120px] lg:w-[150px]" />
            </Link>
            <ul className="flex list-none gap-5 text-black text-lg lg:gap-4 md:gap-3 md:text-base sm:flex">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "border-b-2 border-black pb-1 font-semibold" : ""}>Home</Link>
                {menu !== "home" ?
                    <Link to='/menu' onClick={() => { setMenu("menu"); setCurrState("home"); }} className={menu === "menu" ? "border-b-2 border-black pb-1 font-semibold" : ""}>Menu</Link>
                    :
                    <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "border-b-2 border-black pb-1 font-semibold" : ""}>Menu</a>
                }
                <Link to='/about' onClick={() => setMenu("about")} className={menu === "about" ? "border-b-2 border-black pb-1 font-semibold" : ""}>About</Link>
                <Link to='/contact' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "border-b-2 border-black pb-1 font-semibold" : ""}>Contact Us</Link>
            </ul>
            <div className=" flex items-center gap-10 md:gap-8">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="Search" className="w-[30px] md:w-[22px] lg:w-[20px] cursor-pointer" />
                <div className=" flex items-center gap-[30px]">
                    <Link to='/cart' className="relative">
                        <img src={assets.cart_icon} alt="Cart" onClick={() => setCurrState("cart")} className="cursor-pointer w-8" />
                    </Link>
                    <div className={getTotalCartAmount() === 0 ? "hidden" : " w-4 h-4 flex justify-center items-center -mt-[35px] -ml-[35px] rounded-[11px] text-[10px] bg-red-600 text-white"}>{getCartItems()}</div>
                </div>

                {!token ?
                    <button onClick={() => setShowLogin(true)} className="bg-[#39db4a] text-white text-lg font-medium py-2 px-6 rounded-full transition hover:bg-black">Sign In</button>
                    :
                    <div className="relative flex items-center gap-2 cursor-pointer group">
                        <img src={assets.profile_icon} alt="Profile" />
                        <img className="w-2.5" src={assets.drop_down_icon} alt="Dropdown" />
                        <div className="absolute right-0 top-0 pt-14 z-20 hidden group-hover:block">
                            <div className="bg-[#FBFDFB] rounded border border-primary p-4 flex flex-col gap-4 min-w-[160px]">
                                <p onClick={() => navigate('/myprofile')} className="cursor-pointer hover:text-primary">My Profile</p>
                                <p onClick={() => navigate('/myorders')} className="cursor-pointer hover:text-primary"> My Orders</p>
                                <p onClick={() => setShowFeedback(true)} className="cursor-pointer hover:text-primary">Feedback</p>
                                <p onClick={logout} className="cursor-pointer hover:text-red-500">Logout</p>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};
