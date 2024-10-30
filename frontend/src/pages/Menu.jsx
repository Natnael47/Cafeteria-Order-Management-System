import React, { useContext, useState } from 'react';
import FoodItem from '../components/FoodItem';
import { StoreContext } from '../context/StoreContext';


const Menu = () => {

    const [category, setCategory] = useState("All");

    const { food_list } = useContext(StoreContext);

    return (
        <div className="mt-[30px] mb-[100px]" id="food-display">
            <h2 className="text-[max(2vw,24px)] font-bold text-center"> OUR MENU</h2>
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

        </div>
    );
}

export default Menu