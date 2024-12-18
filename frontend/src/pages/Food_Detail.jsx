import axios from "axios";
import { ArrowDown, ArrowUp, Heart, Minus, Plus, Star } from "lucide-react";
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

    const deleteCustomizations = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/food/remove-customization`, {
                foodId: currentFood.id,
            }, { headers: { token } });

            if (response.data.success) {
                setCustomizations(""); // Clear customization in the UI
                console.log(response.data.message);
            } else {
                console.error("Error deleting customization:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting customization:", error);
        }
    };

    if (loading || !currentFood) {
        return <div className="flex justify-center items-center h-screen text-green-600 text-xl">Loading...</div>;
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-gray-100 to-gray-300">

            {/* Navigation Arrows */}
            <button
                className="absolute -top-4 right-1/2 transform translate-x-1/2 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-105"
                onClick={handlePrevious}
                aria-label="Previous Food"
            >
                <ArrowUp size={28} />
            </button>

            <button
                className="absolute -bottom-4 right-1/2 transform translate-x-1/2 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-105"
                onClick={handleNext}
                aria-label="Next Food"
            >
                <ArrowDown size={28} />
            </button>

            {/* Food Card */}
            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center gap-10 bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all p-6">

                {/* Food Image */}
                <div className="relative w-full lg:w-[45%]">
                    <img
                        src={`${backendUrl}/images/${currentFood.image}`}
                        alt={currentFood.name}
                        className="w-full h-[400px] object-cover rounded-lg"
                    />
                    <button
                        onClick={toggleFavorite}
                        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md flex items-center gap-2 hover:scale-110 transition-transform"
                        aria-label="Add to Favorite"
                    >
                        <Heart
                            size={32}
                            className={`transition ${isFavorite ? "text-red-500" : "text-gray-400"}`}
                            fill={isFavorite ? "#ef4444" : "none"}
                        />
                        <span className="text-gray-700 font-semibold">Add to Favorite</span>
                    </button>
                </div>

                {/* Food Details */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-6">
                        <h1 className="text-5xl font-extrabold text-green-700 mb-2">{currentFood.name}</h1>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">{currentFood.description}</p>
                        <p className="text-3xl font-bold text-green-700 mb-6">{currentFood.price} Birr</p>
                    </div>

                    {/* Add to Cart Controls */}
                    <div className="mb-8">
                        <label className="block text-gray-800 font-semibold mb-2">Add/Remove from Cart:</label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => removeFromCart(currentFood.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                <Minus size={20} />
                            </button>
                            <p className="text-2xl font-semibold">{cartItems[currentFood.id] || 0}</p>
                            <button
                                onClick={() => addToCart(currentFood.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Customizations */}
                    <div className="mb-8">
                        <label className="block text-gray-800 font-semibold mb-2">Customizations:</label>
                        <textarea
                            value={customizations}
                            onChange={(e) => setCustomizations(e.target.value)}
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                            rows="3"
                            placeholder="E.g., No tomato, less salt..."
                        ></textarea>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={saveCustomizations}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                Save Customizations
                            </button>
                            <button
                                onClick={deleteCustomizations}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                Delete Customizations
                            </button>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-6">
                        <label className="block text-gray-800 font-semibold mb-2">Rate this Food:</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => saveRating(star)}
                                    className={`p-2 transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                >
                                    <Star
                                        size={32}
                                        fill={rating >= star ? "#facc15" : "none"}
                                    />
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
