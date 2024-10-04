import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

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

    const fetchOrder = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } })
            if (response.data.success) {
                setOrders(response.data.orders);
                console.log(response.data.orders);

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
        <div>
            <h3>ORDER PAGE</h3>
            <div>
                {
                    orders.map((order, index) => (
                        <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-black p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-black' key={index}>
                            <img className='w-16' src={assets.parcel_icon} alt="" />
                            <div>

                                <div>
                                    {order.items.map((item, index) => {
                                        if (index === order.items.length - 1) {
                                            return <p className='py-0.5' key={index}> {item.name} X <span>  {item.quantity} </span></p>
                                        } else {
                                            return <p className='py-0.5' key={index}> {item.name} X <span>  {item.quantity} ,</span></p>
                                        }
                                    })}
                                </div>
                                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                                <div>
                                    <p>{order.address.street + ","}</p>
                                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                                </div>
                                <p>{order.address.phone}</p>
                            </div>
                            <div>
                                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                                <p className='mt-3'>Method : {order.paymentMethod}</p>
                                <div className='flex flex-row'>
                                    <p>Payment : </p>
                                    <p className={order.payment ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>_{order.payment ? "Done" : "Pending"}</p>
                                </div>
                                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <p className='text-sm sm:text-[15px] font-bold'>${order.amount}</p>
                            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold'>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

//   <div className='order add'>
//       <h3>Order Page</h3>
//       <div className="order-list">
//           {orders.map((order, index) => {
//               return (  // Add the return statement here
//                   <div key={index} className="order-item">
//                       <img src={assets.parcel_icon} alt="" />
//                       <div>
//                           <p className='order-item-food'>
//                               {order.items.map((item, index) => {
//                                   if (index === order.items.length - 1) {
//                                       return item.name + " X " + item.quantity;
//                                   } else {
//                                       return item.name + " x " + item.quantity + ", ";
//                                   }
//                               })}
//                           </p>
//                           <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
//                           <div className="order-item-address">
//                               <p>{order.address.street + ", "}</p>
//                               <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
//                           </div>
//                           <p className="order-item-phone">Phone :{order.address.phone}</p>
//                       </div>
//                       <p>Items: {order.items.length}</p>
//                       <p>${order.amount}</p>
//                       <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
//                           <option value="Food Processing">Food Processing</option>
//                           <option value="Out for Delivery">Out for Delivery</option>
//                           <option value="Delivered">Delivered</option>
//                       </select>
//                   </div>
//               );
//           })}
//       </div>
//   </div>

export default Orders;