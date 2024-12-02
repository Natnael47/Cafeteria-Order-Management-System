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

    const { token } = useContext(StoreContext);

    const getFilteredOrders = () => {
        if (currentTab === "all") return orders;
        return orders.filter(order => order.status.toLowerCase() === currentTab);
    };

    // Load order data
    const loadOrderData = async () => {
        try {
            if (!token) return;

            const response = await axios.post(`${backendUrl}/api/order/user-orders`, {}, { headers: { token } });
            if (response.data.success) {
                setOrders(response.data.orders.reverse());
                console.log(response.data.orders);

            }
        } catch (error) {
            console.error("Error loading orders:", error);
        }
    };

    // Cancel order function
    const cancelOrder = async () => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/cancel`,
                { orderId: selectedOrderId },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Order canceled successfully.");
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
        setShowDetails(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1='MY' text2='ORDERS' />
                {/* Tabs */}
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${currentTab === "all" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                        onClick={() => setCurrentTab("all")}
                    >
                        All
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${currentTab === "preparing" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                        onClick={() => setCurrentTab("preparing")}
                    >
                        Preparing
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${currentTab === "complete" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                        onClick={() => setCurrentTab("complete")}
                    >
                        Complete
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${currentTab === "canceled" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                        onClick={() => setCurrentTab("canceled")}
                    >
                        Canceled
                    </button>
                </div>
            </div>

            <div>
                {getFilteredOrders().map((order, index) => (
                    <div key={index} className="py-4 border-t border-b border-gray-600 text-black flex flex-col gap-4 hover:bg-green-50">
                        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                            <div className='flex items-start gap-5 text-sm'>
                                <img className='w-10 sm:w-16' src={assets.delivery_man_icon} alt='Parcel Icon' />
                                <div>
                                    <div className='sm:text-base font-medium'>
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div className='py-0.5' key={idx}>
                                                {item.quantity} {item.name}{item.quantity > 1 ? "'s" : ""}
                                            </div>
                                        ))}
                                        {order.items.length > 2 && <span>and more...</span>}
                                    </div>
                                    <p className='mt-1'>Date: <span className='text-gray-800'>{new Date(order.date).toDateString()}</span></p>
                                    <p className="mt-1">
                                        Payment: <span className="text-gray-800 font-semibold">{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
                                    </p>
                                </div>
                            </div>

                            <div className='md:w-[60%] flex justify-between'>
                                <div className='flex items-center'>
                                    <p className='text-lg font-bold'>${order.amount}.00</p>
                                </div>

                                <div className='flex items-center gap-2'>
                                    <span className='w-2 h-2 rounded-full bg-green-600'></span>
                                    <p><b>{order.status}</b></p>
                                </div>

                                <div className='flex flex-col'>
                                    <button onClick={loadOrderData} className='border border-primary px-4 py-2 text-sm font-semibold rounded-sm hover:bg-green-200'>Track Order</button>
                                    {order.status === 'Order Placed' && (
                                        <button
                                            onClick={() => openModal(order.id)}
                                            className='border border-red-500 px-4 py-2 text-sm font-semibold rounded-sm mt-3 hover:bg-red-200'
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                    <button onClick={() => toggleDetails(index)} className='border border-blue-500 px-4 py-2 text-sm font-semibold rounded-sm mt-3 hover:bg-blue-200'>
                                        {showDetails[index] ? 'Hide' : 'Show more'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {showDetails[index] && (
                            <div className="mt-2 pt-4 space-y-4">
                                <h3 className='font-semibold'>Order Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className='flex flex-col sm:flex-row gap-4 items-center'>
                                            <img
                                                className="w-20 rounded-[15px]"
                                                src={`${backendUrl}/images/${item.image || ''}`}
                                                alt={item.name}
                                            />
                                            <div>
                                                <p className='font-semibold'>
                                                    {item.quantity} {item.name}{item.quantity > 1 ? "'s" : ""}
                                                </p>
                                                <p>Price: ${item.price * item.quantity}</p>
                                                <p className='font-semibold'>
                                                    Cooking Status:_
                                                    <span
                                                        className={`${order.orderItem.find(orderItem => orderItem.foodId === item.id)?.cookingStatus === 'Done'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                            }`}
                                                    >
                                                        {order.orderItem.find(orderItem => orderItem.foodId === item.id)?.cookingStatus || 'Not Available'}
                                                    </span>
                                                </p>


                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal for Cancel Order */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        borderRadius: '10px',
                        width: '400px',
                        textAlign: 'center',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
                        zIndex: 1000, // Ensure it appears above other content
                    },
                }}
            >
                <h2 className='font-semibold'>Cancel Order</h2>
                <p>Are you sure you want to cancel this order?</p>
                <div className="flex justify-between mt-4">
                    <button onClick={cancelOrder} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Yes, Cancel</button>
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">No, Keep</button>
                </div>
            </Modal>
        </div>
    );
};

export default MyOrders;
