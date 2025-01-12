import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import LoginPopUp from '../components/LoginPopup';
import Title from '../components/Title';
import { StoreContext } from '../context/StoreContext';

const PlaceOrder = () => {
    const {
        token,
        food_list,
        drink_list,
        cartItems,
        clearCart,
        navigate,
        getTotalCartAmount,
        userData,
        setUserData,
        loadUserProfileData,
        fetchCashierData,
        cashierData
    } = useContext(StoreContext);

    useEffect(() => {
        fetchCashierData();
    }, []);

    const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'dine-in'
    const [dineInTime, setDineInTime] = useState(''); // Time selection for dine-in

    const [method, setMethod] = useState('cod');
    const [showLogin, setShowLogin] = useState(false);
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: { neighborhood: '', landmark: '' },
    });
    const [loaded, setLoaded] = useState(false); // Added to track initial data loading

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cartItems')) || cartItems;

        if (!token) {
            toast.warn("Please log in to place an order.");
            setShowLogin(true);
        } else if (!savedCart || Object.values(savedCart).every((count) => count <= 0)) {
            toast.info("Select Food to Order.");
            navigate("/menu"); // Redirect to menu page
        } else {
            // Preload user data
            loadUserProfileData();

            if (!loaded) {
                setData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: {
                        neighborhood: userData.address?.line1 || '',
                        landmark: userData.address?.line2 || '',
                    },
                });

                // Add the following block to check if COD should be available
                const cashierEmails = cashierData.map((cashier) => cashier.email.toLowerCase());
                if (cashierEmails.includes((userData.email || '').toLowerCase())) {
                    setMethod('cod'); // Default to COD for cashiers
                } else {
                    setMethod('stripe'); // Default to Stripe for non-cashiers
                }

                setLoaded(true);
            }
        }
    }, [token, cartItems, userData, loadUserProfileData, navigate, loaded, cashierData]);


    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        if (name.startsWith('address.')) {
            const key = name.split('.')[1];
            setData((prevData) => ({
                ...prevData,
                address: { ...prevData.address, [key]: value },
            }));
        } else {
            setData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const placeOrder = async (event) => {
        event.preventDefault();
        try {
            // Filter cartItems for food and drink items
            const orderItems = Object.entries(cartItems)
                .filter(([key, count]) => count > 0) // Include only items with count > 0
                .map(([key, count]) => {
                    if (key.startsWith('food-')) {
                        const foodId = parseInt(key.replace('food-', ''), 10); // Extract food ID
                        const foodItem = food_list.find((item) => item.id === foodId);
                        if (foodItem) {
                            return {
                                id: foodItem.id,
                                name: foodItem.name,
                                price: foodItem.price,
                                image: foodItem.image,
                                prepTime: foodItem.prepTime,
                                quantity: count,
                                status: 'NULL',
                                type: 'food',
                            };
                        }
                    } else if (key.startsWith('drink-')) {
                        const drinkId = parseInt(key.replace('drink-', ''), 10); // Extract drink ID
                        const drinkItem = drink_list.find((item) => item.drink_Id === drinkId);
                        if (drinkItem) {
                            return {
                                id: drinkItem.drink_Id,
                                name: drinkItem.drink_Name,
                                price: drinkItem.drink_Price,
                                image: drinkItem.drink_Image,
                                quantity: count,
                                status: 'NULL',
                                type: 'drink',
                            };
                        }
                    }
                    return null;
                })
                .filter(Boolean); // Remove null entries

            if (orderItems.length === 0) {
                toast.info("Your cart doesn't contain any items.");
                return;
            }

            if (orderType === 'dine-in' && (!dineInTime || dineInTime < "02:30" || dineInTime > "14:00")) {
                toast.error('Please select a valid dine-in time within working hours (2:30 AM - 2:00 PM).');
                return;
            }

            const address = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                ...(orderType === 'delivery' && {
                    line1: data.address.neighborhood,
                    line2: data.address.landmark,
                }),
            };

            const orderData = {
                items: orderItems,
                amount: getTotalCartAmount() + (orderType === 'delivery' ? 2 : 0),
                address,
                serviceType: orderType === 'delivery' ? 'Delivery' : 'Dine-In',
                ...(orderType === 'dine-in' && { dineInTime }),
            };
            //console.log(orderData);

            let response;
            if (method === 'cod') {
                response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
            } else if (method === 'stripe') {
                response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
                if (response.data.success) {
                    window.location.replace(response.data.session_url);
                }
            } else if (method === 'chapa') {
                response = await axios.post(`${backendUrl}/api/order/chapa`, orderData, { headers: { token } });
                if (response.data.success) {
                    window.location.href = response.data.checkout_url; // Redirect to Chapa checkout
                } else {
                    console.error('Chapa Payment Error:', response.data.message);
                    alert(response.data.message || "Failed to initialize payment.");
                }
            }

            if (response?.data?.success) {
                toast.success('Order placed successfully!');
                clearCart(); // Clears the cart
                navigate('/myorders');
            } else {
                toast.error(response?.data?.message || 'Order placement failed.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('An error occurred while placing the order.');
        }
    };

    return (
        <>
            {showLogin && <LoginPopUp setShowLogin={setShowLogin} />}
            {/* Conditional check for token and cart items */}
            {token && Object.values(cartItems).some(count => count > 0) ? (
                <form
                    className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
                    onSubmit={placeOrder}
                >
                    {/* User Information */}
                    <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                        <div className="text-xl sm:text-2xl my-3">
                            <Title text1={'User'} text2={'INFORMATION'} />
                        </div>
                        <div className="flex gap-3">
                            <input
                                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                name="firstName"
                                onChange={onChangeHandler}
                                value={data.firstName}
                                type="text"
                                placeholder="First name"
                                required
                            />
                            <input
                                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                name="lastName"
                                onChange={onChangeHandler}
                                value={data.lastName}
                                type="text"
                                placeholder="Last name"
                                required
                            />
                        </div>
                        <input
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                            name="email"
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder="Email address"
                            required
                        />
                        <div className="flex bg-white items-center border border-gray-300 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-black">
                            <span className="text-gray-500 font-medium text-lg">+251</span>
                            <input
                                className="flex-1 outline-none border-none text-lg pl-2 bg-white"
                                name="phone"
                                onChange={onChangeHandler}
                                value={data.phone}
                                type="text"
                                placeholder="Phone number"
                                required
                            />

                        </div>
                        <div className="mt-4">
                            <p className="font-medium text-lg mb-2">Order Type</p>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="orderType"
                                        value="delivery"
                                        checked={orderType === 'delivery'}
                                        onChange={() => setOrderType('delivery')}
                                    />
                                    Delivery
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="orderType"
                                        value="dine-in"
                                        checked={orderType === 'dine-in'}
                                        onChange={() => setOrderType('dine-in')}
                                    />
                                    Dine-In
                                </label>
                            </div>

                            {/* Conditional Rendering for Delivery */}
                            {orderType === 'delivery' && (
                                <div className="mt-4">
                                    <input
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full mb-2"
                                        name="address.neighborhood"
                                        onChange={onChangeHandler}
                                        value={data.address.neighborhood}
                                        type="text"
                                        placeholder="Address Line 1"
                                        required
                                    />
                                    <input
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                        name="address.landmark"
                                        onChange={onChangeHandler}
                                        value={data.address.landmark}
                                        type="text"
                                        placeholder="Address Line 2"
                                        required
                                    />
                                </div>
                            )}

                            {/* Conditional Rendering for Dine-In */}
                            {orderType === 'dine-in' && (
                                <div className="mt-4">
                                    <p className="font-medium text-sm mb-2">Select Dine-In Time</p>
                                    <input
                                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                                        type="time"
                                        min="02:30" // Ethiopian working hours (2:30 AM)
                                        max="14:00" // Ethiopian working hours (2:00 PM)
                                        value={dineInTime}
                                        onChange={(e) => setDineInTime(e.target.value)}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right side */}
                    <div className="mt-8 w-full sm:max-w-[500px]">
                        <div className="mt-8 min-w-80">
                            <CartTotal />
                        </div>
                        <div className="mt-12">
                            <Title text1={'PAYMENT'} text2={'METHOD'} />
                            <div className="flex gap-3 flex-col lg:flex-row">
                                <div
                                    onClick={() => setMethod('stripe')}
                                    className={`flex items-center gap-3 border border-gray-500 p-2 px-3 cursor-pointer ${method === 'stripe' ? 'selected' : ''}`}
                                >
                                    <p
                                        className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''}`}
                                    ></p>
                                    <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                                </div>
                                <div
                                    onClick={() => setMethod('chapa')}
                                    className={`flex items-center gap-3 border border-gray-500 p-2 px-3 cursor-pointer ${method === 'chapa' ? 'selected' : ''}`}
                                >
                                    <p
                                        className={`min-w-3.5 h-3.5 border rounded-full ${method === 'chapa' ? 'bg-green-500' : ''}`}
                                    ></p>
                                    <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                                </div>
                                {cashierData.some((cashier) => cashier.email.toLowerCase() === data.email.toLowerCase()) && (
                                    <div
                                        onClick={() => setMethod('cod')}
                                        className={`flex items-center gap-3 border border-gray-500 p-2 px-3 cursor-pointer ${method === 'cod' ? 'selected' : ''}`}
                                    >
                                        <p
                                            className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}
                                        ></p>
                                        <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                                    </div>
                                )}
                            </div>

                            <div className="w-full text-end mt-8">
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-16 py-3 text-sm border rounded hover:bg-black hover:text-white transition-all"
                                >
                                    PLACE ORDER
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="text-center py-10">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Please log in and add items to your cart to place an order.
                    </h2>
                </div>
            )}
        </>

    );
};

export default PlaceOrder;
