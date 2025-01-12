import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";

const Orders = () => {
    const { token } = useContext(AdminContext);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        if (!token) return;

        try {
            const response = await axios.post(
                backendUrl + "/api/order/list",
                {},
                { headers: { token } }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
                // console.log(response.data.orders);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch orders. Please try again.");
        }
    };

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(
                backendUrl + "/api/order/status",
                {
                    orderId,
                    status: event.target.value,
                },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Order status updated.");
                fetchOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to update order status. Please try again.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    function formatDate(dateString) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(dateString);
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear().toString().slice(-2);
        return `${month}/${day}/${year}`;
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    return (
        <div className="m-5 w-full max-w-6.5xl max-h-[90vh]">
            {/* Title */}
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-800">Drink Items</h1>
                <div className="flex items-center space-x-4">
                    {/* Icon Button */}
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Orders Container */}
            <div className="rounded-lg max-w-6xl max-h-[85vh] overflow-y-auto">
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
                                    {Array.isArray(order.items) &&
                                        order.items.map((item, idx) => (
                                            <p className="py-0.5 text-lg font-semibold text-gray-700" key={idx}>
                                                {item.name} x <span className="font-medium">{item.quantity}</span>
                                                {idx < order.items.length - 1 && ","}
                                            </p>
                                        ))}
                                </div>

                                {/* Customer Info */}
                                <div className="mb-3">
                                    <p className="font-semibold text-gray-900">
                                        {order.address?.firstName} {order.address?.lastName}
                                    </p>
                                    <p className="text-gray-800">{order.address?.phone}</p>
                                </div>

                                {/* Service Type Details */}
                                <div className="mb-3">
                                    <p className="text-gray-800">Service Type: {order.serviceType}</p>
                                    {order.serviceType === "Dine-In" ? (
                                        <p className="text-gray-800">
                                            Dine-In Time: {formatTime(order.dineInTime)}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-gray-800">Address Line 1: {order.address?.line1}</p>
                                            <p className="text-gray-800">Address Line 2: {order.address?.line2}</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div>
                                <p className="text-sm sm:text-base font-semibold text-gray-700">
                                    Items: <span>{order.items?.length || 0}</span>
                                </p>
                                <div className="flex items-center mt-2">
                                    <p className="mr-2">Payment:</p>
                                    <p
                                        className={`font-semibold ${order.isPaid ? "text-green-500" : "text-red-500"}`}
                                    >
                                        {order.isPaid ? "Done" : "Pending"}
                                    </p>
                                </div>
                                <p className="mt-3 text-gray-600">
                                    Method: <span>{order.paymentMethod || "N/A"}</span>
                                </p>
                                <p className="mt-3 text-gray-600">
                                    Date:{" "}
                                    {order.date ? (
                                        <>
                                            <span>{formatDate(order.date)}</span>
                                            <br />
                                            <span>{formatTime(order.date)}</span>
                                        </>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>

                            </div>

                            {/* Order Amount */}
                            <p className="text-lg sm:text-xl font-bold mr-8 text-gray-800 text-right">
                                ${order.amount?.toFixed(2) || "0.00"}
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
                    <p className="text-center text-gray-500 font-medium py-10">No orders available.</p>
                )}
            </div>

        </div>
    );
};

export default Orders;
