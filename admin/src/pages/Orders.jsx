import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Orders = () => {

    const { token } = useContext(AdminContext);

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

    const fetchOrder = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } })
            if (response.data.success) {
                setOrders(response.data.orders);
                //console.log(response.data.orders);

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

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
                await fetchOrder(); //this must be this fetchAllOrders()
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
        fetchOrder();
    }, [token]);

    return (
        <div className="m-5 w-full">
            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-800 mb-5 text-center">
                Orders
            </h1>

            {/* Orders Container */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-5 max-w-6xl mx-auto max-h-[85vh] overflow-y-auto">
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-4 items-start border border-gray-300 rounded-lg p-5 md:p-6 my-4 bg-white hover:shadow-md transition-shadow"
                        >
                            {/* Order Icon */}
                            <img
                                className="w-16 h-16 object-cover"
                                src={assets.parcel_icon}
                                alt="Parcel Icon"
                            />

                            {/* Order Details */}
                            <div>
                                {/* Items */}
                                <div className="mb-3">
                                    {order.items.map((item, index) => (
                                        <p className="py-0.5 text-gray-700" key={index}>
                                            {item.name} x{" "}
                                            <span className="font-medium">{item.quantity}</span>
                                            {index < order.items.length - 1 && ","}
                                        </p>
                                    ))}
                                </div>

                                {/* Customer Name */}
                                <p className="mt-3 mb-2 font-semibold text-gray-900">
                                    {order.address.firstName + " " + order.address.lastName}
                                </p>

                                {/* Address */}
                                <div className="text-gray-600">
                                    <p>{order.address.street},</p>
                                    <p>
                                        {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                                    </p>
                                </div>

                                {/* Phone */}
                                <p className="mt-2 text-gray-800">{order.address.phone}</p>
                            </div>

                            {/* Payment Details */}
                            <div>
                                <p className="text-sm sm:text-base font-semibold text-gray-700">
                                    Items: <span>{order.items.length}</span>
                                </p>
                                <p className="mt-3 text-gray-600">
                                    Method: <span>{order.paymentMethod}</span>
                                </p>
                                <div className="flex items-center mt-2">
                                    <p className="mr-2">Payment:</p>
                                    <p
                                        className={`font-semibold ${order.payment ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        {order.payment ? "Done" : "Pending"}
                                    </p>
                                </div>
                                <p className="mt-3 text-gray-600">
                                    Date: {new Date(order.date).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Order Amount */}
                            <p className="text-lg sm:text-xl font-bold text-gray-800 text-right">
                                ${order.amount.toFixed(2)}
                            </p>

                            {/* Status Selector */}
                            <select
                                onChange={(event) => statusHandler(event, order.id)}
                                value={order.status}
                                className="p-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                <option value="Order Placed">Order Placed</option>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 font-medium py-10">
                        No orders available.
                    </p>
                )}
            </div>
        </div>
    );

};

export default Orders;