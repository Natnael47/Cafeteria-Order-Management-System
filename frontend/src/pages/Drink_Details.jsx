import axios from "axios";
import { ArrowDown, ArrowUp, Heart, Minus, Plus, Star } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const Drink_Details = () => {
    const { drink_list, addToCart, removeFromCart, cartItems, token } = useContext(StoreContext);
    const { id } = useParams(); // Get drink id from URL
    const navigate = useNavigate();

    const [currentFood, setCurrentFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [customizations, setCustomizations] = useState("");
    const [rating, setRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    // Construct the cart item key using 'drink' as type and the ID of the item
    const cartItemKey = `drink-${id}`;
    const cartItemCount = cartItems[cartItemKey] || 0;  // Default to 0 if not found

    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                if (drink_list.length > 0) {
                    const foodItem = drink_list.find((drink) => drink.drink_Id === Number(id));
                    if (foodItem) {
                        setCurrentFood(foodItem);

                        // Fetch customizations, ratings, and favorite status
                        const response = await axios.get(`${backendUrl}/api/user/get-drink-details`, {
                            headers: { token },
                        });
                        //console.log(response.data.data);
                        if (response.data.success) {
                            const { customizations, ratings, favorites } = response.data.data;

                            // Apply customization (customNote) for this drink
                            const foodCustomization = customizations.find((c) => c.drinkId === Number(id));
                            setCustomizations(foodCustomization ? foodCustomization.customNote : "");

                            // Apply rating for this drink
                            const foodRating = ratings.find((r) => r.drinkId === Number(id));
                            setRating(foodRating ? foodRating.userRating : 0);

                            // Apply favorite status for this drink
                            const favoriteFood = favorites.find((f) => f.drinkId === Number(id));
                            setIsFavorite(!!favoriteFood);
                        }
                    } else {
                        navigate("/not-found");
                    }
                }
            } catch (error) {
                console.error("Error fetching drink details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFoodDetails();
    }, [id, drink_list, navigate, token]);

    const handleNext = () => {
        const currentIndex = drink_list.findIndex((drink) => drink.drink_Id === Number(id));
        const nextIndex = (currentIndex + 1) % drink_list.length;
        navigate(`/drink-detail/${drink_list[nextIndex].drink_Id}`);
    };

    const handlePrevious = () => {
        const currentIndex = drink_list.findIndex((drink) => drink.drink_Id === Number(id));
        const prevIndex = (currentIndex - 1 + drink_list.length) % drink_list.length;
        navigate(`/drink-detail/${drink_list[prevIndex].drink_Id}`);
    };

    const toggleFavorite = async () => {
        try {
            if (isFavorite) {
                await axios.post(`${backendUrl}/api/drink/remove-favorite`, {
                    drinkId: currentFood.drink_Id,
                    userId: token.userId,
                }, { headers: { token } });
            } else {
                await axios.post(`${backendUrl}/api/drink/add-favorite`, {
                    drinkId: currentFood.drink_Id,
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
                `${backendUrl}/api/drink/rate-drink`,
                {
                    drinkId: currentFood.drink_Id,
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
                `${backendUrl}/api/drink/save-customization`,
                {
                    drinkId: currentFood.drink_Id,
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
            const response = await axios.post(`${backendUrl}/api/drink/remove-customization`, {
                drinkId: currentFood.drink_Id,
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
        <div className="relative min-h-[80vh] flex flex-col items-center p-6 bg-gradient-to-br from-gray-100 to-gray-300">
            {/* Navigation Arrows */}
            <button
                className="absolute -top-4 mt-5 right-1/2 transform translate-x-1/2 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-105"
                onClick={handlePrevious}
                aria-label="Previous Drink"
            >
                <ArrowUp size={28} />
            </button>

            <button
                className="absolute -bottom-4 mt-5 right-1/2 transform translate-x-1/2 bg-green-500 text-white p-4 rounded-full hover:bg-green-600 transition-all shadow-lg hover:scale-105"
                onClick={handleNext}
                aria-label="Next Drink"
            >
                <ArrowDown size={28} />
            </button>

            {/* Drink Card */}
            <div className="w-full mt-[35px] mb-[35px] max-w-7xl flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all p-6 max-h-[80vh] gap-6">
                {/* Left Section */}
                <div className="flex flex-col items-start w-full lg:w-[45%] gap-6">
                    {/* Drink Name and Rating */}
                    <div className="flex justify-between w-full items-center">
                        <h1 className="text-3xl lg:text-5xl font-extrabold text-green-700">
                            {currentFood.drink_Name}
                        </h1>
                        <div className="flex flex-col items-end">
                            <label className="text-sm font-semibold text-gray-500">Rating:</label>
                            <p className="text-lg lg:text-xl font-medium text-gray-600">
                                {Number(currentFood.average_Rating).toFixed(1)}/5
                            </p>
                        </div>
                    </div>

                    {/* Drink Image */}
                    <div className="relative w-full">
                        <img
                            src={`${backendUrl}/images/${currentFood.drink_Image}`}
                            alt={currentFood.drink_Name}
                            className="w-full h-[300px] object-cover rounded-lg shadow-md"
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
                                className={`p-2 transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                            >
                                <Star size={32} fill={rating >= star ? "#facc15" : "none"} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col w-full lg:w-[55%] gap-6">
                    {/* Drink Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-800 font-semibold">Description:</label>
                        <div className="p-3 border rounded-lg bg-gray-100 shadow-inner h-[6rem]">
                            <p className="text-gray-600 text-sm lg:text-base line-clamp-4 overflow-hidden">
                                {currentFood.drink_Description}
                            </p>
                        </div>
                    </div>

                    {/* Price and Add/Remove from Cart */}
                    <div className="flex justify-between items-center gap-4">
                        <p className="text-3xl font-bold text-green-700">
                            {currentFood.drink_Price} Birr
                        </p>
                        <div className="flex flex-col items-center gap-2">
                            <label className="text-sm font-semibold text-gray-800">Add/Remove from Cart:</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => removeFromCart(currentFood.drink_Id, "drink")}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-md"
                                >
                                    <Minus size={20} />
                                </button>
                                <p className="text-xl font-semibold min-w-[2rem] text-center">
                                    {cartItemCount || 0}
                                </p>
                                <button
                                    onClick={() => addToCart(currentFood.drink_Id, "drink")}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-transform hover:scale-105 shadow-md"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
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
                            placeholder="E.g., Less ice, extra sugar..."
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
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Drink_Details