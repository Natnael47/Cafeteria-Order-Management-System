import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../../App';
import { assets } from '../../assets/assets';
import "./Orders.css";

const Orders = ({ token }) => {

    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const response = await axios.get(backendUrl + "/api/order/list", { headers: { token } });
        if (response.data.success) {
            setOrders(response.data.data);
            console.log(response.data.data);
        } else {
            toast.error("Error");
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            // Send a request to update the order status
            const response = await axios.post(backendUrl + "/api/order/status", {
                orderId,
                status: event.target.value, // Send the selected status value
            }, { headers: { token } });

            // Check if the response indicates success
            if (response.data.success) {
                // Refresh the list of orders after updating the status
                await fetchAllOrders();
            } else {
                // Handle the error if the update was not successful
                console.error("Failed to update status:", response.data.message);
                toast.error("Failed to update status.");
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error("Error updating status:", error);
            toast.error("An error occurred while updating the status.");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            <div className="order-list">
                {orders.map((order, index) => {
                    return (  // Add the return statement here
                        <div key={index} className="order-item">
                            <img src={assets.parcel_icon} alt="" />
                            <div>
                                <p className='order-item-food'>
                                    {order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return item.name + " x " + item.quantity;
                                        } else {
                                            return item.name + " x " + item.quantity + ", ";
                                        }
                                    })}
                                </p>
                                <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                                <div className="order-item-address">
                                    <p>{order.address.street + ", "}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                </div>
                                <p className="order-item-phone">Phone :{order.address.phone}</p>
                            </div>
                            <p>Items: {order.items.length}</p>
                            <p>${order.amount}</p>
                            <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Orders;