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

            {/* Data Grid */}
            <div className="bg-white shadow border border-black rounded overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr_2fr] bg-gray-200 border-b border-black font-medium text-gray-700">
                    <div className="px-4 py-2 border-r border-black">Order Status</div>
                    <div className="px-4 py-2 border-r border-black">Inventory Item</div>
                    <div className="px-4 py-2 border-r border-black">Quantity</div>
                    <div className="px-4 py-2 border-r border-black">Unit</div>
                    <div className="px-4 py-2 border-r border-black">Price</div>
                    <div className="px-4 py-2 border-r border-black">Status</div>
                    <div className="px-4 py-2">Order Date</div>
                </div>

                {/* Data Rows */}
                {orderList.length > 0 ? (
                    orderList.map((order, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_1fr_2fr] text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-black`}
                        >
                            <div className="px-4 py-2 border-r border-black">{order.orderStatus}</div>
                            <div className="px-4 py-2 border-r border-black">{order.inventoryName}</div>
                            <div className="px-4 py-2 border-r border-black">
                                {order.quantityOrdered} {order.unit}
                            </div>
                            <div className="px-4 py-2 border-r border-black">{order.unit}</div>
                            <div className="px-4 py-2 border-r border-black">ETB {order.totalPrice}</div>
                            <div className="px-4 py-2 border-r border-black">
                                {order.inventoryStatus}%
                            </div>
                            <div className="px-4 py-2">
                                {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default InventoryOrders;
