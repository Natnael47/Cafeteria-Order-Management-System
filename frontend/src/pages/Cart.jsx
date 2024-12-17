import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import CartTotal from '../components/CartTotal';
import LoginPopUp from '../components/LoginPopup';
import Title from '../components/Title';
import { StoreContext } from '../context/StoreContext';

const Cart = () => {
    const { cartItems, food_list, removeFromCart, navigate, token } = useContext(StoreContext);
    const [showLogin, setShowLogin] = useState(false);

    const handleProceedToCheckout = () => {
        // Check if user is logged in
        if (!token) {
            setShowLogin(true); // Show login popup
            toast.warn("Please log in to place an order.");
        }
        // Check if cart is empty
        else if (Object.values(cartItems).every(count => count <= 0)) {
            toast.info("Your cart is empty. Add items to proceed.");
            navigate("/menu");
        }
        // All conditions satisfied, navigate to orders page
        else {
            navigate('/orders');
        }
    };

    return (
        <div className='mt-[100px]'>
            {/* Show login popup */}
            {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}

            <div>
                <div className='text-2xl'>
                    <Title text1={'CART'} text2={'ITEMS'} />
                </div>
                <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center text-black font-semibold text-[max(1vw,12px)]">
                    <p>Foods</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr className='h-[1px] bg-gray-300 border-none' />
                {food_list.map((item) => {
                    if (cartItems[item.id] > 0) {
                        return (
                            <div key={item.id}>
                                <div className='grid grid-cols-[1fr_1.5fr_1.1fr_0.9fr_1fr_0.5fr] items-center text-black my-2'>
                                    <img src={backendUrl + "/images/" + item.image} alt='' className='w-[60px]' />
                                    <p>{item.name}</p>
                                    <p>${item.price}</p>
                                    <p>{cartItems[item.id]}</p>
                                    <p>${item.price * cartItems[item.id]}</p>
                                    <p onClick={() => removeFromCart(item.id)} className='text-black cursor-pointer pl-2 w-[30px] h-[30px] flex items-center ml-2'>X</p>
                                </div>
                                <hr className='h-[1px] bg-gray-300 border-none' />
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="mt-[80px] flex justify-between gap-[max(12vw,20px)] flex-col lg:flex-row">
                <div className="flex-1 flex flex-col gap-5">
                    <div className='min-w-80'>
                        <CartTotal />
                    </div>

                    <div className='w-full mt-2'>
                        <button
                            className='bg-primary text-white px-16 py-3 text-sm border rounded hover:bg-black hover:text-white transition-all'
                            onClick={handleProceedToCheckout}
                        >
                            PROCEED TO CHECKOUT
                        </button>
                    </div>

                </div>
                <div className="flex-1">
                    <div>
                        <p className="text-gray-600">If you have a promo code, enter it here</p>
                        <div className='mt-2 flex justify-between items-center bg-gray-200 rounded'>
                            <input type="text" placeholder='promo code' className='bg-transparent border-none outline-none pl-2' />
                            <button className='w-[max(10vw,150px)] py-3 px-2 bg-black text-white rounded'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
