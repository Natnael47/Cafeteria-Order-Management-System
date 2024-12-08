import axios from 'axios';
import 'chart.js/auto'; // Required for Chart.js
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
            <div className="grid grid-cols-4 gap-4 mb-5">
                <div className="p-4 bg-blue-100 rounded shadow">
                    <p className="text-sm font-semibold">Total Items</p>
                    <p className="text-2xl text-blue-700">{KPIs.totalItems || 0}</p>
                </div>
                <div className="p-4 bg-red-100 rounded shadow">
                    <p className="text-sm font-semibold">Low Stock Items</p>
                    <p className="text-2xl text-red-700">{KPIs.lowStockItems || 0}</p>
                </div>
                <div className="p-4 bg-green-100 rounded shadow">
                    <p className="text-sm font-semibold">Requests Processed</p>
                    <p className="text-2xl text-green-700">{KPIs.totalRequestsProcessed || 0}</p>
                </div>
                <div className="p-4 bg-yellow-100 rounded shadow">
                    <p className="text-sm font-semibold">Total Inventory Value</p>
                    <p className="text-2xl text-yellow-700">Rs. {KPIs.totalInventoryValue || 0}</p>
                </div>
            </div>

            {/* Inventory Overview Section */}
            <div className="mb-5 bg-white shadow rounded p-5">
                <h2 className="text-lg font-semibold mb-4">Inventory Overview</h2>
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Item Name</th>
                            <th className="px-4 py-2">Category</th>
                            <th className="px-4 py-2">Quantity</th>
                            <th className="px-4 py-2">Unit</th>
                            <th className="px-4 py-2">Price/Unit</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Expiry Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{item.name}</td>
                                <td className="border px-4 py-2">{item.category}</td>
                                <td className="border px-4 py-2">{item.quantity}</td>
                                <td className="border px-4 py-2">{item.unit}</td>
                                <td className="border px-4 py-2">Rs. {item.pricePerUnit}</td>
                                <td className="border px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded ${item.status === 'In Stock'
                                            ? 'bg-green-100 text-green-700'
                                            : item.status === 'Low Stock'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="border px-4 py-2">{item.expiryDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="text-center mt-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                        onClick={() => setShowAllInventory(!showAllInventory)}
                    >
                        {showAllInventory ? 'Show Latest 6' : 'Show All'}
                    </button>
                </div>
            </div>

            {/* Pending Requests Section */}
            <div className="mb-5 p-5 bg-white shadow rounded">
                <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Requester</th>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requestsAndWithdrawals.pendingRequests.map((req, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{`${req.employee.firstName} ${req.employee.lastName}`}</td>
                                <td className="border px-4 py-2">{req.inventory.name}</td>
                                <td className="border px-4 py-2">{req.inventory.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Inventory by Category</h2>
                    <Pie data={inventoryByCategoryData} />
                </div>
                <div className="p-5 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Stock Trends</h2>
                    <Line data={stockTrendsData} />
                </div>
                <div className="p-5 bg-white shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Expenditure by Supplier</h2>
                    <Bar data={expenditureBySupplierData} />
                </div>
            </div>
        </div>
    );
};

export default Inventory_Dashboard;
