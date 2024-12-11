import { CircleUserRound, ListOrdered, ShoppingBag, Soup, Users } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Dashboard = () => {
    const { dashboardData: dashData, getDashData } = useContext(AdminContext);

    useEffect(() => {
        getDashData();
    }, [getDashData]);

    const iconSize = 50;
    const iconColor = '#22C55E';

    return (
        <div className="m-5 w-full max-w-6.5xl max-h-[90vh]">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                {[
                    { icon: <CircleUserRound size={iconSize} color={iconColor} />, label: 'Customers', value: dashData.users },
                    { icon: <ShoppingBag size={iconSize} color={iconColor} />, label: 'Orders', value: dashData.totalOrders },
                    { icon: <Users size={iconSize} color={iconColor} />, label: 'Employees', value: dashData.employees },
                    { icon: <Soup size={iconSize} color={iconColor} />, label: 'Foods', value: dashData.totalFoods },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        <div className="p-3 bg-[#F1FAF2] rounded-full">{item.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{item.value}</p>
                            <p className="text-gray-500">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Latest Orders Section */}
            <div className="rounded-lg shadow-lg max-h-[71vh] overflow-scroll">
                <div className="flex items-center gap-2.5 px-6 py-4 bg-[#22C55E] text-white rounded-t-lg">
                    <ListOrdered size={24} />
                    <p className="font-semibold text-lg">Latest Orders</p>
                </div>
                <div className="divide-y divide-gray-200">
                    {dashData.latestOrders.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors"
                        >
                            <img
                                className="w-16 h-16 rounded-full object-cover"
                                src={assets.parcel_icon}
                                alt="Order Icon"
                            />
                            <div className="flex-1 text-sm">
                                <p className="font-medium text-gray-700">
                                    {item.address.firstName} {item.address.lastName}
                                </p>
                                <p className="text-gray-500">Items: {item.items.length}</p>
                                <p className="text-gray-500">
                                    Date: {new Date(item.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p
                                    className={`font-semibold ${item.payment ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    Payment: {item.payment ? 'Done' : 'Pending'}
                                </p>
                                <p className="mt-2 text-gray-500">{item.status}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Feedback Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Feedback</h2>
                    <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-[#22C55E] text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Comment</th>
                                <th className="py-3 px-4 text-left">Rating</th>
                                <th className="py-3 px-4 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashData.recentFeedback.map((feedback, index) => (
                                <tr
                                    key={index}
                                    className={`border-b border-gray-200 ${feedback.rating <= 2 ? 'bg-red-100' : 'bg-white'
                                        } hover:bg-gray-50`}
                                >
                                    <td className="py-4 px-4 text-gray-700 font-medium">{feedback.comment}</td>
                                    <td className="py-4 px-4 text-gray-700">{feedback.rating} / 5</td>
                                    <td className="py-4 px-4 text-gray-500">
                                        {new Date(feedback.date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* KPI Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-5 mt-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Performance Indicators (KPIs)</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{dashData.kpis.customerRetentionRate}%</p>
                            <p className="text-gray-500">Customer Retention</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{dashData.kpis.averageFulfillmentTime} min</p>
                            <p className="text-gray-500">Fulfillment Time</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{dashData.kpis.paymentCompletionRate}%</p>
                            <p className="text-gray-500">Payment Completion</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{dashData.kpis.employeeEfficiency}</p>
                            <p className="text-gray-500">Tasks/Shift</p>
                        </div>
                    </div>
                </div>

                {/* Top Selling Items Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Top-Selling Items</h2>
                    <div className="relative w-full h-64">
                        <div className="absolute inset-0 flex flex-col justify-end gap-4">
                            {dashData.topSellingItems.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    <span className="w-1/4 text-gray-700 font-medium truncate">{item.name}</span>
                                    <div className="w-3/4 h-6 bg-gray-200 rounded-lg overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${(item._count.foodId / dashData.topSellingItems[0]._count.foodId) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="ml-4 text-gray-500">{item._count.foodId} orders</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
