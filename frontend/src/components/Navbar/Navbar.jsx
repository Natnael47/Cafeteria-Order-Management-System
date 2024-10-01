import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import "./Navbar.css";

export const Navbar = ({ setShowLogin }) => {

    const [currState, setCurrState] = useState("home");

    const [menu, setMenu] = useState("home");

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    const { setShowSearch } = useContext(StoreContext);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }


    return (
        <div className="navbar">
            <Link to='/'><img src={assets.logo2} alt="" className="logo" /></Link>
            <ul className="navbar-menu">
                <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                {currState === "cart"
                    ? <Link to='/menu' onClick={() => setMenu("menu") & setCurrState("home")} className={menu === "menu" ? "active" : ""}>menu</Link>
                    : <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                }
                <Link to='/about' onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>About</Link>
                <Link to='/contact' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</Link>

            </ul>
            <div className="navbar-right">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className="search" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.cart_icon} alt="" onClick={() => setCurrState("cart")} /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
                    : <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img src={assets.profile_icon} alt="" />
                        <img className="w-2.5" src={assets.drop_down_icon} alt="" />
                        <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-500 z-20 hidden group-hover:block">
                            <div className="min-w-40 bg-[#FBFDFB] rounded flex flex-col gap-4 p-4 border border-primary">
                                <p onClick={() => navigate('/myprofile')} className=" hover:text-black cursor-pointer">My Profile</p>
                                <p onClick={() => navigate('/myorders')} className=" hover:text-black cursor-pointer">My Orders</p>
                                <p onClick={logout} className=" hover:text-red-700 cursor-pointer">Logout</p>
                            </div>
                        </div>
                    </div>}

            </div>
        </div>
    );
};
