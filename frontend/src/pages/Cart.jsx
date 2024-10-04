import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { StoreContext } from '../context/StoreContext';

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount } = useContext(StoreContext);

    const navigate = useNavigate();

    return (
        <div className='mt-[100px]'>
            <div>
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
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id}>
                                <div className='grid grid-cols-[1fr_1.5fr_1.1fr_0.9fr_1fr_0.5fr] items-center text-black my-2'>
                                    <img src={backendUrl + "/images/" + item.image} alt='' className='w-[60px]' />
                                    <p>{item.name}</p>
                                    <p>${item.price}</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>${item.price * cartItems[item._id]}</p>
                                    <p onClick={() => removeFromCart(item._id)} className='text-black cursor-pointer pl-2 w-[30px] h-[30px] flex items-center ml-2'>X</p>
                                </div>
                                <hr className='h-[1px] bg-gray-300 border-none' />
                            </div>
                        );
                    }
                })}
            </div>
            <div className="mt-[80px] flex justify-between gap-[max(12vw,20px)] flex-col lg:flex-row">
                <div className="flex-1 flex flex-col gap-5">
                    <h2 className="text-2xl">Cart totals</h2>
                    <div>
                        <div className="flex justify-between text-gray-600">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr className='my-2' />
                        <div className="flex justify-between text-gray-600">
                            <p>Delivery Fee</p>
                            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr className='my-2' />
                        <div className="flex justify-between font-bold">
                            <b>Total</b>
                            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>

                    <div className='w-full'>
                        <button className='bg-primary text-white px-16 py-3 text-sm border rounded hover:bg-black hover:text-white transition-all' onClick={() => navigate('/orders')}>PROCEED TO CHECKOUT</button>
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
