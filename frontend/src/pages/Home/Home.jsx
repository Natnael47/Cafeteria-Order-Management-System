import React, { useState } from 'react'
import AppDownload from '../../components/AppDownload/AppDownload'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import Feedback from '../../components/FeedBack/Feedback'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Header from '../../components/Header/Header'
import './Home.css'

const Home = () => {
    const [category, setCategory] = useState("All");

    return (
        <div className='home'>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <AppDownload />
            <Feedback />
        </div>
    )
}

export default Home