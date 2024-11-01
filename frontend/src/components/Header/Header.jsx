import React from 'react';
import { assets } from '../../assets/assets';

const Header = () => {
    return (
        <div
            className="h-[34vw] my-8 mx-auto relative flex bg-no-repeat bg-right bg-contain max-w-screen-xl"
            style={{ backgroundImage: "url('/green-bg.png')" }}
        >
            <div className="flex-1 flex flex-col gap-6 text-start animate-fadeIn max-w-lg ml-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight mt-[105px]">
                    Welcome to Kare Plus Grill & Lounge
                </h2>
                <p className="text-lg text-gray-700 lg:text-xl">
                    Enjoy our delicious food and drinks in a warm atmosphere. Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.
                </p>
                <button className="bg-[#39db4a] text-white font-medium py-3 px-6 rounded-full text-lg transition-transform duration-300 ease-in-out mt-10 hover:scale-105 hover:bg-black">
                    ORDER NOW
                </button>
            </div>
            <div className="hidden lg:block lg:flex-1 lg:relative lg:right-0 animate-fadeIn">
                <img src={assets.burger_image} alt="Delicious burger" className="w-[450px] object-cover rounded-lg my-10 mx-16" />
            </div>
        </div>
    );
};

export default Header;
