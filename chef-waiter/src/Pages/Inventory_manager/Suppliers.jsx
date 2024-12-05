import { Pencil, Trash2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { InventoryContext } from "../../Context/InventoryContext";

const Suppliers = () => {
    const {
        supplierList,
        fetchSuppliers,
        addSupplier,
        updateSupplier,
        removeSupplier,
    } = useContext(InventoryContext);

    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup for adding supplier
    const [isEditOpen, setIsEditOpen] = useState(false); // State to toggle update form
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // State to manage removal modal
    const [selectedSupplier, setSelectedSupplier] = useState(null); // Selected supplier for edit or delete

    const [newSupplierData, setNewSupplierData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
    });

    const [editSupplierData, setEditSupplierData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "",
    });

    useEffect(() => {
        fetchSuppliers(); // Fetch suppliers when the component mounts
    }, []);

    // Handle form field changes for add/edit
    const handleChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        const updateState = isEdit ? setEditSupplierData : setNewSupplierData;
        updateState((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle adding a new supplier
    const handleAddSupplier = async () => {
        try {
            await addSupplier(newSupplierData, setNewSupplierData);
            setIsPopupOpen(false); // Close popup on success
            fetchSuppliers();
        } catch (error) {
            toast.error("Failed to add supplier");
        }
    };

    // Handle updating a supplier
    const handleUpdateSupplier = async () => {
        try {
            await updateSupplier(editSupplierData, fetchSuppliers, () =>
                setIsEditOpen(false)
            );
        } catch (error) {
            toast.error("Failed to update supplier");
        }
    };

    // Handle confirming removal
    const confirmRemoveSupplier = async () => {
        try {
            await removeSupplier(selectedSupplier.id, fetchSuppliers, () =>
                setIsRemoveModalOpen(false)
            );
        } catch (error) {
            toast.error("Failed to remove supplier");
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
                <div className="grid grid-cols-[2fr_2fr_2fr_2fr_1fr_1fr_1fr] bg-gray-200 border-b border-black font-medium text-gray-700">
                    <div className="px-4 py-2 border-r border-black">Supplier Name</div>
                    <div className="px-4 py-2 border-r border-black">Email</div>
                    <div className="px-4 py-2 border-r border-black">Phone</div>
                    <div className="px-4 py-2 border-r border-black">Address</div>
                    <div className="px-4 py-2 border-r border-black">Status</div>
                    <div className="px-4 py-2 border-r border-black text-center">Modify</div>
                    <div className="px-4 py-2 text-center">Remove</div>
                </div>

                {/* Data Rows */}
                {supplierList.length > 0 ? (
                    supplierList.map((supplier, index) => (
                        <div
                            key={supplier.id}
                            className={`grid grid-cols-[2fr_2fr_2fr_2fr_1fr_1fr_1fr] text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                } border-b border-black`}
                        >
                            <div className="px-4 py-2 border-r border-black">{supplier.name}</div>
                            <div className="px-4 py-2 border-r border-black">
                                {supplier.contactInfo?.email || "N/A"}
                            </div>
                            <div className="px-4 py-2 border-r border-black">
                                {supplier.contactInfo?.phone || "N/A"}
                            </div>
                            <div className="px-4 py-2 border-r border-black">
                                {supplier.contactInfo?.address || "N/A"}
                            </div>
                            <div className="px-4 py-2 border-r border-black">{supplier.status}</div>
                            <div className="px-4 py-2 border-r border-black text-center flex justify-center items-center">
                                <Pencil onClick={() => {
                                    setEditSupplierData({
                                        id: supplier.id,
                                        name: supplier.name,
                                        email: supplier.contactInfo?.email || "",
                                        phone: supplier.contactInfo?.phone || "",
                                        address: supplier.contactInfo?.address || "",
                                        status: supplier.status,
                                    });
                                    setIsEditOpen(true);
                                }} />
                            </div>
                            <div className="px-4 py-2 text-center flex justify-center items-center">
                                <Trash2 onClick={() => {
                                    setSelectedSupplier(supplier);
                                    setIsRemoveModalOpen(true);
                                }} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No suppliers found.</div>
                )}
            </div>

            {/* Add Supplier Modal */}
            {isPopupOpen && (
                <Modal
                    isOpen={isPopupOpen}
                    onRequestClose={() => setIsPopupOpen(false)}
                    className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Supplier</h2>
                    {/* Form */}
                    <input
                        type="text"
                        name="name"
                        value={newSupplierData.name}
                        onChange={handleChange}
                        placeholder="Supplier Name"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="email"
                        name="email"
                        value={newSupplierData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={newSupplierData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="text"
                        name="address"
                        value={newSupplierData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
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
                </Modal>
            )}

            {/* Edit Supplier Modal */}
            {isEditOpen && (
                <Modal
                    isOpen={isEditOpen}
                    onRequestClose={() => setIsEditOpen(false)}
                    className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Edit Supplier</h2>
                    {/* Form */}
                    <input
                        type="text"
                        name="name"
                        value={editSupplierData.name}
                        onChange={(e) => handleChange(e, true)}
                        placeholder="Supplier Name"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="email"
                        name="email"
                        value={editSupplierData.email}
                        onChange={(e) => handleChange(e, true)}
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={editSupplierData.phone}
                        onChange={(e) => handleChange(e, true)}
                        placeholder="Phone"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="text"
                        name="address"
                        value={editSupplierData.address}
                        onChange={(e) => handleChange(e, true)}
                        placeholder="Address"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <select
                        name="status"
                        value={editSupplierData.status}
                        onChange={(e) => handleChange(e, true)}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateSupplier}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Save
                        </button>
                    </div>
                </Modal>
            )}

            {/* Remove Supplier Confirmation Modal */}
            {isRemoveModalOpen && (
                <Modal
                    isOpen={isRemoveModalOpen}
                    onRequestClose={() => setIsRemoveModalOpen(false)}
                    className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Confirm Removal
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to remove supplier{" "}
                        <span className="font-semibold">{selectedSupplier?.name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setIsRemoveModalOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmRemoveSupplier}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Suppliers;
