import axios from "axios";
import { Check, ChefHat, CookingPot, CupSoda, Timer, Utensils } from 'lucide-react';
import React, { useContext, useEffect, useState } from "react";
import { backendUrl } from "../../App";
import { ChefContext } from "../../Context/ChefContext";

// Updated ChefOrders Component
const ChefOrders = () => {
    const [orders, setOrders] = useState([]); // List of all orders
    const [currentOrderItems, setCurrentOrderItems] = useState([]); // Items of the current accepted order
    const [currentOrderId, setCurrentOrderId] = useState(null); // ID of the current accepted order
    const [timeLeft, setTimeLeft] = useState(null); // Time left for the current order in seconds
    const [userCustomization, setUserCustomization] = useState([]);

    const { cToken } = useContext(ChefContext);

    // Define fetchOrders function outside of useEffect
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/chef-orders`, {
                headers: { cToken },
            });
            if (response.data.success) {
                setOrders(response.data.orders);
                console.log(response.data.orders);
            } else {
                console.error("Failed to fetch orders.");
            }
        } catch (error) {
            console.error("Error fetching orders:", error.message);
        }
    };

    // Fetch customization notes
    const fetchCustomization = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/customization-notes`);
            //console.log("Customization API Response:", response.data); // Log full response
            if (response.data.success) {
                setUserCustomization(response.data.customizations); // Use correct key
                console.log("Customizations:", response.data.customizations);
            } else {
                console.error("Failed to fetch customizations.");
            }
        } catch (error) {
            console.error("Error fetching customizations:", error.message);
        }
    };


    // Fetch orders when component mounts
    useEffect(() => {
        fetchOrders();
        fetchCustomization();
    }, [cToken]);

    const acceptOrder = async (orderId) => {
        try {
            // Accept the order
            const response = await axios.post(
                `${backendUrl}/api/order/accept`,
                { orderId },
                { headers: { cToken } }
            );

            if (response.data.success) {
                // Fetch the order items
                const itemsResponse = await axios.post(
                    `${backendUrl}/api/order/order-items`,
                    { orderId },
                    { headers: { cToken } }
                );

                if (itemsResponse.data.success) {
                    // Fetch the accepted order details
                    const acceptedOrder = orders.find(order => order.id === orderId);

                    // Calculate the time left for preparation
                    setTimeLeft(acceptedOrder.totalPrepTime * 60);

                    const itemsWithCustomizations = itemsResponse.data.items.map((item) => {
                        // Check if the order's userId matches the userId in customizations
                        const matchingCustomization = userCustomization.find(
                            (custom) =>
                                custom.userId === acceptedOrder.userId &&  // Match the userId of the order with the customization's userId
                                (
                                    (custom.type === "food" && custom.foodId === item.foodId) ||  // Match foodId for food items
                                    (custom.type === "drink" && custom.drinkId === item.id)    // Match drinkId for drink items
                                )
                        );

                        // Return the item with its corresponding custom note (if any)
                        return {
                            ...item,
                            customNote: matchingCustomization?.customNote || null,  // If a match is found, add the custom note; otherwise, null
                        };
                    });



                    // Update the current order items
                    setCurrentOrderItems(itemsWithCustomizations);
                    console.log("setCurrentOrderItems", itemsWithCustomizations);

                    // Set the current order ID
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
        <div className="m-5 w-full max-w-6xl mx-auto">
            {currentOrderId ? (
                <div>
                    {/* Countdown Timer */}
                    {timeLeft !== null && (
                        <div className="flex items-center justify-center py-4 px-6 mb-6 bg-yellow-100 text-yellow-800 font-bold text-lg rounded-lg shadow-lg">
                            <Timer className="text-2xl mr-2" />
                            <span>
                                Time Remaining:{" "}
                                {timeLeft >= 3600
                                    ? `${Math.floor(timeLeft / 3600)}:${String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`
                                    : `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`}
                            </span>
                        </div>
                    )}

                    {/* Order Items Section */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Items</h2>
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md max-h-[85vh] overflow-y-auto">
                        {currentOrderItems.length > 0 ? (
                            currentOrderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex justify-between items-center border rounded-lg p-5 my-4 shadow-md hover:shadow-lg transition-shadow ${item.type === "drink" ? "bg-blue-50" : "bg-white"
                                        }`}
                                >
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                                            <Utensils className="mr-2 text-green-600" />
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-600">{item.description || "No description available"}</p>
                                        <p className="text-gray-700 mt-1 font-medium">Quantity: {item.quantity}</p>
                                        {item.customNote && <p className="text-sm text-red-600 mt-1">Customization: {item.customNote}</p>}
                                    </div>
                                    {item.cookingStatus === "Done" ? (
                                        <div className="text-green-600 font-semibold flex items-center">
                                            <Check className="text-2xl mr-2" />
                                            Completed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => completeItem(item.id)}
                                            className="p-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition flex items-center"
                                        >
                                            <Check className="mr-2" /> Done
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
                                className={`p-3 font-semibold rounded-lg shadow-lg transition ${currentOrderItems.every((item) => item.cookingStatus === "Done")
                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                disabled={!currentOrderItems.every((item) => item.cookingStatus === "Done")}
                            >
                                Complete Order
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">New Orders</h2>
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md max-h-[85vh] overflow-y-auto">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] gap-6 items-center border rounded-lg p-5 my-4 bg-white shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex justify-center items-center">
                                        <ChefHat size={60} className="text-yellow-500" />
                                    </div>
                                    <div>
                                        {Array.isArray(order.items) && order.items.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <p
                                                    key={index}
                                                    className={`text-lg font-medium flex items-center mb-2 ${item.type === "drink" ? "bg-blue-50 p-2 rounded-md" : ""
                                                        }`}
                                                >
                                                    {item.type === "drink" ? <CupSoda className="text-blue-500 mr-2" /> : <CookingPot className="text-blue-500 mr-2" />}
                                                    {item.name}
                                                    <span className="mx-2 text-gray-500">x</span>
                                                    {item.quantity}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-600">No items available</p>
                                        )}
                                        <p className="mt-3 font-medium text-gray-700">{order.address.firstName} {order.address.lastName}</p>
                                        <p className="text-gray-600">{order.address.line1}, {order.address.line2}</p>
                                        <p className="text-gray-600">{order.address.phone}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Items: {order.items.length}</p>
                                        <p className="text-gray-600 mt-2">Method: {order.paymentMethod}</p>
                                        <p className={`font-semibold ${order.isPaid ? "text-green-500" : "text-red-500"} mt-1`}>
                                            Payment: {order.isPaid ? "Done" : "Pending"}
                                        </p>
                                        <p className="text-gray-600 mt-1">Date: {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => acceptOrder(order.id)}
                                            disabled={!!currentOrderId}
                                            className={`p-3 rounded-lg shadow-lg transition ${currentOrderId ? "bg-gray-400 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                                                }`}
                                        >
                                            Accept Order
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

