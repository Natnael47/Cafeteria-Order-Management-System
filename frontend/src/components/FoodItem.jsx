import React, { useContext } from 'react';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { StoreContext } from '../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    return (
        <div className="w-full mx-auto border-2 border-[#39db4a] rounded-[15px] shadow-[0_0_10px_rgba(0,0,0,0.09)] transition duration-300 animate-fadeIn bg-[#d7f6da]">
            <div className="relative">
                <img className="w-full rounded-t-[15px]" src={backendUrl + "/images/" + image} alt={name} />
                {!cartItems[id] ? (
                    <img
                        className="w-[35px] absolute bottom-[15px] right-[15px] cursor-pointer rounded-full"
                        onClick={() => addToCart(id)}
                        src={assets.add_icon_white}
                        alt="Add to cart"
                    />
                ) : (
                    <div className="absolute bottom-[15px] right-[15px] flex items-center gap-[10px] p-[6px] rounded-full bg-white">
                        <img
                            className="w-[30px] cursor-pointer"
                            onClick={() => removeFromCart(id)}
                            src={assets.remove_icon_red}
                            alt="Remove from cart"
                        />
                        <p>{cartItems[id]}</p>
                        <img
                            className="w-[30px] cursor-pointer"
                            onClick={() => addToCart(id)}
                            src={assets.add_icon_green}
                            alt="Add more"
                        />
                    </div>
                )}
            </div>
            <div className="p-[20px]">
                <div className="flex justify-between items-center mb-[10px] text-[#215727]">
                    <p className="text-[20px] font-medium">{name}</p>
                    <img className="w-[70px]" src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="text-black text-[14px]">{description}</p>
                <p className="text-[#36ce46] text-[22px] font-medium my-[10px]">${price}</p>
                <p className="flex">Cook : 20min</p>
            </div>
        </div>
    );
}

export default FoodItem;
