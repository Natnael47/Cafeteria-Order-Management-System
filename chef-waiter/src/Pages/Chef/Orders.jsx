import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { assets } from '../../../../admin/src/assets/assets';
import { backendUrl } from '../../App';

const ChefOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/order/chef-orders');
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    console.error('Failed to fetch orders: response success was false');
                }
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            }
        };

        fetchOrders();
    }, []);

    const acceptOrder = async (orderId) => {
        try {
            const response = await axios.post(backendUrl + '/api/order/accept', { orderId });
            if (response.data.success) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order.id === orderId ? { ...order, status: 'preparing' } : order
                    )
                );
            } else {
                console.error('Failed to accept order: response success was false');
            }
        } catch (error) {
            console.error('Error accepting order:', error.message);
        }
    };

    return (
        <div className='m-5 w-full'>
            <p className="text-lg font-semibold">NEW ORDER</p>

            <div className='bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll'>
                <div className='bg-[#F3F4F6]'>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div
                                className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] gap-3 items-start border-2 border-black p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-black bg-white'
                                key={order.id}
                            >
                                <img className='w-16' src={assets.chef_icon} alt="Chef Icon" />
                                <div>
                                    <div>
                                        {order.items.map((item, index) => (
                                            <p className='py-0.5' key={index}>
                                                {item.name} X <span>{item.quantity}</span>
                                            </p>
                                        ))}
                                    </div>
                                    <p className='mt-3 mb-2 font-medium'>
                                        {order.address.firstName + ' ' + order.address.lastName}
                                    </p>
                                    <div>
                                        <p>{order.address.street + ','}</p>
                                        <p>
                                            {order.address.city + ', ' + order.address.state + ', ' + order.address.country + ', ' + order.address.zipcode}
                                        </p>
                                    </div>
                                    <p>{order.address.phone}</p>
                                </div>
                                <div>
                                    <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                                    <p className='mt-3'>Method: {order.paymentMethod}</p>
                                    <div className='flex flex-row'>
                                        <p>Payment: </p>
                                        <p className={order.payment ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>
                                            {order.payment ? 'Done' : 'Pending'}
                                        </p>
                                    </div>
                                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className='flex items-center'>
                                    <button
                                        type="button"
                                        onClick={() => acceptOrder(order.id)}
                                        disabled={order.status === 'preparing'}
                                        className={`p-2 text-white font-semibold ${order.status === 'preparing' ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'}`}
                                    >
                                        {order.status === 'preparing' ? 'Preparing' : 'Accept Order'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No orders to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChefOrders;
