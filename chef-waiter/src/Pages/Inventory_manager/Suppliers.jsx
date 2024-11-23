import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { InventoryContext } from '../../Context/InventoryContext';

const Suppliers = () => {
    const { supplierList, fetchSuppliers, addSupplier } = useContext(InventoryContext);

    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
    const [newSupplierData, setNewSupplierData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
    });

    useEffect(() => {
        fetchSuppliers(); // Fetch suppliers when the component mounts
    }, []);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSupplierData({ ...newSupplierData, [name]: value });
    };

    // Handle adding a new supplier
    const handleAddSupplier = async () => {
        try {
            await addSupplier(newSupplierData, setNewSupplierData);
            setIsPopupOpen(false); // Close the popup on success
            fetchSuppliers(); // Refresh supplier list
        } catch (error) {
            toast.error("Failed to add supplier");
        }
    };

    return (
        <div className="flex flex-col m-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Suppliers</h1>
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
                        New
                    </button>
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white shadow border border-black rounded overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[2fr_2fr_2fr_2fr_1fr] bg-gray-200 border-b border-black font-medium text-gray-700">
                    <div className="px-4 py-2 border-r border-black">Supplier Name</div>
                    <div className="px-4 py-2 border-r border-black">Email</div>
                    <div className="px-4 py-2 border-r border-black">Phone</div>
                    <div className="px-4 py-2 border-r border-black">Address</div>
                    <div className="px-4 py-2">Status</div>
                </div>

                {/* Data Rows */}
                {supplierList.length > 0 ? (
                    supplierList.map((supplier, index) => (
                        <div
                            key={supplier.id}
                            className={`grid grid-cols-[2fr_2fr_2fr_2fr_1fr] text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                } border-b border-black`}
                        >
                            <div className="px-4 py-2 border-r border-black">{supplier.name}</div>
                            <div className="px-4 py-2 border-r border-black">
                                {supplier.contactInfo?.email || 'N/A'}
                            </div>
                            <div className="px-4 py-2 border-r border-black">
                                {supplier.contactInfo?.phone || 'N/A'}
                            </div>
                            <div className="px-4 py-2 border-r border-black">
                                {supplier.contactInfo?.address || 'N/A'}
                            </div>
                            <div className="px-4 py-2">{supplier.status}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No suppliers found.</div>
                )}
            </div>

            {/* Popup for Adding Supplier */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            Add New Supplier
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={newSupplierData.name}
                                onChange={handleChange}
                                placeholder="Supplier Name"
                                className="w-full border border-gray-300 rounded px-4 py-2"
                            />
                            <input
                                type="email"
                                name="email"
                                value={newSupplierData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full border border-gray-300 rounded px-4 py-2"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={newSupplierData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="w-full border border-gray-300 rounded px-4 py-2"
                            />
                            <input
                                type="text"
                                name="address"
                                value={newSupplierData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="w-full border border-gray-300 rounded px-4 py-2"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSupplier}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;