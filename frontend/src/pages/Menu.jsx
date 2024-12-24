import React, { useContext, useState } from 'react';
import DrinkItem from '../components/DrinkItem';
import FoodItem from '../components/FoodItem';
import { StoreContext } from '../context/StoreContext';

const Menu = () => {
    const [menuType, setMenuType] = useState("Food"); // "Food" or "Drinks"
    const [category, setCategory] = useState("All");
    const { filteredFoodList, drink_list } = useContext(StoreContext);

    const foodCategories = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];
    const drinkCategories = ["All", "Cocktails", "Mocktails", "Smoothies", "Soft Drinks", "Hot Beverages"];

    const handleCategoryClick = (cat) => {
        setCategory(prevCategory => (prevCategory === cat ? "All" : cat));
    };

    const toggleMenuType = () => {
        setMenuType(prevType => (prevType === "Food" ? "Drinks" : "Food"));
        setCategory("All"); // Reset category when switching menus
    };

    const filteredItems = menuType === "Food"
        ? filteredFoodList.filter((item) => category === "All" || category === item.category)
        : drink_list.filter((item) => category === "All" || category === item.drink_Category);

    return (
        <div>
            {/* Toggle Menu Type */}
            <div className="flex justify-center mt-5">
                <button
                    className="bg-green-500 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-600 transition"
                    onClick={toggleMenuType}
                >
                    {menuType === "Food" ? "Switch to Drinks" : "Switch to Food"}
                </button>
            </div>

            {/* Header with category browsing */}
            <div className="flex justify-center items-center mt-5">
                <h2 className="text-[max(2vw,24px)] font-bold text-center">
                    {category === "All"
                        ? `OUR ${menuType.toUpperCase()} MENU`
                        : `${category.toUpperCase()} (${menuType})`}
                </h2>
            </div>

            <p className="text-gray-600 text-center mt-2">Browse through the {menuType} categories.</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                {/* Category selection menu */}
                <div className="flex flex-col gap-2 text-sm text-gray-700">
                    {(menuType === "Food" ? foodCategories : drinkCategories).map((cat) => (
                        <p
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`w-[94vw sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${category === cat ? 'bg-green-500 text-white' : ''
                                }`}
                        >
                            {cat}
                        </p>
                    ))}
                </div>

                {/* Display items based on menu type and category */}
                <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[30px] row-gap-[50px]">
                        {filteredItems.map((item, index) =>
                            menuType === "Food" ? (
                                <FoodItem
                                    key={index}
                                    id={item.id}
                                    name={item.name}
                                    description={item.description}
                                    price={item.price}
                                    image={item.image}
                                    rating={item.rating}
                                />
                            ) : (
                                <DrinkItem
                                    key={index}
                                    id={item.drink_Id}
                                    name={item.drink_Name}
                                    description={item.drink_Description}
                                    price={item.drink_Price}
                                    image={item.drink_Image}
                                    rating={item.average_Rating}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
