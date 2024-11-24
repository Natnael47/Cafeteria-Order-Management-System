import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import { InventoryContext } from '../../Context/InventoryContext';

const InventoryOrders = () => {
    const { orderList, fetchInventoryOrders, supplierList, fetchSuppliers, iToken } = useContext(InventoryContext);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newPackageData, setNewPackageData] = useState({
        name: '',
        description: '',
        supplierId: '', // Only supplierId will be stored and sent
    });

    useEffect(() => {
        fetchInventoryOrders();
        fetchSuppliers(); // Fetch the suppliers list
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPackageData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPackage = async () => {
        const { name, description, supplierId } = newPackageData;

        // Ensure supplierId is an integer
        const supplierIdInt = parseInt(supplierId, 10);

        if (!supplierId || !name || !description) {
            toast.error('Please fill in all fields and select a valid supplier.');
            return;
        }

        const packageData = {
            name,
            description,
            supplierId: supplierIdInt, // Send the supplierId as an integer
        };

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/new-package`,
                packageData,
                { headers: { iToken } }
            );

            if (response.data.success) {
                toast.success('Package added successfully');
                fetchInventoryOrders(); // Refresh the inventory orders list
                setIsPopupOpen(false); // Close the modal
            } else {
                toast.error(response.data.message || 'Failed to add package');
            }
        } catch (error) {
            console.error('Error adding package:', error);
            toast.error('Failed to add package. Please try again.');
        }
    };


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
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 rounded px-4 py-2"
                    />
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        New Package
                    </button>
                </div>
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

            {/* Add Package Modal */}
            {isPopupOpen && (
                <Modal
                    isOpen={isPopupOpen}
                    onRequestClose={() => setIsPopupOpen(false)}
                    className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Package</h2>
                    <input
                        type="text"
                        name="name"
                        value={newPackageData.name}
                        onChange={handleChange}
                        placeholder="Package Name"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="text"
                        name="description"
                        value={newPackageData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <select
                        name="supplierId"
                        value={newPackageData.supplierId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    >
                        <option value="">Select Supplier</option>
                        {supplierList.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddPackage}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add Package
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default InventoryOrders;
