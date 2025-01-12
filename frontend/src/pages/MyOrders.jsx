import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-modal";
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { StoreContext } from '../context/StoreContext';

Modal.setAppElement("#root"); // Set app element for accessibility

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [showDetails, setShowDetails] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentTab, setCurrentTab] = useState("all");
    const [countdowns, setCountdowns] = useState({});
    const [loading, setLoading] = useState(true);
    // State to hold the selected time period
    const [timePeriod, setTimePeriod] = useState("all");

    const { token } = useContext(StoreContext);

    const getFilteredOrders = () => {
        if (currentTab === "all") return orders;
        return orders.filter(order => order.status.toLowerCase() === currentTab);
    };

    // Load order data
    // Load order data and filter based on time period
    const loadOrderData = async () => {
        try {
            if (!token) return;

            setLoading(true); // Set loading to true before data fetch
            const response = await axios.post(`${backendUrl}/api/order/user-orders`, {}, { headers: { token } });

            if (response.data.success) {
                let orders = response.data.orders.reverse();

                // Filter orders based on selected time period
                if (timePeriod === "today") {
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.date);
                        const today = new Date();
                        return orderDate.toDateString() === today.toDateString();
                    });
                } else if (timePeriod === "week") {
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.date);
                        const startOfWeek = new Date();
                        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                        return orderDate >= startOfWeek;
                    });
                } else if (timePeriod === "month") {
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.date);
                        const startOfMonth = new Date();
                        startOfMonth.setDate(1);
                        return orderDate >= startOfMonth;
                    });
                }

                const countdownTimers = { ...countdowns };

                orders.forEach(order => {
                    if (order.status.toLowerCase() === "preparing" && order.totalPrepTime && !countdowns[order.id]) {
                        countdownTimers[order.id] = order.totalPrepTime * 60; // Convert minutes to seconds
                    }
                    order.viewed = order.viewed || false; // Ensure viewed flag is initialized
                    order.notificationDot = !order.viewed; // Set notification dot for unseen orders
                });

                setOrders(orders);
                setCountdowns(countdownTimers);
            }
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false); // Set loading to false after data is loaded
        }
    };

    useEffect(() => {
        if (token) {
            loadOrderData();
        }
    }, [timePeriod, token]); // Add `timePeriod` to the dependency array


    useEffect(() => {
        const timer = setInterval(() => {
            setCountdowns(prevCountdowns => {
                const updatedCountdowns = { ...prevCountdowns };
                Object.keys(updatedCountdowns).forEach(orderId => {
                    if (updatedCountdowns[orderId] > 0) {
                        updatedCountdowns[orderId] -= 1;
                    }
                });
                return updatedCountdowns;
            });

            if (!loading) { // Ensure this logic only runs after initial loading
                setOrders(prevOrders =>
                    prevOrders.map(order => {
                        if (order.status.toLowerCase() === "preparing" && !order.notificationDot) {
                            order.notificationDot = !order.viewed; // Set notification dot for unseen preparing orders
                        }
                        if (order.status.toLowerCase() === "complete" && order.notificationDot) {
                            order.notificationDot = false; // Remove notification dot for completed orders
                        }
                        return order;
                    })
                );
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup on unmount
    }, [loading]); // Depend on loading to delay notification updates

    // Cancel order function
    const cancelOrder = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/cancel`,
                { orderId: selectedOrderId },
                { headers: { token } }
            );

            if (response.data.success) {
                // Show the success message from backend
                const message = response.data.message;

                // If there is an amount paid (for paid orders), show that too
                if (response.data.amountPaid) {
                    toast.success(`${message} Amount refunded: $${response.data.amountPaid}`);
                } else {
                    toast.success(message); // Order was canceled successfully
                }

                loadOrderData(); // Reload orders to reflect the updated status
            } else {
                alert(response.data.message || "Failed to cancel the order.");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            alert("An error occurred while canceling the order. Please try again.");
        } finally {
            closeModal();
        }
    };


    // Open modal and set selected order ID
    const openModal = (orderId) => {
        setSelectedOrderId(orderId);
        setModalIsOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedOrderId(null);
    };

    useEffect(() => {
        if (token) {
            loadOrderData();
        }
    }, [token]);

    // Toggle order details visibility
    const toggleDetails = (index) => {
        const order = orders[index];

        // Mark the order as viewed when the user clicks to see the details
        if (!order.viewed) {
            order.viewed = true; // Set the order as viewed
            order.notificationDot = false; // Remove the notification dot
            setOrders([...orders]); // Update the orders state to trigger a re-render
        }

        setShowDetails(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    // Handle time period change
    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
    };

    return (
        <div className="border-t pt-16">
            <div className="text-2xl">
                <Title text1="MY" text2="ORDERS" />
                {/* Tabs and Time Period Filter */}
                <div className="flex items-center justify-between mb-6">
                    {/* Tabs Section */}
                    <div className="flex items-center space-x-4">
                        {["all", "preparing", "complete", "canceled"].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 rounded ${currentTab === tab ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                                onClick={() => setCurrentTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Time Period Filter */}
                    <div className="flex items-center space-x-3">
                        <label htmlFor="timePeriod" className="text-gray-700 font-medium">Filter by:</label>
                        <select
                            id="timePeriod"
                            className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={timePeriod}
                            onChange={handleTimePeriodChange}
                        >
                            <option value="all">All Orders</option>
                            <option value="today">Today's Orders</option>
                            <option value="week">This Week's Orders</option>
                            <option value="month">This Month's Orders</option>
                        </select>
                    </div>
                </div>

            </div>

            <div>
                {getFilteredOrders().map((order, index) => {
                    // Parse order.items if it's a string
                    const items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;

                    return (
                        <div key={index} className="py-4 border-t border-b border-gray-600 text-black flex flex-col gap-4 hover:bg-green-50">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex items-start gap-5 text-sm">
                                    <img className="w-10 sm:w-16" src={assets.delivery_man_icon} alt="Parcel Icon" />
                                    <div>
                                        <div className="sm:text-base font-medium">
                                            {items.slice(0, 2).map((item, idx) => (
                                                <div className="py-0.5" key={idx}>
                                                    {item.quantity} {item.name}{item.quantity > 1 ? "'s" : ""}
                                                </div>
                                            ))}
                                            {items.length > 2 && <span>and more...</span>}
                                        </div>
                                        <p className="mt-1">
                                            Date: <span className="text-gray-800">{new Date(order.date).toDateString()}</span>
                                        </p>
                                        <p className="mt-1">
                                            Payment: <span className="text-gray-800 font-semibold">{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
                                        </p>
                                        <p className="mt-1">
                                            Service Type: <span className="text-gray-800 font-semibold">{order.serviceType}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="md:w-[60%] flex justify-between">
                                    <div className="flex items-center">
                                        <p className="text-lg font-bold">${order.amount}.00</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                        <p>
                                            <b>{order.status}</b>
                                        </p>
                                    </div>

                                    <div className="flex flex-col">
                                        <button onClick={loadOrderData} className="border border-primary px-4 py-2 text-sm font-semibold rounded-sm hover:bg-green-200">
                                            Track Order
                                        </button>
                                        {order.status === "Order Placed" && (
                                            <button
                                                onClick={() => openModal(order.id)}
                                                className="border border-red-500 px-4 py-2 text-sm font-semibold rounded-sm mt-3 hover:bg-red-200"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                        <button onClick={() => toggleDetails(index)} className="border border-blue-500 px-4 py-2 text-sm font-semibold rounded-sm mt-3 hover:bg-blue-200">
                                            {showDetails[index] ? "Hide" : "Show more"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {showDetails[index] && (
                                <div className="mt-2 pt-4 space-y-4">
                                    {order.status.toLowerCase() === "preparing" && countdowns[order.id] !== undefined && (
                                        <div className="text-center p-4 bg-green-300 text-lg font-bold">
                                            {countdowns[order.id] >= 3600
                                                ? `Time Remaining: ${Math.floor(countdowns[order.id] / 3600)}:${String(
                                                    Math.floor((countdowns[order.id] % 3600) / 60)
                                                ).padStart(2, "0")}:${String(countdowns[order.id] % 60).padStart(2, "0")}`
                                                : `Time Remaining: ${Math.floor(countdowns[order.id] / 60)}:${String(countdowns[order.id] % 60).padStart(2, "0")}`}
                                        </div>
                                    )}
                                    <h3 className="font-semibold">Order Details</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {items.map((item, idx) => (
                                            <div key={idx} className="flex flex-col sm:flex-row gap-4 items-center">
                                                <img className="w-20 rounded-[15px]" src={`${backendUrl}/images/${item.image || ""}`} alt={item.name} />
                                                <div>
                                                    <p className="font-semibold">
                                                        {item.quantity} {item.name}{item.quantity > 1 ? "'s" : ""}
                                                    </p>
                                                    <p>Price: ${item.price * item.quantity}</p>
                                                    <p className="font-semibold">
                                                        Cooking Status:
                                                        <span
                                                            className={`${order.orderItem.find((orderItem) => orderItem.foodId === item.id)?.cookingStatus === "Done" ||
                                                                order.orderItem.find((orderItem) => orderItem.drinkId === item.id)?.cookingStatus === "Done"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                                }`}
                                                        >
                                                            {order.orderItem.find((orderItem) => orderItem.foodId === item.id)?.cookingStatus || "Not Available"}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal for Cancel Order */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        padding: "20px",
                        borderRadius: "10px",
                        width: "400px",
                        textAlign: "center",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                    },
                }}
            >
                <h2 className="font-semibold">Cancel Order</h2>
                <p>Are you sure you want to cancel this order?</p>
                <div className="flex justify-between mt-4">
                    <button onClick={cancelOrder} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Yes, Cancel
                    </button>
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        No, Keep
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default MyOrders;
