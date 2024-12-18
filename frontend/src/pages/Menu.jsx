import React, { useContext, useState } from 'react';
import FoodItem from '../components/FoodItem';
import { StoreContext } from '../context/StoreContext';

const Menu = () => {
    const [category, setCategory] = useState("All");
    const { filteredFoodList, search } = useContext(StoreContext);

    const handleCategoryClick = (cat) => {
        // If the clicked category is already selected, reset to "All"
        setCategory(prevCategory => (prevCategory === cat ? "All" : cat));
    };

    return (
        <div>
            {/* Header with category browsing and dynamic title */}
            <div className="flex justify-center items-center mt-5">
                <h2 className="text-[max(2vw,24px)] font-bold text-center">
                    {category === "All" ? "OUR MENU" : `${category.toUpperCase()}'S`}
                </h2>
            </div>

            <p className="text-gray-600 text-center mt-2">Browse through the Food Categories.</p>
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>

                {/* Category selection menu */}
                <div className='flex flex-col gap-2 text-sm text-gray-700'>
                    {["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"].map((cat) => (
                        <p
                            key={cat}
                            onClick={() => handleCategoryClick(cat)} // Set category on click, or reset to "All"
                            className={`w-[94vw sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === cat ? 'bg-green-500 text-white' : ''}`}
                        >
                            {cat}
                        </p>
                    ))}
                </div>

                {/* Display food items based on selected category */}
                <div className="w-full grid grid-cols-auto gap-4 gap-y-6" id="food-display">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[30px] row-gap-[50px]">
                        {filteredFoodList
                            .filter((item) => category === "All" || category === item.category) // Filter items based on category
                            .map((item, index) => (
                                <FoodItem
                                    key={index}
                                    id={item.id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    image={item.image}
                                    rating={item.rating}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
