import axios from 'axios';
import 'chart.js/auto'; // Required for Chart.js
import { ArrowDownUp, CircleDollarSign, ShieldQuestion, ShoppingBag } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { backendUrl } from '../../App';
import { InventoryContext } from '../../Context/InventoryContext';

const Inventory_Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [showAllInventory, setShowAllInventory] = useState(false); // Toggle for inventory view
    const { iToken } = useContext(InventoryContext);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/inventory-dashboard`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setDashboardData(response.data.data);
            } else {
                console.error('Error fetching Dashboard data');
            }
        } catch (error) {
            console.error('Fetch inventory Dashboard Data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (!dashboardData) {
        return <div>Loading...</div>;
    }

    const { KPIs, graphs, requestsAndWithdrawals, latestUpdatedItems } = dashboardData;

    const inventoryItems = showAllInventory
        ? dashboardData.inventoryOverview
        : latestUpdatedItems;

    // Chart data preparation
    const inventoryByCategoryData = {
        labels: graphs.inventoryByCategory.map((item) => item.category),
        datasets: [
            {
                data: graphs.inventoryByCategory.map((item) => item._count.id),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    const stockTrendsData = {
        labels: graphs.stockTrends.map((item) => item.dateUpdated),
        datasets: [
            {
                label: 'Stock Trends',
                data: graphs.stockTrends.map((item) => item._sum.quantity),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const expenditureBySupplierData = {
        labels: graphs.expenditureBySupplier.map((item) => item.supplierId),
        datasets: [
            {
                label: 'Expenditure by Supplier',
                data: graphs.expenditureBySupplier.map((item) => item._sum.cost),
                backgroundColor: '#FF9F40',
            },
        ],
    };

    return (
        <div className="m-5 w-full max-w-6.5xl">
            {/* Header */}
            <h1 className="text-2xl font-bold mb-5">Inventory Dashboard</h1>

            {/* KPI Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
                {[
                    { icon: <ShoppingBag size={24} color="#007BFF" />, label: 'Total Items', value: KPIs.totalItems || 0, bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
                    { icon: <ArrowDownUp size={24} color="#FF4F5A" />, label: 'Low Stock Items', value: KPIs.lowStockItems || 0, bgColor: 'bg-red-100', textColor: 'text-red-700' },
                    { icon: <ShieldQuestion size={24} color="#28A745" />, label: 'Requests Processed', value: KPIs.totalRequestsProcessed || 0, bgColor: 'bg-green-100', textColor: 'text-green-700' },
                    { icon: <CircleDollarSign size={24} color="#FFC107" />, label: 'Total Inventory Value', value: `Etb. ${(KPIs.totalInventoryValue || 0).toLocaleString()}`, bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' }

                ].map((item, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 ${item.bgColor} p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105`}
                    >
                        <div className="p-3 bg-white rounded-full">
                            {item.icon}
                        </div>
                        <div>
                            <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
                            <p className="text-gray-500">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-white rounded-lg shadow-lg max-h-[72vh] overflow-scroll'>
                {/* Inventory Overview Section */}
                <div className="mb-5 bg-white shadow-lg rounded-lg overflow-hidden p-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-700">Inventory Overview</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                                    <th className="px-6 py-3">Item Name</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Quantity</th>
                                    <th className="px-6 py-3">Unit</th>
                                    <th className="px-6 py-3">Price/Unit</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {inventoryItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition duration-300">
                                        <td className="px-6 py-4 font-medium text-gray-700">{item.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                                        <td className="px-6 py-4 text-gray-600">Rs. {item.pricePerUnit}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${item.status === 'In Stock'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.status === 'Low Stock'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{item.expiryDate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                            onClick={() => setShowAllInventory(!showAllInventory)}
                        >
                            {showAllInventory ? 'Show Latest 6' : 'Show All'}
                        </button>
                    </div>
                </div>

                {/* Main Container for All Sections */}
                <div className="grid grid-cols-1 gap-6 p-6 bg-gray-50 rounded-lg shadow-md">

                    {/* Pending Requests and Inventory by Category Side-by-Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Pending Requests Section */}
                        <div className="p-6 bg-white shadow-lg rounded-lg transition-transform hover:scale-105">
                            <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                                <span className="mr-2">📋</span> Pending Requests
                            </h2>
                            <div className="overflow-auto max-h-80">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-blue-500 to-blue-400 text-white">
                                            <th className="px-4 py-2 text-left uppercase text-sm tracking-wider">Requester</th>
                                            <th className="px-4 py-2 text-left uppercase text-sm tracking-wider">Item</th>
                                            <th className="px-4 py-2 text-left uppercase text-sm tracking-wider">Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requestsAndWithdrawals.pendingRequests.map((req, index) => (
                                            <tr key={index} className="border-b transition-all hover:bg-blue-50 even:bg-gray-50">
                                                <td className="px-4 py-2 text-gray-700 text-sm">{`${req.employee.firstName} ${req.employee.lastName}`}</td>
                                                <td className="px-4 py-2 text-gray-700 text-sm">{req.inventory.name}</td>
                                                <td className="px-4 py-2 text-gray-700 font-semibold text-sm">{req.inventory.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Inventory by Category Chart */}
                        <div className="p-6 bg-white shadow-lg rounded-lg transition-transform hover:scale-105">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">📊</span> Inventory by Category
                            </h2>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
                                    data={inventoryByCategoryData}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    color: '#4B5563',
                                                    font: { size: 14 }
                                                }
                                            }
                                        },
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock Trends and Expenditure by Supplier Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Stock Trends Line Chart */}
                        <div className="p-6 bg-white shadow-lg rounded-lg transition-transform hover:scale-105">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">📈</span> Stock Trends
                            </h2>
                            <div className="h-80">
                                <Line
                                    data={stockTrendsData}
                                    options={{
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                                ticks: { color: '#4B5563' }
                                            },
                                            y: {
                                                ticks: { color: '#4B5563' }
                                            }
                                        },
                                        plugins: {
                                            legend: {
                                                display: false
                                            }
                                        },
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>

                        {/* Expenditure by Supplier Bar Chart */}
                        <div className="p-6 bg-white shadow-lg rounded-lg transition-transform hover:scale-105">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                                <span className="mr-2">💰</span> Expenditure by Supplier
                            </h2>
                            <div className="h-80">
                                <Bar
                                    data={expenditureBySupplierData}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                                labels: { color: '#4B5563' }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: { color: '#4B5563' }
                                            },
                                            y: {
                                                ticks: { color: '#4B5563' }
                                            }
                                        },
                                        maintainAspectRatio: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Inventory_Dashboard;
