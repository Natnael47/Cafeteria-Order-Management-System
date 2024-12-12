import React, { useState } from "react";
import ExploreMenu from "../components/ExploreMenu";
import Feedback from "../components/Feedback";
import FoodDisplay from "../components/FoodDisplay";
import Header from "../components/Header";
import ServicesSection from "../components/ServicesSection";

const Home = () => {
    const [category, setCategory] = useState("All");

    return (
        <div className="bg-[#f0f9f1]">
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            <ServicesSection />
            <Feedback />
        </div>
    );
};

export default Home;
