import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <div className="text-black bg-[#DBDBDA] flex flex-col gap-5 px-[8vw] pt-20 mt-[50px]" id="footer">
            <div className="w-full grid grid-cols-[2fr_1fr_1fr] gap-[80px]">
                <div className="flex flex-col items-start gap-5">
                    <img className='max-w-[210px]' src={assets.footerlogo} alt="" />
                    <p className='w-full md:w-2/3 leading-6'>Cozy Cafe is a family-owned business
                        that has been serving the community
                        for over 10 years. We are dedicated to
                        providing high-quality food and
                        exceptional customer service.</p>
                    <div className="flex">
                        <img src={assets.twitter_icon} alt="Twitter" className="w-[40px] mr-4" />
                        <img src={assets.instagram_icon} alt="Instagram" className="w-[40px] mr-4" />
                        <img src={assets.facebook_icon} alt="Facebook" className="w-[40px]" />

                    </div>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <h2 className="font-semibold">COMPANY</h2>
                    <ul>
                        <li className="list-none mb-2 cursor-pointer">Home</li>
                        <li className="list-none mb-2 cursor-pointer">About us</li>
                        <li className="list-none mb-2 cursor-pointer">Delivery</li>
                        <li className="list-none mb-2 cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>
                <div className="flex flex-col items-start gap-5">
                    <h2 className="font-semibold">GET IN TOUCH</h2>
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
            <hr className="w-full h-[2px] mt-5 bg-gray-500 border-none" />
            <p className=" text-center mb-5">Copyright 2024 @ Order.com - All Rights Reserved.</p>
        </div>
    );
}

export default Footer;
