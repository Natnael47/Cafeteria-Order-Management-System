import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import Title from './Title';

const CartTotal = () => {

    const { getTotalCartAmount } = useContext(StoreContext);

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'CART'} text2={'TOTALS'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                {/* SubTotal */}
                <div className="flex justify-between text-gray-600">
                    <p className='text-[16px]'>Subtotal</p>
                    <p className='text-[16px]'>${getTotalCartAmount()}</p>
                </div>
                <hr className='my-2' />

                {/* Delivery Fee */}
                <div className="flex justify-between text-gray-600">
                    <p className='text-[16px]'>Delivery Fee</p>
                    <p className='text-[16px]'>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                </div>
                <hr className='my-2' />

                {/* Total */}
                <div className="flex justify-between font-bold">
                    <b className='text-[16px]'>Total</b>
                    <b className='text-[16px]'>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
