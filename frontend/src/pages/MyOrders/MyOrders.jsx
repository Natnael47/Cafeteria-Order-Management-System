import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/Title';
import { StoreContext } from '../../context/StoreContext';
import './MyOrders.css';

const MyOrders = () => {

    const [orders, setOrders] = useState([]);
    const { url, token, backendUrl } = useContext(StoreContext);

    //  const fetchOrders = async () => {
    //      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
    //      setData(response.data.data);
    //  }

    const loadOrderData = async () => {
        try {
            if (!token) {
                return null
            }
            const response = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } })
            if (response.data.success) {
                let allOrdersItems = []
                // console.log(response.data.orders);
                response.data.orders.map((order) => {
                    order.items.map((item) => {
                        item['status'] = order.status
                        item['payment'] = order.payment
                        item['paymentMethod'] = order.paymentMethod
                        item['date'] = order.date
                        item['amount'] = order.amount
                        allOrdersItems.push(item)
                    })
                })
                setOrders(allOrdersItems.reverse())

            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            loadOrderData();
        }
    }, [token])

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>

            <div>
                {orders.map((order, index) => {
                    return (
                        <div key={index} className="py-4 border-t border-b text-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className='flex items-start gap-6 text-sm'>
                                <img className='w-16 sm:w-20' src={assets.parcel_icon} alt='Parcel Icon' />
                                <div>
                                    <p className='sm:text-base font-medium'>
                                        {order.name}
                                    </p>
                                    <div className='flex items-center gap-3 text-base text-gray-800'>
                                        <p className='text-lg'>${order.amount}.00</p>
                                        <p>Quantity : {order.quantity}</p>
                                        <p></p>
                                    </div>
                                    <p className='mt-1'>Date: <span className='text-gray-800'> {new Date(order.date).toDateString()} </span> </p>
                                    <p className='mt-1'>Payment: <span className='text-gray-800'> {order.paymentMethod} </span> </p>
                                </div>
                            </div>
                            <div className='md:w-1/2 flex justify-between'>
                                <div className='flex items-center gap-2'>
                                    <p className='min-w-2 h-2 rounded-full bg-green-600'></p>
                                    <p><b>{order.status}</b></p>
                                </div>
                                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    // return (
    //     <div className='my-orders'>
    //         <h2>My Orders</h2>
    //         <div className="container">
    //             {data.map((order, index) => {
    //                 return (
    //                     <div key={index} className="my-orders-order">
    //                         <img src={assets.parcel_icon} alt='' />
    //                         <p>{order.items.map((item, index) => {
    //                             if (index === order.items.length - 1) {
    //                                 return item.name + " X " + item.quantity
    //                             } else {
    //                                 return item.name + " X " + item.quantity + ", "
    //                             }
    //                         })}</p>
    //                         <p>${order.amount}.00</p>
    //                         <p>Items:{order.items.length}</p>
    //                         <p><span>&#x25cf;</span> <b>{order.status}</b></p>
    //                         <button onClick={fetchOrders}>Track Order</button>
    //                     </div>
    //                 )
    //             })}
    //         </div>
    //     </div>
    // )
}

export default MyOrders


//Local:   http://localhost:5174/ <---Frontend
//Local:   http://localhost:5173/ <---for Admin