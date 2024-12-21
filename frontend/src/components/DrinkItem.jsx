import { Minus, Plus, Star } from "lucide-react"; // Importing Lucide icons
import React, { useContext } from "react";
import { backendUrl } from "../App";
import { StoreContext } from "../context/StoreContext";

const DrinkItem = ({ id, name, price, description, image, rating }) => {
    const { cartItems, addToCart, removeFromCart, navigate } = useContext(StoreContext);

    // Generate star elements for the rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`full-${i}`} className="text-yellow-400 w-4 h-4" fill="currentColor" />
            );
        }
        if (halfStar) {
            stars.push(
                <Star
                    key="half"
                    className="text-yellow-400 w-4 h-4"
                    fill="url(#half-star-gradient)"
                >
                    <defs>
                        <linearGradient id="half-star-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" style={{ stopColor: "currentColor", stopOpacity: 1 }} />
                            <stop offset="50%" style={{ stopColor: "transparent", stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </Star>
            );
        }
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="text-gray-300 w-4 h-4" />);
        }

        return stars;
    };

    // Construct the cart item key using 'drink' as type and the ID of the item
    const cartItemKey = `drink-${id}`;
    const cartItemCount = cartItems[cartItemKey] || 0;  // Default to 0 if not found

    return (
        <div className="w-full mx-auto border rounded-lg shadow-lg transition duration-300 hover:shadow-xl bg-white overflow-hidden">
            <div className="relative group">
                <img
                    className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
                    src={`${backendUrl || ""}/images/${image || ""}`}
                    alt={name}
                />
                {/* Add to cart button or quantity controls */}
                {cartItemCount === 0 ? (
                    <div
                        className="absolute bottom-4 right-4 flex items-center justify-center rounded-full bg-green-500 w-9 h-9 cursor-pointer hover:bg-green-600 shadow-md transition"
                        onClick={() => addToCart(id, 'drink')} // Pass true for drinks
                    >
                        <Plus className="text-white w-5 h-5" />
                    </div>
                ) : (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 p-2 rounded-full bg-white shadow-md">
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 cursor-pointer hover:bg-red-200 transition"
                            onClick={() => removeFromCart(id, 'drink')} // Pass true for drinks
                        >
                            <Minus className="text-red-700 w-4 h-4" />
                        </div>
                        <p className="text-base font-medium">{cartItemCount}</p>
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 cursor-pointer hover:bg-green-200 transition"
                            onClick={() => addToCart(id, 'drink')} // Pass true for drinks
                        >
                            <Plus className="text-green-700 w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>

            {/* Drink Details */}
            <div
                onClick={() => navigate(`/food-detail/${id}`)}
                className="p-4 hover:bg-gray-100 cursor-pointer"
            >
                <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold text-gray-800">{name}</p>
                    <div className="flex items-center gap-1">
                        {renderStars(rating)}
                    </div>
                </div>
                <p className="text-sm text-gray-600">{description}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">{price} Birr</p>
            </div>
        </div>
    );
};

export default DrinkItem;
