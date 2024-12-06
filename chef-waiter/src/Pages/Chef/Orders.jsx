import axios from "axios";
import { Check, ChefHat, CookingPot, Timer, Utensils } from 'lucide-react';
import React, { useContext, useEffect, useState } from "react";
import { backendUrl } from "../../App";
import { ChefContext } from "../../Context/ChefContext";

// Updated ChefOrders Component
const ChefOrders = () => {
    const [orders, setOrders] = useState([]); // List of all orders
    const [currentOrderItems, setCurrentOrderItems] = useState([]); // Items of the current accepted order
    const [currentOrderId, setCurrentOrderId] = useState(null); // ID of the current accepted order
    const [timeLeft, setTimeLeft] = useState(null); // Time left for the current order in seconds

    const { cToken } = useContext(ChefContext);

    // Define fetchOrders function outside of useEffect
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/chef-orders`, {
                headers: { cToken },
            });
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                console.error("Failed to fetch orders.");
            }
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        }
    };

    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
    }, [cToken]);

    // Accept the order and fetch its items
    const acceptOrder = async (orderId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/accept`,
                { orderId },
                { headers: { cToken } }
            );

            if (response.data.success) {
                const itemsResponse = await axios.post(
                    `${backendUrl}/api/order/order-items`,
                    { orderId },
                    { headers: { cToken } }
                );

                if (itemsResponse.data.success) {
                    const acceptedOrder = orders.find(order => order.id === orderId); // Find the accepted order
                    setTimeLeft(acceptedOrder.totalPrepTime * 60); // Convert minutes to seconds
                    setCurrentOrderItems(itemsResponse.data.items);
                    console.log(itemsResponse.data.items);

                    setCurrentOrderId(orderId);
                } else {
                    console.error("Failed to fetch order items.");
                }
            } else {
                console.error("Failed to accept order.");
            }
        } catch (error) {
            console.error("Error accepting order:", error.message);
        }
    };

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timer);
        }

        return () => clearInterval(timer); // Cleanup on component unmount or timer reset
    }, [timeLeft]);


    // Mark an order item as completed
    const completeItem = async (itemId) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/complete-item`,
                { itemId },
                { headers: { cToken } }
            );

            if (response.data.success) {
                setCurrentOrderItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === itemId
                            ? { ...item, cookingStatus: "Done", completedAt: new Date() }
                            : item
                    )
                );
            } else {
                console.error("Failed to complete order item.");
            }
        } catch (error) {
            console.error("Error completing order item:", error.message);
        }
    };

    // Go back to the orders list and refresh orders
    const completeOrder = () => {
        setCurrentOrderItems([]);
        setCurrentOrderId(null);
        setTimeLeft(null); // Reset timer
        fetchOrders(); // Refresh the orders
    };

    return (
        <div className="m-5 w-full max-w-6.5xl">
            {currentOrderId ? (
                <div>
                    {/* Countdown Timer */}
                    {timeLeft !== null && (
                        <div className="text-center py-3 px-6 mb-5 bg-yellow-200 text-yellow-800 font-bold text-lg rounded shadow-md flex items-center justify-center">
                            <span className="text-2xl mr-2"><Timer /></span>
                            {timeLeft >= 3600
                                ? `Time Remaining: ${Math.floor(timeLeft / 3600)}:${String(
                                    Math.floor((timeLeft % 3600) / 60)
                                ).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')} `
                                : `Time Remaining: ${Math.floor(timeLeft / 60)}:${String(
                                    timeLeft % 60
                                ).padStart(2, '0')} `}
                        </div>
                    )}

                    {/* Order Items Section */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Items</h2>
                    <div className="bg-gray-100 rounded-lg p-5 shadow-lg max-h-[85vh] overflow-y-auto">
                        {currentOrderItems.length > 0 ? (
                            currentOrderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border rounded-lg p-4 my-3 bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800 flex items-center">
                                            <span className="mr-2 text-green-600">
                                                <Utensils />
                                            </span>
                                            {item.foodName}
                                        </p>
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                        <p className="font-medium text-gray-700 mt-1">Quantity: {item.quantity}</p>
                                    </div>
                                    {item.cookingStatus === "Done" ? (
                                        <div className="p-2 text-green-600 font-semibold flex items-center">
                                            <span className="text-2xl mr-2"><Check /></span> Completed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => completeItem(item.id)}
                                            className="p-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition flex items-center"
                                        >
                                            <span className="mr-2"><Check /></span> Done
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700">No order items found.</p>
                        )}
                        <div className="text-center mt-6">
                            <button
                                onClick={completeOrder}
                                className={`p-3 font-semibold rounded-lg shadow-md transition flex items-center justify-center ${currentOrderItems.every((item) => item.cookingStatus === "Done")
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={!currentOrderItems.every((item) => item.cookingStatus === "Done")}
                            >
                                <span className="mr-2"></span> Complete Order
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Orders</h2>
                    <div className="bg-gray-100 rounded-lg p-5 shadow-lg max-h-[85vh] overflow-y-auto">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] gap-4 items-start border rounded-lg p-5 my-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="text-yellow-500 flex justify-center items-center">
                                        <ChefHat size={60} />
                                    </div>
                                    <div>
                                        <div>
                                            {order.items.map((item, index) => (
                                                <p className="text-lg font-medium text-gray-800 mb-1 flex items-center" key={index}>
                                                    <span className="mr-2 text-blue-500"><CookingPot /></span>
                                                    {item.name}
                                                    <span className="mx-2 text-gray-500">x</span>
                                                    <span className="font-semibold">{item.quantity}</span>
                                                </p>
                                            ))}
                                        </div>
                                        <p className="mt-3 font-medium text-gray-700">
                                            {order.address.firstName} {order.address.lastName}
                                        </p>
                                        <p className="text-gray-600">{order.address.street},</p>
                                        <p className="text-gray-600">{order.address.phone}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Items: {order.items.length}</p>
                                        <p className="mt-3 text-gray-600">Method: {order.paymentMethod}</p>
                                        <div className="flex items-center gap-2">
                                            <p>Payment:</p>
                                            <p
                                                className={`font-semibold ${order.payment
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {order.payment ? "Done" : "Pending"}
                                            </p>
                                        </div>
                                        <p className="text-gray-600">Date: {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => acceptOrder(order.id)}
                                            disabled={!!currentOrderId}
                                            className={`p-3 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center ${currentOrderId
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600"
                                                }`}
                                        >
                                            <span className="mr-2"></span> Accept Order
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-700">No orders to display.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefOrders;

