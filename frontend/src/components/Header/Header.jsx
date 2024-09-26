import React from 'react'
import { assets } from '../../assets/assets'
import './Header.css'


const Header = () => {
    return (
        <div className='header'>
            <div className="header-content">
                <h2>Welcome to Kare Plus Grill & Louge
                    Enjoy our delicious food and drinks in a warm atmosphere</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise atisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button>ORDER NOW</button>
            </div>
            <div className="burger">
                <img src={assets.burger_image} alt="" />
            </div>
        </div>
    )
}

export default Header