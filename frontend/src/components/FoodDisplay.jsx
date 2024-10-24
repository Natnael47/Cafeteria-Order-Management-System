import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import FoodItem from './FoodItem';

const FoodDisplay = ({ category }) => {

    const { food_list } = useContext(StoreContext);

    return (
        <div className="mt-[30px]" id="food-display">
            <h2 className="text-[max(2vw,24px)] font-semibold">Popular Dishes From Our Menu</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mt-[30px] gap-[30px] row-gap-[50px]">
                {food_list.map((item, index) => {
                    if (category === "All" || category === item.category) {
                        return (
                            <FoodItem
                                key={index}
                                id={item.id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        );
                    }
                })}
            </div>
            <hr className="my-[10px] h-[2px] bg-gray-500 border-none mt-[30px]" />
        </div>
    );
};

export default FoodDisplay;
