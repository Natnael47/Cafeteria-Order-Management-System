import React from 'react';
import { menu_list, menu_list_drink } from '../assets/assets';

const ExploreMenu = ({ category, setCategory, type, setType }) => {
    // Determine the menu list to display based on the type (food or drink)
    const currentMenuList = type === "food" ? menu_list : menu_list_drink;

    return (
        <div className="flex flex-col gap-6 px-4 py-2" id="explore-menu">
            <hr className="my-2 h-[2px] bg-gray-300 border-none" />
            <div className="flex justify-between items-center">
                {/* Heading with Dynamic Text */}
                <h1 className="text-[#262626] font-bold text-3xl text-center">
                    {type === "drink" ? "Explore our Drink Menu" : "Explore our Food Menu"}
                </h1>

                {/* Toggle Switch */}
                <div className="relative flex flex-col items-center gap-4">
                    {/* Switch Container */}
                    <div
                        className={`relative w-36 h-12 rounded-full cursor-pointer shadow-inner transition-all duration-300 ${type === "drink" ? "bg-blue-500" : "bg-green-500"
                            }`}
                        onClick={() => setType((prevType) => (prevType === "food" ? "drink" : "food"))}
                    >
                        {/* Switch Handle */}
                        <div
                            className={`absolute top-1 left-1 w-16 h-10 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-300 ${type === "drink" ? "translate-x-[112%]" : "translate-x-0"
                                }`}
                        >
                            <p className="text-sm font-semibold text-black">{type === "drink" ? "Drink" : "Food"}</p>
                        </div>
                        {/* Switch Labels */}
                        <div className="absolute inset-0 flex justify-between items-center text-white font-bold px-4">
                            <span
                                className={`text-sm cursor-pointer transition-opacity duration-300 ${type === "food" ? "opacity-0" : "opacity-100"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setType("food");
                                }}
                            >
                                Food
                            </span>
                            <span
                                className={`text-sm cursor-pointer transition-opacity duration-300 ${type === "drink" ? "opacity-0" : "opacity-100"
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setType("drink");
                                }}
                            >
                                Drinks
                            </span>
                        </div>
                    </div>
                </div>

            </div>
            <p className="text-[#808080] text-base md:text-lg max-w-[100%]">
                Choose from a diverse menu featuring a delectable array of dishes and drinks. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
            <div className="flex justify-between items-center gap-5 text-center my-1 overflow-x-scroll no-scrollbar">
                {currentMenuList.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))}
                        className="flex flex-col items-center cursor-pointer"
                    >
                        <img
                            className={`w-[92px] h-[92px] rounded-full transition-all duration-200 ${category === item.menu_name ? "border-[4px] border-green-500 shadow-lg p-[2px]" : "border-[2px] border-gray-200 hover:border-gray-400"}`}
                            src={item.menu_image}
                            alt={item.menu_name}
                            style={{ objectFit: 'cover' }}
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
