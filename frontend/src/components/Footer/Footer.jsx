import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo} alt='' />
                    <p>Kare plus grill & Lounge is one of well known grill and resturant house in Addis Ababa!</p>
                    <div className="footer-social-icons">
                        <img src={assets.twitter_iconBlue} alt="" />
                        <img src={assets.instagram_icon} alt="" />
                        <img src={assets.facebook_iconBlue} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li><img src={assets.location_icon} alt="" /> Lebu, Addis Ababa, Ethiopia</li>
                        <li><img src={assets.simCard_icon} alt="" /> +251 911429199</li>
                        <li><img src={assets.email_icon17} alt="" /> Contact@order.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2024 @ Order.com - All Right Reserved.
            </p>
        </div>
    )
}

export default Footer