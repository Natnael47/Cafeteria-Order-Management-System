import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { StoreContext } from '../context/StoreContext';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const { url, token } = useContext(StoreContext);

    const loadOrderData = async () => {
        try {
            if (!token) return;

            const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            loadOrderData();
        }
    }, [token]);

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>

            <div>
                {orders.map((order, index) => (
                    <div key={index} className="py-4 border-t border-b border-gray-600 text-black flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-green-50">
                        <div className='flex items-start gap-5 text-sm'>
                            <img className='w-10 sm:w-16' src={assets.delivery_man_icon} alt='Parcel Icon' />
                            <div>
                                <div className='sm:text-base font-medium'>
                                    {order.items.map((item, index) => (
                                        <div className='py-0.5' key={index}>
                                            {item.name} _ <span className='font-semibold'>{item.quantity}</span>
                                            {index < order.items.length - 1 && <span>,</span>}
                                        </div>
                                    ))}
                                </div>
                                <p className='mt-1'>Date: <span className='text-gray-800'>{new Date(order.date).toDateString()}</span></p>
                                <p className='mt-1'>Payment: <span className='text-gray-800'>{order.paymentMethod}</span></p>
                            </div>
                        </div>

                        <div className='md:w-[60%] flex justify-between'>
                            <div className='flex items-center'>
                                <p className='text-lg font-bold'>${order.amount}.00</p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <p className='min-w-2 h-2 rounded-full bg-green-600'></p>
                                <p><b>{order.status}</b></p>
                            </div>

                            <div className='flex flex-col'>
                                <button onClick={loadOrderData} className='border border-primary px-4 py-2 text-sm font-semibold rounded-sm hover:bg-green-200'>Track Order</button>
                                {order.status === 'Order Placed' && (
                                    <button onClick={loadOrderData} className='border border-red-500 px-4 py-2 text-sm font-semibold rounded-sm mt-3 hover:bg-red-200'>Cancel Order</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
