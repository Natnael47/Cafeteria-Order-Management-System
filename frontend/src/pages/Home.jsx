import React, { useState } from "react";
import DrinkDisplay from "../components/DrinkDisplay";
import ExploreMenu from "../components/ExploreMenu";
import Feedback from "../components/Feedback";
import FoodDisplay from "../components/FoodDisplay";
import Header from "../components/Header";
import ServicesSection from "../components/ServicesSection";

const Home = () => {
    const [category, setCategory] = useState("All");
    const [type, setType] = useState("food"); // "food" or "drink"

    return (
        <div className="bg-[#f0f9f1]">
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} type={type} setType={setType} />
            {type === "food" ? <FoodDisplay category={category} /> : <DrinkDisplay category={category} />}
            <ServicesSection />
            <Feedback />
        </div>
    );
};

export default Home;
