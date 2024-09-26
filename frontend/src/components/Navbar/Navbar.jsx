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
                <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>About</a>
                <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>contact us</a>
            </ul>
            <div className="navbar-right">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} alt="" className="search" />
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.cart_icon} alt="" onClick={() => setCurrState("cart")} /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button onClick={() => setShowLogin(true)}>sign in</button> : <div className="navbar-profile">
                    <img src={assets.profile_icon} alt="" />
                    <ul className="nav-profile-dropdown">
                        <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                        <hr />
                        <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                        <hr />
                        <li onClick={() => navigate('/myprofile')}><img src={assets.profile_icon} alt="" /><p>Profile</p></li>
                    </ul>
                </div>}

            </div>
        </div>
    );
};
