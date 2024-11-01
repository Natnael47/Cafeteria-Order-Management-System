import React, { useState } from 'react'
import AppDownload from '../components/AppDownload'
import ExploreMenu from '../components/ExploreMenu'
import Feedback from '../components/Feedback'
import FoodDisplay from '../components/FoodDisplay'
import Header from '../components/Header'

const Home = () => {
    const [category, setCategory] = useState("All");

    return (
        <div className='bg-[#f0f9f1]'>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <AppDownload />
            <Feedback />
        </div>
    )
}

export default Home