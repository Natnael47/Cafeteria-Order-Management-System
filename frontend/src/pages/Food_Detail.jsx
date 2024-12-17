import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const Food_Detail = () => {
    const { food_list, addToCart, removeFromCart, cartItems } = useContext(StoreContext);
    const { id } = useParams(); // Get food id from URL
    const navigate = useNavigate();

    const [currentFood, setCurrentFood] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for food_list to load
        if (food_list.length > 0) {
            const foodItem = food_list.find((food) => food.id === Number(id));
            if (foodItem) {
                setCurrentFood(foodItem);
                setLoading(false);
            } else {
                navigate("/not-found"); // Redirect if food not found
            }
        }
    }, [id, food_list, navigate]);

    // Functions for navigation
    const handleNext = () => {
        const currentIndex = food_list.findIndex((food) => food.id === Number(id));
        const nextIndex = (currentIndex + 1) % food_list.length;
        navigate(`/food-detail/${food_list[nextIndex].id}`);
    };

    const handlePrevious = () => {
        const currentIndex = food_list.findIndex((food) => food.id === Number(id));
        const prevIndex = (currentIndex - 1 + food_list.length) % food_list.length;
        navigate(`/food-detail/${food_list[prevIndex].id}`);
    };

    if (loading || !currentFood) {
        return <div className="flex justify-center items-center h-screen text-green-600 text-xl">Loading...</div>;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 to-white p-5">
            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-5 flex flex-col gap-4">
                <button
                    className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg"
                    onClick={handlePrevious}
                    aria-label="Previous Food"
                >
                    <ArrowUp size={28} />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-5 flex flex-col gap-4">
                <button
                    className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg"
                    onClick={handleNext}
                    aria-label="Next Food"
                >
                    <ArrowDown size={28} />
                </button>
            </div>

            {/* Food Image */}
            <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-10 bg-white rounded-lg shadow-2xl overflow-hidden">
                <img
                    src={`${backendUrl}/images/${currentFood.image}`}
                    alt={currentFood.name}
                    className="w-full lg:w-[50%] h-[300px] object-cover animate-fadeIn"
                />

                {/* Food Details */}
                <div className="p-6 text-center lg:text-left">
                    <h1 className="text-4xl font-extrabold text-green-600 mb-4">{currentFood.name}</h1>
                    <p className="text-gray-700 text-lg mb-4">{currentFood.description}</p>
                    <p className="text-2xl font-semibold text-green-700 mb-6">{currentFood.price} Birr</p>

                    {/* Add to Cart Controls */}
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                        <button
                            onClick={() => removeFromCart(currentFood.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition"
                        >
                            -
                        </button>
                        <p className="text-xl font-semibold">{cartItems[currentFood.id] || 0}</p>
                        <button
                            onClick={() => addToCart(currentFood.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Food_Detail;
