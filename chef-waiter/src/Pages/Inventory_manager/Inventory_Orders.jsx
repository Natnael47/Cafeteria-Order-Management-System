import React, { useContext, useEffect } from 'react';
import { InventoryContext } from '../../Context/InventoryContext';

const InventoryOrders = () => {
    const { orderList, fetchInventoryOrders } = useContext(InventoryContext);

    useEffect(() => {
        fetchInventoryOrders();
    }, []);

    return (
        <div className="flex flex-col m-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Inventory Orders</h1>
            </div>

            {/* Search and Show */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700">Show</label>
                    <select className="border border-gray-300 rounded px-2 py-1">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <label className="text-gray-700">entries</label>
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-gray-300 rounded px-4 py-2"
                />
            </div>

            {/* Data Table */}
            <div className="bg-white shadow rounded">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Order Status</th>
                            <th className="px-4 py-2 border">Inventory Item</th>
                            <th className="px-4 py-2 border">Quantity</th>
                            <th className="px-4 py-2 border">Unit</th>
                            <th className="px-4 py-2 border">Price</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Order Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.length > 0 ? (
                            orderList.map((order, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                                >
                                    <td className="px-4 py-2 border">{order.orderStatus}</td>
                                    <td className="px-4 py-2 border">{order.inventoryName}</td>
                                    <td className="px-4 py-2 border">
                                        {order.quantityOrdered} {order.unit}
                                    </td>
                                    <td className="px-4 py-2 border">{order.unit}</td>
                                    <td className="px-4 py-2 border">ETB {order.totalPrice}</td>
                                    <td className="px-4 py-2 border">
                                        {order.inventoryStatus}%
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryOrders;
