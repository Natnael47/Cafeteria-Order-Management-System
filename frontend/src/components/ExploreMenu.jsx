import React from 'react';
import { menu_list } from '../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {

    return (
        <div className="flex flex-col gap-4" id="explore-menu">
            <hr className="my-2 h-[2px] bg-gray-500 border-none" />
            <h1 className="text-[#262626] font-bold text-2xl">Explore our menu</h1>
            <p className="max-w-[80%] text-[#808080] md:max-w-full md:text-base">
                Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.
            </p>
            <div className="flex justify-between items-center gap-[30px] text-center my-5 overflow-x-scroll no-scrollbar">
                {menu_list.map((item, index) => {
                    return (
                        <div
                            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
                            key={index}
                            className="cursor-pointer"
                        >
                            <img
                                className={`w-[7.5vw] min-w-[80px] rounded-full transition-all duration-200 ${category === item.menu_name ? "border-[5px] border-[#46dc55] p-[2px]" : ""}`}
                                src={item.menu_image}
                                alt={item.menu_name}
                            />
                            <p className="mt-2 text-black text-[max(1.4vw,16px)] cursor-pointer">{item.menu_name}</p>
                        </div>
                    )
                })}
            </div>
            <hr className="my-2 h-[2px] bg-gray-500 border-none" />
        </div>
    );
}

export default ExploreMenu;
