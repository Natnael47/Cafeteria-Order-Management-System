import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import Title from '../../components/Title';
import "./Menu.css";


const Menu = () => {

    const [category, setCategory] = useState("All");

    return (
        <div className='menu'>
            <Title text1={'OUR'} text2={'MENU'} />
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu