import axios from 'axios';
import 'chart.js/auto'; // Required for Chart.js
import { ArrowDownUp, ChartNoAxesCombined, ChartPie, CircleDollarSign, List, ShieldQuestion, ShoppingBag } from 'lucide-react';
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

    const { KPIs, graphs, requestsAndWithdrawals, latestUpdatedItems, supplierPerformance } = dashboardData;

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

    // Create a map of supplierId to supplierName
    const supplierMap = supplierPerformance.reduce((acc, supplier) => {
        acc[supplier.id] = supplier.name;
        return acc;
    }, {});

    // Prepare the data for the expenditure by supplier chart
    const expenditureBySupplierData = {
        labels: graphs.expenditureBySupplier.map((item) =>
            supplierMap[item.supplierId] || `Supplier ${item.supplierId}` // Use the name or default to Supplier ID
        ),
        datasets: [
            {
                label: 'Expenditure by Supplier',
                data: graphs.expenditureBySupplier.map((item) => item._sum.cost),
                backgroundColor: '#FF9F40',
            },
        ],
    };

    return (
        <div className="m-5 w-full max-w-6.5xl max-h-[90vh]">
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

            <div className='bg-white rounded-lg shadow-lg max-h-[73vh] overflow-scroll'>
                {/* Inventory Overview Section */}
                <div className="mb-5 bg-gradient-to-r from-gray-50 to-white shadow-lg rounded-xl overflow-hidden p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Inventory Overview</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-blue-600 text-white">
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
                                {inventoryItems.map((item, index) => {
                                    const expiryDate = new Date(item.expiryDate);
                                    const today = new Date();
                                    const timeDiff = expiryDate - today;
                                    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                                    const monthsLeft = Math.floor(daysLeft / 30);
                                    const yearsLeft = Math.floor(daysLeft / 365);

                                    const isCloseToExpiry = daysLeft <= 30; // Highlight if less than 30 days left
                                    const timeLeft =
                                        yearsLeft > 0
                                            ? `${yearsLeft} year${yearsLeft > 1 ? 's' : ''} left`
                                            : monthsLeft > 0
                                                ? `${monthsLeft} month${monthsLeft > 1 ? 's' : ''} left`
                                                : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;

                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition duration-300">
                                            <td className="px-6 py-4 font-medium text-gray-700">{item.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.category}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                                            <td className="px-6 py-4 text-gray-600">{item.unit}</td>
                                            <td className="px-6 py-4 text-gray-600">Etb. {item.pricePerUnit}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${item.status === 'In Stock'
                                                        ? 'bg-green-100 text-green-700'
                                                        : item.status === 'Low Stock'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {item.status} %
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-sm font-semibold ${isCloseToExpiry
                                                        ? 'text-red-600 font-bold'
                                                        : 'text-gray-600'
                                                        }`}
                                                >
                                                    {expiryDate.toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })} ({timeLeft})
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="text-center mt-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
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
                                <span className="mr-2"><List /></span> Pending Requests
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
                                <span className="mr-2"><ChartPie /></span> Inventory by Category
                            </h2>
                            <div className="h-80 flex items-center justify-center">
                                <Pie
                                    data={inventoryByCategoryData}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: {
                                                    color: '#1F2937', // Darker modern color
                                                    font: {
                                                        size: 16, // Slightly larger text for better readability
                                                        weight: 'bold', // Bold font for a modern look
                                                        family: 'Inter, sans-serif', // A clean modern font
                                                    },
                                                    padding: 20, // Add padding between legend items
                                                    boxWidth: 20, // Larger colored boxes for better visibility
                                                },
                                            },
                                            tooltip: {
                                                backgroundColor: '#111827', // Dark background for tooltips
                                                titleColor: '#F9FAFB', // White text for tooltip titles
                                                bodyColor: '#D1D5DB', // Light gray for body text
                                                titleFont: { size: 16, weight: 'bold' },
                                                bodyFont: { size: 14 },
                                                padding: 12, // Comfortable padding inside tooltips
                                                boxPadding: 6, // Padding around the tooltip box
                                                displayColors: true, // Show color indicators
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        responsive: true,
                                        layout: {
                                            padding: 10, // Adds padding inside the chart for a cleaner layout
                                        },
                                        borderWidth: 2, // Adds borders to the pie slices for better separation
                                        elements: {
                                            arc: {
                                                borderWidth: 2,
                                                hoverBorderWidth: 4, // Thicker borders on hover for a polished look
                                            },
                                        },
                                    }}
                                />

                            </div>
                        </div>
                    </div>

                    {/* Stock Trends and Expenditure by Supplier Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Stock Trends Line Chart */}
                        <div className="p-6 bg-white shadow-xl rounded-lg transition-transform hover:scale-105 hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-black mb-4 flex items-center">
                                <span className="mr-3 text-black">
                                    <ChartNoAxesCombined />
                                </span>
                                Stock Trends
                            </h2>
                            <div className="h-80 bg-white rounded-lg p-4">
                                <Line
                                    data={{
                                        ...stockTrendsData,
                                        labels: stockTrendsData.labels.map(date =>
                                            new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                        ), // Convert dates to a readable format
                                    }}
                                    options={{
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                                ticks: { color: '#6B7280', font: { size: 12 } },
                                            },
                                            y: {
                                                ticks: { color: '#6B7280', font: { size: 12 } },
                                                grid: {
                                                    color: '#E5E7EB',
                                                    borderDash: [5, 5],
                                                },
                                            },
                                        },
                                        plugins: {
                                            legend: {
                                                display: true,
                                                labels: {
                                                    color: '#374151',
                                                    font: { size: 14 },
                                                },
                                            },
                                            tooltip: {
                                                backgroundColor: '#4B5563',
                                                titleColor: '#FFFFFF',
                                                bodyColor: '#FFFFFF',
                                                cornerRadius: 8,
                                                padding: 12,
                                            },
                                        },
                                        maintainAspectRatio: false,
                                        elements: {
                                            line: {
                                                tension: 0.5,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Expenditure by Supplier Bar Chart */}
                        <div className="p-6 bg-white shadow-xl rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center justify-between">
                                <span className="flex items-center">
                                    <CircleDollarSign className="text-green-500 w-8 h-8 mr-3" />
                                    Expenditure by Supplier
                                </span>
                            </h2>
                            <div className="h-80">
                                <Bar
                                    data={{
                                        ...expenditureBySupplierData,
                                        datasets: [
                                            {
                                                ...expenditureBySupplierData.datasets[0],
                                                backgroundColor: expenditureBySupplierData.labels.map(
                                                    (_, idx) =>
                                                        `hsl(${(idx * 360) / expenditureBySupplierData.labels.length}, 70%, 60%)`
                                                ),
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                                labels: {
                                                    color: '#374151',
                                                    font: { size: 14, family: 'Poppins' },
                                                },
                                            },
                                            tooltip: {
                                                backgroundColor: '#374151',
                                                titleColor: '#F9FAFB',
                                                bodyColor: '#F9FAFB',
                                            },
                                        },
                                        scales: {
                                            x: {
                                                grid: { display: false },
                                                ticks: {
                                                    color: '#374151',
                                                    font: { size: 12, family: 'Poppins' },
                                                },
                                            },
                                            y: {
                                                grid: {
                                                    color: '#E5E7EB',
                                                    borderDash: [5, 5],
                                                },
                                                ticks: {
                                                    color: '#374151',
                                                    font: { size: 12, family: 'Poppins' },
                                                },
                                            },
                                        },
                                        maintainAspectRatio: false,
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
