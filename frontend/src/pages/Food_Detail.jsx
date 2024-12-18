import { ArrowDown, ArrowUp, Star } from "lucide-react";
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
    const [customizations, setCustomizations] = useState("");
    const [rating, setRating] = useState(0);

    useEffect(() => {
        if (food_list.length > 0) {
            const foodItem = food_list.find((food) => food.id === Number(id));
            if (foodItem) {
                setCurrentFood(foodItem);
                setLoading(false);
            } else {
                navigate("/not-found");
            }
        }
    }, [id, food_list, navigate]);

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

    const handleRating = (value) => setRating(value);

    if (loading || !currentFood) {
        return <div className="flex justify-center items-center h-screen text-green-600 text-xl">Loading...</div>;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center p-2">
            {/* Navigation Arrows */}
            <button
                className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all shadow-lg"
                onClick={handlePrevious}
                aria-label="Previous Food"
            >
                <ArrowUp size={28} />
            </button>
            <button
                className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-all shadow-lg"
                onClick={handleNext}
                aria-label="Next Food"
            >
                <ArrowDown size={28} />
            </button>

            {/* Food Card */}
            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 bg-white rounded-lg shadow-2xl overflow-hidden">
                <img
                    src={`${backendUrl}/images/${currentFood.image}`}
                    alt={currentFood.name}
                    className="w-full lg:w-[50%] h-[400px] object-cover"
                />

                {/* Food Details */}
                <div className="p-6 flex-1">
                    <h1 className="text-5xl font-extrabold text-green-600 mb-4">{currentFood.name}</h1>
                    <p className="text-gray-700 text-lg mb-4">{currentFood.description}</p>
                    <p className="text-2xl font-semibold text-green-700 mb-6">{currentFood.price} Birr</p>

                    {/* Add to Cart Controls */}
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => removeFromCart(currentFood.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                            -
                        </button>
                        <p className="text-2xl font-semibold">{cartItems[currentFood.id] || 0}</p>
                        <button
                            onClick={() => addToCart(currentFood.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
                        >
                            +
                        </button>
                    </div>

                    {/* Customizations */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2">Customizations:</label>
                        <textarea
                            value={customizations}
                            onChange={(e) => setCustomizations(e.target.value)}
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                            rows="3"
                            placeholder="E.g., No tomato, less salt..."
                        ></textarea>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2">Rate this Food:</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRating(star)}
                                    className={`p-2 rounded-full ${rating >= star ? "text-yellow-500" : "text-gray-400"
                                        }`}
                                >
                                    <Star size={24} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Food_Detail;
