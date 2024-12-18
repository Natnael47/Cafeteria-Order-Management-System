import { Star } from "lucide-react"; // Importing Lucide icon for stars
import React, { useContext } from "react";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { StoreContext } from "../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, rating }) => {
    const { cartItems, addToCart, removeFromCart, navigate } = useContext(StoreContext);

    // Function to generate star elements for the rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating); // Number of full stars
        const halfStar = rating % 1 !== 0; // Check if there's a half star
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Remaining stars to fill up to 5

        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={`full-${i}`} className="text-yellow-500 w-6 h-6" fill="currentColor" />
            );
        }
        if (halfStar) {
            stars.push(
                <Star
                    key="half"
                    className="text-yellow-500 w-6 h-6"
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
            stars.push(
                <Star key={`empty-${i}`} className="text-gray-300 w-6 h-6" />
            );
        }

        return stars;
    };

    return (
        <div className="w-full mx-auto border-2 border-[#39db4a] rounded-[15px] shadow-[0_0_10px_rgba(0,0,0,0.09)] transition duration-300 animate-fadeIn bg-[#d7f6da]">
            <div className="relative">
                <img
                    className="w-full rounded-t-[15px]"
                    src={`${backendUrl || ""}/images/${image || ""}`}
                    alt={name}
                />
                {!cartItems?.[id] ? (
                    <img
                        className="w-[35px] absolute bottom-[15px] right-[15px] cursor-pointer rounded-full"
                        onClick={() => addToCart(id)}
                        src={assets?.add_icon_white || ""}
                        alt="Add to cart"
                    />
                ) : (
                    <div className="absolute bottom-[15px] right-[15px] flex items-center gap-[10px] p-[6px] rounded-full bg-white">
                        <img
                            className="w-[30px] cursor-pointer"
                            onClick={() => removeFromCart(id)}
                            src={assets?.remove_icon_red || ""}
                            alt="Remove from cart"
                        />
                        <p>{cartItems[id]}</p>
                        <img
                            className="w-[30px] cursor-pointer"
                            onClick={() => addToCart(id)}
                            src={assets?.add_icon_green || ""}
                            alt="Add more"
                        />
                    </div>
                )}
            </div>
            <div
                onClick={() => navigate(`/food-detail/${id}`)}
                className="p-[20px] hover:bg-blue-100 cursor-pointer"
            >
                <div className="flex justify-between items-center mb-[10px] text-[#215727]">
                    <p className="text-[20px] font-medium">{name}</p>
                    <div className="flex items-center gap-1">
                        {renderStars(rating)}
                        <span className="text-black font-medium text-sm ml-1">{rating.toFixed(1)}</span>
                    </div>
                </div>
                <p className="text-black text-[14px]">{description}</p>
                <p className="text-black text-[22px] font-medium my-[10px]">{price} Birr</p>
            </div>
        </div>
    );
};

export default FoodItem;
