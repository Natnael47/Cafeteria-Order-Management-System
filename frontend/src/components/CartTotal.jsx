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
                <div className='flex justify-between'>
                    <p>SubTotal</p>
                    <p>${getTotalCartAmount()}.00</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Logistics Fee</p>
                    <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p className='font-bold'>Total</p>
                    <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal