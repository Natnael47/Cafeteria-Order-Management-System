import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <div className="text-[#d9d9d9] bg-[#323232] flex flex-col items-center gap-5 px-[8vw] pt-20 mt-[100px]" id="footer">
            <div className="w-full grid grid-cols-[2fr_1fr_1fr] gap-[80px] max-w-screen-lg">
                <div className="flex flex-col items-start gap-5">
                    <img src={assets.logo} alt="" />
                    <p>Kare plus grill & Lounge is one of the well-known grill and restaurant houses in Addis Ababa!</p>
                    <div className="flex">
                        <img src={assets.twitter_iconBlue} alt="Twitter" className="w-[40px] mr-4" />
                        <img src={assets.instagram_icon} alt="Instagram" className="w-[40px] mr-4" />
                        <img src={assets.facebook_iconBlue} alt="Facebook" className="w-[40px]" />
                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <h2 className="text-white">COMPANY</h2>
                    <ul>
                        <li className="list-none mb-2 cursor-pointer">Home</li>
                        <li className="list-none mb-2 cursor-pointer">About us</li>
                        <li className="list-none mb-2 cursor-pointer">Delivery</li>
                        <li className="list-none mb-2 cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <h2 className="text-white">GET IN TOUCH</h2>
                    <ul>
                        <li className="list-none mb-2 cursor-pointer flex items-center">
                            <img src={assets.location_icon} alt="Location" className="pr-2" /> Lebu, Addis Ababa, Ethiopia
                        </li>
                        <li className="list-none mb-2 cursor-pointer flex items-center">
                            <img src={assets.simCard_icon} alt="Phone" className="pr-2" /> +251 911429199
                        </li>
                        <li className="list-none mb-2 cursor-pointer flex items-center">
                            <img src={assets.email_icon17} alt="Email" className="pr-2" /> Contact@order.com
                        </li>
                    </ul>
                </div>
            </div>
            <hr className="w-full h-[2px] my-5 bg-gray-500 border-none" />
            <p className="text-center">Copyright 2024 @ Order.com - All Rights Reserved.</p>
        </div>
    );
}

export default Footer;
