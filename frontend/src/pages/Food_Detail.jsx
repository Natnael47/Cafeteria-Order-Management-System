import axios from "axios";
import { ArrowDown, ArrowUp, Heart, Star } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const Food_Detail = () => {
    const { food_list, addToCart, removeFromCart, cartItems, token } = useContext(StoreContext);
    const { id } = useParams(); // Get food id from URL
    const navigate = useNavigate();

    const [currentFood, setCurrentFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customizations, setCustomizations] = useState("");
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                if (food_list.length > 0) {
                    const foodItem = food_list.find((food) => food.id === Number(id));
                    if (foodItem) {
                        setCurrentFood(foodItem);

                        // Fetch customizations, ratings, and favorite status
                        const response = await axios.get(`${backendUrl}/api/user/get-favorite`, {
                            headers: { token },
                        });

                        if (response.data.success) {
                            const { customizations, ratings, favorites } = response.data.data;

                            // Apply customization (customNote) for this food
                            const foodCustomization = customizations.find((c) => c.foodId === Number(id));
                            setCustomizations(foodCustomization ? foodCustomization.customNote : "");

                            // Apply rating for this food
                            const foodRating = ratings.find((r) => r.foodId === Number(id));
                            setRating(foodRating ? foodRating.userRating : 0);

                            // Apply favorite status for this food
                            const favoriteFood = favorites.find((f) => f.foodId === Number(id));
                            setIsFavorite(!!favoriteFood);
                        }
                    } else {
                        navigate("/not-found");
                    }
                }
            } catch (error) {
                console.error("Error fetching food details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [id, food_list, navigate, token]);

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

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await axios.post(`${backendUrl}/api/food/remove-favorite`, {
                    foodId: currentFood.id,
                    userId: token.userId,
                }, { headers: { token } });
            } else {
                await axios.post(`${backendUrl}/api/food/add-favorite`, {
                    foodId: currentFood.id,
                    userId: token.userId,
                }, { headers: { token } });
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Error toggling favorite status:", error);
        }
    };

    const saveRating = async (value) => {
        try {
            setRating(value); // Update rating locally
            const response = await axios.post(
                `${backendUrl}/api/food/rate-food`,
                {
                    foodId: currentFood.id,
                    userId: token.userId,
                    rating: value,
                }, { headers: { token } }
            );
            if (!response.data.success) {
                console.error("Error saving rating:", response.data.message);
            }
        } catch (error) {
            console.error("Error saving rating:", error);
        }
    };

    const saveCustomizations = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/food/save-customization`,
                {
                    foodId: currentFood.id,
                    userId: token.userId,
                    customNote: customizations,
                }, { headers: { token } }
            );
            if (!response.data.success) {
                console.error("Error saving customization:", response.data.message);
            }
        } catch (error) {
            console.error("Error saving customization:", error);
        }
    };

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
                    <div className="flex justify-between items-center">
                        <h1 className="text-5xl font-extrabold text-green-600 mb-4">{currentFood.name}</h1>
                        <button onClick={toggleFavorite}>
                            <Heart
                                size={32}
                                className={`transition ${isFavorite ? "text-red-500" : "text-gray-400"}`}
                            />
                        </button>
                    </div>
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
                        <button
                            onClick={saveCustomizations}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                        >
                            Save Customizations
                        </button>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2">Rate this Food:</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => saveRating(star)}
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
