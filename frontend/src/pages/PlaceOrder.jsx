import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { StoreContext } from '../context/StoreContext';

const PlaceOrder = () => {
    const {
        token,
        food_list,
        cartItems,
        clearCart,
        navigate,
        getTotalCartAmount,
        userData,
        setUserData,
        loadUserProfileData
    } = useContext(StoreContext);

    const [method, setMethod] = useState('cod');
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
            navigate(`/login?redirectTo=${encodeURIComponent('/place-order')}`);
        } else if (!savedCart || Object.keys(savedCart).length === 0) {
            toast.info("Select Food to Order.");
            navigate("/menu");
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
                setLoaded(true);
            }
        }
    }, [token, cartItems, userData, loadUserProfileData, navigate, loaded]);


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
            const orderItems = food_list
                .filter((item) => cartItems[item.id] > 0)
                .map((item) => ({
                    ...item,
                    quantity: cartItems[item.id],
                    status: 'NULL',
                }));

            const orderData = {
                address: {
                    line1: data.address.neighborhood,  // Map neighborhood to line1
                    line2: data.address.landmark,      // Map landmark to line2
                    firstName: data.firstName,         // Include firstName in address
                    lastName: data.lastName,           // Include lastName in address
                    email: data.email,                 // Include email in address
                    phone: data.phone.startsWith('+251') ? data.phone : `+251${data.phone}`,  // Ensure phone is in correct format
                },
                items: orderItems,
                amount: getTotalCartAmount() + 2,  // Adding delivery fee
            };


            let response;
            if (method === 'cod') {
                response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
            } else if (method === 'stripe') {
                response = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
                if (response.data.success) {
                    window.location.replace(response.data.session_url);
                }
            }

            if (response?.data?.success) {
                toast.success('Order placed successfully!');
                clearCart();
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
                <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 focus-within:ring focus-within:ring-green-500">
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
                <input
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    name="address.neighborhood"
                    onChange={onChangeHandler}
                    value={data.address.neighborhood}
                    type="text"
                    placeholder="Neighborhood/Area Name"
                    required
                />
                <input
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    name="address.landmark"
                    onChange={onChangeHandler}
                    value={data.address.landmark}
                    type="text"
                    placeholder="Nearby Landmark or Reference"
                    required
                />
            </div>
            {/* Right side */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12">
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div
                            onClick={() => setMethod('stripe')}
                            className="flex items-center gap-3 border border-gray-500 p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-500' : ''
                                    }`}
                            ></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>
                        <div
                            onClick={() => setMethod('razorpay')}
                            className="flex items-center gap-3 border border-gray-500 p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-500' : ''
                                    }`}
                            ></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div>
                        <div
                            onClick={() => setMethod('cod')}
                            className="flex items-center gap-3 border border-gray-500 p-2 px-3 cursor-pointer"
                        >
                            <p
                                className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''
                                    }`}
                            ></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                        </div>
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
    );
};

export default PlaceOrder;
