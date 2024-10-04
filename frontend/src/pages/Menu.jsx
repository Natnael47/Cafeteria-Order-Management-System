import React, { useState } from 'react';
import FoodDisplay from '../components/FoodDisplay';
import Title from '../components/Title';


const Menu = () => {

    const [category, setCategory] = useState("All");

    return (
        <div>
            <Title text1={'OUR'} text2={'MENU'} />
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu