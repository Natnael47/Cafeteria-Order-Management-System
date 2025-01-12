import axios from 'axios';
import 'chart.js/auto'; // Required for Chart.js
import { CheckCircle, Hourglass, ListOrdered, ShoppingBag, Timer } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { backendUrl } from '../../App';
import { ChefContext } from '../../Context/ChefContext';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const { cToken } = useContext(ChefContext);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/employee/chef-dashboard`, {
                headers: { cToken },
            });
            if (response.data.success) {
                setDashboardData(response.data.data);
                //console.log(response.data.data);
            } else {
                console.error('Error fetching Dashboard data');
            }
        } catch (error) {
            console.error('Fetch Dashboard Data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="m-5 w-full max-w-6.5xl max-h-[90vh]">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-5">Chef Dashboard</h1>

            {/* KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                {dashboardData && [
                    {
                        icon: <Timer size={24} color="#007BFF" />, // Icon for Average Prep Time
                        label: 'Average Prep Time',
                        value: `${dashboardData.averagePreparationTime} mins`,
                    },
                    {
                        icon: <CheckCircle size={24} color="#28A745" />, // Icon for Completed Orders
                        label: 'Completed Orders',
                        value: dashboardData.completedOrders,
                    },
                    {
                        icon: <Hourglass size={24} color="#FFC107" />, // Icon for Pending Orders
                        label: 'Pending Orders',
                        value: dashboardData.pendingOrders,
                    },
                    {
                        icon: <ShoppingBag size={24} color="#FF4F5A" />, // Icon for Total Orders
                        label: 'Total Orders',
                        value: dashboardData.totalOrders,
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    >
                        <div className="p-3 bg-[#F1FAF2] rounded-full">
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{item.value}</p>
                            <p className="text-gray-500">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback and Top-Selling Items Table */}
            <div className="bg-white rounded-lg shadow-lg p-5 max-h-[73vh] overflow-y-scroll">
                {/* Top-Selling Items Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2.5 px-6 py-4 bg-[#22C55E] text-white rounded-t-lg">
                        <ListOrdered size={24} />
                        <p className="font-semibold text-lg">Top-Selling Items</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-gray-700 font-medium border-b border-gray-200">Name</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-medium border-b border-gray-200">Category</th>
                                    <th className="px-6 py-3 text-left text-gray-700 font-medium border-b border-gray-200">Items Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboardData?.topSellingItems.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.category}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Feedback Section */}
                <div>
                    <div className="flex items-center gap-2.5 px-6 py-4 bg-[#3B82F6] text-white rounded-t-lg">
                        <ListOrdered size={24} />
                        <p className="font-semibold text-lg">Recent Feedback</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50">
                        {dashboardData?.recentFeedback.map((feedback, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                            >
                                <p className="font-medium text-gray-800 mb-2">{feedback.comment}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="px-2 py-1 bg-[#F3F4F6] text-gray-700 rounded-full font-semibold">
                                        Rating: {feedback.rating}
                                    </span>
                                    <span>|</span>
                                    <span>{new Date(feedback.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
