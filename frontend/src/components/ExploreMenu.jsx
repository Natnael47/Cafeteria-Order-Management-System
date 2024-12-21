import React from 'react';
import { menu_list, menu_list_drink } from '../assets/assets';

const ExploreMenu = ({ category, setCategory, type, setType }) => {
    // Determine the menu list to display based on the type (food or drink)
    const currentMenuList = type === "food" ? menu_list : menu_list_drink;

    return (
        <div className="flex flex-col gap-6 px-4 py-2" id="explore-menu">
            <hr className="my-2 h-[2px] bg-gray-300 border-none" />
            <div className="flex justify-between items-center">
                <h1 className="text-[#262626] font-bold text-3xl">Explore our menu</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setType("food")}
                        className={`px-5 py-2 rounded-lg font-medium text-lg transition-all duration-200 ${type === "food" ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        Food
                    </button>
                    <button
                        onClick={() => setType("drink")}
                        className={`px-5 py-2 rounded-lg font-medium text-lg transition-all duration-200 ${type === "drink" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        Drinks
                    </button>
                </div>
            </div>
            <p className="text-[#808080] text-base md:text-lg max-w-[100%]">
                Choose from a diverse menu featuring a delectable array of dishes and drinks. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
            <div className="flex justify-between items-center gap-5 text-center my-5 overflow-x-scroll no-scrollbar">
                {currentMenuList.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <img
                            className={`w-[7.5vw] min-w-[80px] rounded-full transition-all duration-200 ${category === item.menu_name ? "border-[4px] border-green-500 shadow-lg p-[2px]" : "border-[2px] border-gray-200 hover:border-gray-400"
                                }`}
                            src={item.menu_image}
                            alt={item.menu_name}
                        />
                        <p
                            className={`mt-2 text-[max(1.2vw,16px)] font-medium transition-all duration-200 ${category === item.menu_name ? "text-green-600 font-semibold" : "text-gray-800 hover:text-primary"
                                }`}
                        >
                            {item.menu_name}
                        </p>
                    </div>
                ))}
            </div>
            <hr className="my-2 h-[2px] bg-gray-300 border-none" />
        </div>
    );
};

export default ExploreMenu;
