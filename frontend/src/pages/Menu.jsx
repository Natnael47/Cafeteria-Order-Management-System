import React, { useState } from 'react';
import FoodDisplay from '../components/FoodDisplay';
import Title from '../components/Title';


const Menu = () => {

    const [category, setCategory] = useState("All");

    return (
        <div>
            <div className='text-center text-2xl pt-10 text-black'>
                <Title text1={'OUR'} text2={'Menu'} />
            </div>
            <div className='text-2xl'>
                <FoodDisplay category={category} />
            </div>
        </div>
    )
}

export default Menu