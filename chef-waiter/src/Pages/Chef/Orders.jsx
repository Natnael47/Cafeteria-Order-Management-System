import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../../../admin/src/assets/assets";
import { backendUrl } from "../../App";
import { ChefContext } from "../../Context/ChefContext";

const ChefOrders = () => {
    const [orders, setOrders] = useState([]); // List of all orders
    const [currentOrderItems, setCurrentOrderItems] = useState([]); // Items of the current accepted order
    const [currentOrderId, setCurrentOrderId] = useState(null); // ID of the current accepted order
    const { cToken } = useContext(ChefContext);

    // Fetch orders from the API
    useEffect(() => {
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

        fetchOrders();
    }, [cToken]);

    // Accept the order and fetch its items
    const acceptOrder = async (orderId) => {
        try {
            // Accept the order
            const response = await axios.post(
                `${backendUrl}/api/order/accept`,
                { orderId },
                { headers: { cToken } }
            );

            if (response.data.success) {
                // Fetch the order items for the accepted order
                const itemsResponse = await axios.post(
                    `${backendUrl}/api/order/order-items`,
                    { orderId },
                    { headers: { cToken } }
                );
                console.log(itemsResponse.data);


                if (itemsResponse.data.success) {
                    setCurrentOrderItems(itemsResponse.data.items);
                    setCurrentOrderId(orderId); // Set current order ID to indicate we're viewing this order
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
                    prevItems.filter((item) => item.id !== itemId) // Remove the item after it's marked as completed
                );
            } else {
                console.error("Failed to complete order item.");
            }
        } catch (error) {
            console.error("Error completing order item:", error.message);
        }
    };

    // Complete the entire order
    const completeOrder = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/complete`,
                { orderId: currentOrderId },
                { headers: { cToken } }
            );

            if (response.data.success) {
                setCurrentOrderItems([]); // Reset the order items after completing the order
                setCurrentOrderId(null); // Reset the current order ID
                // Fetch the updated list of orders
                const ordersResponse = await axios.get(`${backendUrl}/api/order/chef-orders`, {
                    headers: { cToken },
                });

                if (ordersResponse.data.success) {
                    setOrders(ordersResponse.data.orders);
                }
            } else {
                console.error("Failed to complete the order.");
            }
        } catch (error) {
            console.error("Error completing the order:", error.message);
        }
    };

    return (
        <div className="m-5 w-full">
            {currentOrderId ? (
                <div>
                    <p className="text-lg font-semibold">Order Items</p>
                    <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                        {currentOrderItems.length > 0 ? (
                            currentOrderItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border-2 border-black p-4 my-2 bg-white"
                                >
                                    <div>
                                        <p className="font-semibold">{item.foodName}</p>
                                        <p className="text-sm">{item.description}</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                    <button
                                        onClick={() => completeItem(item.id)}
                                        className="p-2 bg-green-500 text-white font-semibold rounded"
                                    >
                                        Done
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No order items found.</p>
                        )}
                        <div className="text-center mt-4">
                            <button
                                onClick={completeOrder}
                                className="p-2 bg-blue-500 text-white font-semibold rounded"
                            >
                                Complete Order
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-lg font-semibold">NEW ORDERS</p>
                    <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr_1fr] gap-3 items-start border-2 border-black p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-black bg-white"
                                    key={order.id}
                                >
                                    <img
                                        className="w-16"
                                        src={assets.chef_icon}
                                        alt="Chef Icon"
                                    />
                                    <div>
                                        <div>
                                            {order.items.map((item, index) => (
                                                <p className="py-0.5" key={index}>
                                                    {item.name} X <span>{item.quantity}</span>
                                                </p>
                                            ))}
                                        </div>
                                        <p className="mt-3 mb-2 font-medium">
                                            {order.address.firstName + " " + order.address.lastName}
                                        </p>
                                        <div>
                                            <p>{order.address.street + ","}</p>
                                            <p>
                                                {order.address.city +
                                                    ", " +
                                                    order.address.state +
                                                    ", " +
                                                    order.address.country +
                                                    ", " +
                                                    order.address.zipcode}
                                            </p>
                                        </div>
                                        <p>{order.address.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm sm:text-[15px]">
                                            Items: {order.items.length}
                                        </p>
                                        <p className="mt-3">Method: {order.paymentMethod}</p>
                                        <div className="flex flex-row">
                                            <p>Payment: </p>
                                            <p
                                                className={
                                                    order.payment
                                                        ? "text-green-500 font-semibold"
                                                        : "text-red-500 font-semibold"
                                                }
                                            >
                                                {order.payment ? "Done" : "Pending"}
                                            </p>
                                        </div>
                                        <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => acceptOrder(order.id)}
                                            disabled={!!currentOrderId}
                                            className={`p-2 text-white font-semibold ${currentOrderId
                                                ? "bg-gray-400"
                                                : "bg-blue-500 hover:bg-blue-700"
                                                }`}
                                        >
                                            Accept Order
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No orders to display.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefOrders;
