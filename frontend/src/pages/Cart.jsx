import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import CartTotal from '../components/CartTotal';
import LoginPopUp from '../components/LoginPopup';
import Title from '../components/Title';
import { StoreContext } from '../context/StoreContext';

const Cart = () => {
    const { cartItems, food_list, drink_list, removeFromCart, navigate, token } = useContext(StoreContext);
    const [showLogin, setShowLogin] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all', 'food', 'drink'

    const handleProceedToCheckout = () => {
        if (!token) {
            setShowLogin(true);
            toast.warn("Please log in to place an order.");
        } else if (Object.values(cartItems).every(count => count <= 0)) {
            toast.info("Your cart is empty. Add items to proceed.");
            navigate("/menu");
        } else {
            navigate('/orders');
        }
    };

    const filteredItems = () => {
        if (filter === 'food') {
            return food_list.filter(item => cartItems[`food-${item.id}`] > 0);
        } else if (filter === 'drink') {
            return drink_list.filter(item => cartItems[`drink-${item.drink_Id}`] > 0);
        } else {
            return [
                ...food_list.filter(item => cartItems[`food-${item.id}`] > 0),
                ...drink_list.filter(item => cartItems[`drink-${item.drink_Id}`] > 0)
            ];
        }
    };

    return (
        <div className="mt-[100px]">
            {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
            <div className="flex justify-between items-center">
                <Title text1="CART" text2="ITEMS" />

                {/* Dropdown for Category Selection */}
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-gray-200 text-black rounded px-4 py-2"
                >
                    <option value="all">All Items</option>
                    <option value="food">Foods Only</option>
                    <option value="drink">Drinks Only</option>
                </select>
            </div>

            {/* Cart Items */}
            <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center text-black font-semibold text-[max(1vw,12px)] mt-4">
                <p>Image</p>
                <p>Name</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr className="h-[1px] bg-gray-300 border-none my-2" />

            {/* Display Food Items */}
            {filter === 'all' || filter === 'food' ? (
                <div>
                    {food_list.filter(item => cartItems[`food-${item.id}`] > 0).map(item => {
                        const cartKey = `food-${item.id}`;
                        const count = cartItems[cartKey] || 0;

                        return (
                            <div key={cartKey} className="my-2">
                                <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center text-black">
                                    <img
                                        src={`${backendUrl}/images/${item.image}`}
                                        alt=""
                                        className="w-[60px]"
                                    />
                                    <p>{item.name}</p>
                                    <p>{item.price} Birr</p>
                                    <p className='ml-6'>{count}</p>
                                    <p>{item.price * count} Birr</p>
                                    <button
                                        onClick={() => removeFromCart(item.id, 'food')}
                                        className="cursor-pointer w-[30px] ml-3 h-[30px] flex items-center justify-center rounded-full bg-red-500 text-white"
                                    >
                                        X
                                    </button>
                                </div>
                                <hr className="h-[1px] bg-gray-300 border-none my-1" />
                            </div>
                        );
                    })}
                </div>
            ) : null}

            {/* Display Drink Items */}
            {filter === 'all' || filter === 'drink' ? (
                <div>
                    {/* Show "Drink Items" line only if displaying all items or if there are drink items */}
                    {filter === 'all' && drink_list.some(item => cartItems[`drink-${item.drink_Id}`] > 0) && (
                        <div className="flex items-center gap-2">
                            <hr className="flex-grow h-[1px] bg-gray-600" />
                            <p className="text-gray-500 font-medium">Drink Items</p>
                            <hr className="flex-grow h-[1px] bg-gray-600" />
                        </div>
                    )}

                    {drink_list.filter(item => cartItems[`drink-${item.drink_Id}`] > 0).map(item => {
                        const cartKey = `drink-${item.drink_Id}`;
                        const count = cartItems[cartKey] || 0;

                        return (
                            <div key={cartKey} className="my-2">
                                <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center text-black">
                                    <img
                                        src={`${backendUrl}/images/${item.drink_Image}`}
                                        alt=""
                                        className="w-[60px]"
                                    />
                                    <p>{item.drink_Name}</p>
                                    <p>{item.drink_Price} Birr</p>
                                    <p className='ml-6'>{count}</p>
                                    <p>{item.drink_Price * count} Birr</p>
                                    <button
                                        onClick={() => removeFromCart(item.drink_Id, 'drink')}
                                        className="cursor-pointer w-[30px] h-[30px] ml-3 flex items-center justify-center rounded-full bg-red-500 text-white"
                                    >
                                        X
                                    </button>
                                </div>
                                <hr className="h-[1px] bg-gray-300 border-none my-1" />
                            </div>
                        );
                    })}
                </div>
            ) : null}

            <div className="mt-[80px] flex justify-between gap-[max(12vw,20px)] flex-col lg:flex-row">
                <div className="flex-1">
                    <CartTotal />
                    <button
                        className="bg-primary text-white px-16 py-3 mt-4 text-sm border rounded hover:bg-black transition-all"
                        onClick={handleProceedToCheckout}
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
                <div className="flex-1">
                    <p className="text-gray-600">If you have a promo code, enter it here:</p>
                    <div className="mt-2 flex bg-gray-200 rounded items-center">
                        <input type="text" placeholder="Promo Code" className="bg-transparent px-2 flex-grow outline-none" />
                        <button className="bg-black text-white px-4 py-2 rounded">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
