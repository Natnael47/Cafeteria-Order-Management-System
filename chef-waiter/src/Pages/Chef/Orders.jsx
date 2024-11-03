import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { assets } from '../../../../admin/src/assets/assets';
import { backendUrl } from '../../App';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/order/chef-orders');
                if (response.data.success) {
                    setOrders(response.data.orders);
                    //console.log("Fetched Orders:", response.data.orders);
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
        <form>
            <p>Orders</p>
            <div>
                <div>
                    <label htmlFor=''>
                        <img src={assets.chef_icon} alt="Chef Icon" />
                    </label>
                </div>
            </div>
            <div>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                            <h4>Order ID: {order.id}</h4>
                            <p>Item Name(s): {order.items.map(item => item.name).join(', ')}</p>
                            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                            <p>Quantity: {order.items.map(item => item.quantity).join(', ')}</p>
                            <p>Status: {order.status}</p>
                            <button
                                type="button"
                                onClick={() => acceptOrder(order.id)}
                                disabled={order.status === 'preparing'}
                            >
                                {order.status === 'preparing' ? 'Preparing' : 'Accept Order'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No orders to display.</p>
                )}
            </div>
        </form>
    );
};

export default Orders;
