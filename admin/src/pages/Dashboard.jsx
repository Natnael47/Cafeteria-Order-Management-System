import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Dashboard = () => {

    const { token } = useContext(AdminContext);

    const [dashData, setDashData] = useState({ users: 0, orders: 0, latestOrders: [] });

    const getDashData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/admin/dashboard", { headers: { token } });
            if (response.data.success) {
                setDashData(response.data.data)
                //console.log(response.data.data);
            } else {
                toast.error("error");
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getDashData()
    }, [])

    return (
        <div className='m-5'>
            <p className="mb-3 text-lg font-semibold">DashBoard</p>
            <div className='flex flex-row gap-3'>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 border-2 rounded-md border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
                        <p className='text-gray-400'>Customers</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded-md border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.patients_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
                        <p className='text-gray-400'>Customers</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded-md border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
                    <img className='w-14' src={assets.order_icon} alt="" />
                    <div>
                        <p className='text-xl font-semibold text-gray-600'>{dashData.orders}</p>
                        <p className='text-gray-400'>Orders</p>
                    </div>
                </div>

            </div>

            <div className='bg-white w-full'>
                <div className='flex items-center gap-2.5 px-4 py-4 mt-7 rounded-t border'>
                    <img src={assets.order_icon} alt="" />
                    <p className='font-semibold'>Latest Orders</p>
                </div>
                <div className='pt-4 border border-t-0'>
                    {
                        dashData.latestOrders.map((item, index) => {
                            return (
                                <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-200' key={index}>
                                    <img className='w-15 rounded' src={assets.parcel_icon} alt="" />
                                    <div className='flex-1 text-sm'>
                                        <p className='mt-3 mb-2 font-medium'>{item.address.firstName + " " + item.address.lastName}</p>
                                        <p className='text-sm sm:text-[15px]'>Items : {item.items.length}</p>
                                        <p>Date : {new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row'>
                                            <p>Payment : </p>
                                            <p className={item.payment ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>_{item.payment ? "Done" : "Pending"}</p>
                                        </div>
                                        <p className='pt-3'>{item.status}</p>
                                    </div>

                                </div>
                            )

                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default Dashboard