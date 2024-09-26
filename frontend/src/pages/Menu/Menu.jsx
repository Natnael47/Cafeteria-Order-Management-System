import React, { useState } from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import "./Menu.css";


const Menu = () => {

    const [category, setCategory] = useState("All");

    return (
        <div className='menu'>
            <FoodDisplay category={category} />
        </div>
    )
}

export default Menu