import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import FoodItem from './FoodItem';

const FoodDisplay = ({ category }) => {
    const { food_list, token, fetchFavorites } = useContext(StoreContext);
    const [showAll, setShowAll] = useState(false); // State to toggle display of all items
    const [favoriteFoods, setFavoriteFoods] = useState([]); // State for favorite foods
    const [displayList, setDisplayList] = useState([]); // Combined display list

    useEffect(() => {
        const loadFavorites = async () => {
            if (token) { // Only fetch favorites if there is a token
                const { favoriteFoods } = await fetchFavorites();
                setFavoriteFoods(favoriteFoods);
            } else {
                setFavoriteFoods([]); // If no token, set favorites to empty array
            }
        };
        loadFavorites();
    }, [fetchFavorites, token]); // Add token as a dependency

    useEffect(() => {
        // Merge favorites with the rest of the items, ensuring no duplicates
        const nonFavoriteFoods = food_list.filter(
            (food) => !favoriteFoods.some((fav) => fav.id === food.id)
        );
        setDisplayList([...favoriteFoods, ...nonFavoriteFoods]);
    }, [food_list, favoriteFoods]);

    // Filter items based on the category
    const filteredItems = displayList.filter(
        (item) => category === "All" || category === item.category
    );

    // Determine items to display based on showAll
    const itemsToDisplay = showAll ? filteredItems : filteredItems.slice(0, 8);

    return (
        <div className="mt-[30px]" id="food-display">
            <h2 className="text-[max(2vw,24px)] font-semibold">Popular Dishes From Our Menu</h2>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mt-[30px] gap-[30px] row-gap-[50px]">
                {itemsToDisplay.map((item, index) => (
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
};

export default FoodDisplay;
