import React, { useContext, useState } from 'react';
import DrinkItem from '../components/DrinkItem';
import FoodItem from '../components/FoodItem';
import { StoreContext } from '../context/StoreContext';

const Menu = () => {
    const [menuType, setMenuType] = useState("Food"); // "Food" or "Drinks"
    const [category, setCategory] = useState("All");
    const { filteredFoodList, drink_list } = useContext(StoreContext);

    const foodCategories = ["All", "Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];
    const drinkCategories = ["All", "Cocktails", "Mocktails", "Smoothies", "Soda", "Hot Beverages"];

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
        <div className="p-6 min-h-screen">
            {/* Top Navigation */}
            <div className="flex items-center justify-between bg-white shadow-md rounded-lg px-6 py-4">
                <h2 className="text-4xl font-extrabold text-gray-800">
                    {category === "All"
                        ? `Our ${menuType} Menu`
                        : `${category} (${menuType})`}
                </h2>
                <button
                    className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                    onClick={toggleMenuType}
                >
                    {menuType === "Food" ? "Switch to Drinks" : "Switch to Food"}
                </button>
            </div>

            {/* Header */}
            <div className="text-center mt-6">
                <p className="text-gray-600 mt-2">
                    Browse through our handpicked selection of {menuType.toLowerCase()}.
                </p>
            </div>

            {/* Categories Horizontal Scroll */}
            <div className="mt-8">
                <div className="flex overflow-x-auto gap-4 scrollbar-hide">
                    {(menuType === "Food" ? foodCategories : drinkCategories).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all ${category === cat
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                            isFasting={item.isFasting}
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
                            isAlcoholic={item.is_Alcoholic}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default Menu;
