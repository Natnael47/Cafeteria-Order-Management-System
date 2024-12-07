import { CircleUserRound, ListOrdered, ShoppingBag, Soup, Users } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const Dashboard = () => {
    const { dashboardData: dashData, getDashData } = useContext(AdminContext);

    useEffect(() => {
        getDashData();
    }, [getDashData]);

    const iconSize = 50; // Adjust icon size
    const iconColor = '#22C55E'; // Use a consistent primary color for icons

    return (
        <div className="m-5 w-full max-w-6.5xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-5">Dashboard</h1>

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
            <div className="bg-white rounded-lg shadow-lg max-h-[67vh] overflow-scroll">
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
                                    className={`font-semibold ${item.payment ? 'text-green-500' : 'text-red-500'
                                        }`}
                                >
                                    Payment: {item.payment ? 'Done' : 'Pending'}
                                </p>
                                <p className="mt-2 text-gray-500">{item.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
