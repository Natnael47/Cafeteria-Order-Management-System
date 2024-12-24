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

    // Construct the cart item key using 'food' as type and the ID of the item
    const cartItemKey = `food-${id}`;
    const cartItemCount = cartItems[cartItemKey] || 0;  // Default to 0 if not found

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
                        console.log(response.data.data);

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
        return <div className="flex justify-center items-center text-green-600 text-xl">Loading...</div>;
    }

    return (
        <div className="relative min-h-[80vh] flex flex-col items-center p-6 ">
            {/* Navigation Arrows */}
            <button
                className="absolute -top-4 mt-5 right-1/2 transform translate-x-1/2 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-105"
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
            <div className="w-full mt-[35px] max-w-7xl flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all p-6 max-h-[80vh] gap-6">
                {/* Left Section */}
                <div className="flex flex-col items-start w-full lg:w-[45%] gap-6">
                    {/* Food Name and Rating */}
                    <div className="flex justify-between w-full items-center">
                        <h1 className="text-3xl lg:text-5xl font-extrabold text-green-700">
                            {currentFood.name}
                        </h1>
                        <div className="flex flex-col items-end">
                            <label className="text-sm font-semibold text-gray-500">Rating:</label>
                            <p className="text-lg lg:text-xl font-medium text-gray-600">
                                {Number(currentFood.rating).toFixed(1)}/5
                            </p>
                        </div>
                    </div>

                    {/* Food Image */}
                    <div className="relative w-full">
                        <img
                            src={`${backendUrl}/images/${currentFood.image}`}
                            alt={currentFood.name}
                            className="w-full h-[300px] object-cover rounded-lg shadow-md"
                        />
                        <button
                            onClick={toggleFavorite}
                            className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md flex items-center gap-2 hover:scale-110 transition-transform"
                            aria-label="Add to Favorite"
                        >
                            <Heart
                                size={32}
                                className={`transition ${isFavorite ? "text-red-500" : "text-gray-400"
                                    }`}
                                fill={isFavorite ? "#ef4444" : "none"}
                            />
                            <span className="text-gray-700 font-semibold">Favorite</span>
                        </button>
                    </div>

                    {/* Star Ratings */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-500">Your Rating:</label>
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

                {/* Right Section */}
                <div className="flex flex-col w-full lg:w-[55%] gap-6">
                    {/* Food Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-800 font-semibold">Description:</label>
                        <div className="p-3 border rounded-lg bg-gray-100 shadow-inner h-[6rem]">
                            <p className="text-gray-600 text-sm lg:text-base line-clamp-4 overflow-hidden">
                                {currentFood.description}
                            </p>
                        </div>
                    </div>


                    {/* Price and Add/Remove from Cart */}
                    <div className="flex justify-between items-center gap-4">
                        <p className="text-3xl font-bold text-green-700">
                            {currentFood.price} Birr
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => removeFromCart(currentFood.id, "food")}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                <Minus size={20} />
                            </button>
                            <p className="text-xl font-semibold">{cartItemCount || 0}</p>
                            <button
                                onClick={() => addToCart(currentFood.id, "food")}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Customizations */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-800 font-semibold">Customizations:</label>
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
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                Save
                            </button>
                            <button
                                onClick={deleteCustomizations}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Food_Detail;
