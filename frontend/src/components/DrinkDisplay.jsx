import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import DrinkItem from './DrinkItem';

const DrinkDisplay = ({ category }) => {
    const { drink_list } = useContext(StoreContext);
    const [showAll, setShowAll] = useState(false); // State to toggle display of all items

    // Filter items based on the category
    const filteredItems = drink_list.filter(
        (item) => category === "All" || category === item.drink_Category
    );

    // Determine items to display based on showAll
    const itemsToDisplay = showAll ? filteredItems : filteredItems.slice(0, 8);

    return (
        <div className="mt-[30px]" id="food-display">
            <h2 className="text-[max(2vw,24px)] font-semibold">Popular Drinks From Our Menu</h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mt-[30px] gap-[30px] row-gap-[50px]">
                {itemsToDisplay.map((item, index) => (
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
                ))}
            </div>

            {/* "Show All" Link - Appears only if there are more than 8 items */}
            {filteredItems.length > 8 && (
                <div className="text-center mt-[20px]">
                    <button
                        className="text-green-500 font-medium hover:underline"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show Less" : "Show All"}
                    </button>
                </div>
            )}

            <hr className="my-[10px] h-[2px] bg-gray-500 border-none mt-[30px]" />
        </div>
    );
}

export default DrinkDisplay