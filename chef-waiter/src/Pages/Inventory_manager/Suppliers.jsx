import { Pencil, Trash2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import SortingDropdown from '../../Components/SortingDropdown';
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
    const [entriesPerPage, setEntriesPerPage] = useState(0); // Default to showing all entries
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAttribute, setSortAttribute] = useState('name');  // Default sort by name
    const [sortOrder, setSortOrder] = useState('ascending');     // Default ascending

    const handleEntriesChange = (e) => {
        setEntriesPerPage(parseInt(e.target.value, 10)); // Update the state with the selected value
    };
    const displayedSuppliers = entriesPerPage === 0 ? supplierList : supplierList.slice(0, entriesPerPage);

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

    const handleSortChange = (attribute, order) => {
        setSortAttribute(attribute);
        setSortOrder(order);
        // Save the selected sorting state to localStorage
        localStorage.setItem('sortAttribute', attribute);
        localStorage.setItem('sortOrder', order);
    };

    return (
        <div className="flex flex-col m-5 w-full max-w-6.5xl">
            {/* Header */}
            <div className="flex flex-col space-y-2 mb-2">
                {/* Top Section: Title and Buttons */}
                <div className="flex items-center justify-between h-[10vh]">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Suppliers</h1>
                    <div className="flex items-center space-x-3">
                        {/* New Inventory Button */}
                        <button
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition"
                            onClick={() => setIsPopupOpen(true)}
                        >
                            + New
                        </button>
                        {/* Icon Button */}
                        <button className="p-2 bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-gray-200 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Middle Section: Search and Entries */}
                <div className="flex items-center justify-between">
                    {/* Entries Dropdown */}
                    <div className="flex items-center space-x-2 text-sm">
                        <label className="font-medium text-gray-700">Show</label>
                        <select className="border border-gray-300 rounded px-3 py-1.5 focus:ring focus:ring-gray-200">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <label className="font-medium text-gray-700">entries</label>
                    </div>
                    {/* Sorting  & search */}
                    <div className="flex items-center justify-end gap-5">
                        <SortingDropdown onSortChange={handleSortChange} />
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search by item name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 shadow-sm focus:ring focus:ring-gray-200"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 rounded-lg w-full max-w-full max-h-[77vh] overflow-scroll shadow-lg">
                {/* Data Grid */}
                <div className="bg-white shadow-lg border border-gray-300 rounded-lg overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-[2fr_2fr_2fr_2fr_1fr_1fr_1fr] bg-gray-100 border-b border-gray-300 font-semibold text-gray-800">
                        <div className="px-6 py-3 border-r border-gray-300 text-left">Supplier Name</div>
                        <div className="px-6 py-3 border-r border-gray-300 text-left">Email</div>
                        <div className="px-6 py-3 border-r border-gray-300 text-left">Phone</div>
                        <div className="px-6 py-3 border-r border-gray-300 text-left">Address</div>
                        <div className="px-6 py-3 border-r border-gray-300 text-center">Status</div>
                        <div className="px-6 py-3 border-r border-gray-300 text-center">Modify</div>
                        <div className="px-6 py-3 text-center">Remove</div>
                    </div>

                    {/* Data Rows */}
                    {displayedSuppliers.length > 0 ? (
                        displayedSuppliers.map((supplier, index) => (
                            <div
                                key={supplier.id}
                                className={`grid grid-cols-[2fr_2fr_2fr_2fr_1fr_1fr_1fr] text-sm ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    } border-b border-gray-300 hover:bg-blue-50`}
                            >
                                <div className="px-6 py-3 border-r border-gray-300">{supplier.name}</div>
                                <div className="px-6 py-3 border-r border-gray-300">
                                    {supplier.contactInfo?.email || <span className="italic text-gray-500">N/A</span>}
                                </div>
                                <div className="px-6 py-3 border-r border-gray-300">
                                    {supplier.contactInfo?.phone || <span className="italic text-gray-500">N/A</span>}
                                </div>
                                <div className="px-6 py-3 border-r border-gray-300">
                                    {supplier.contactInfo?.address || <span className="italic text-gray-500">N/A</span>}
                                </div>
                                <div className="px-6 py-3 border-r border-gray-300 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${supplier.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {supplier.status}
                                    </span>
                                </div>
                                <div className="px-6 py-3 border-r border-gray-300 text-center flex justify-center items-center">
                                    <Pencil
                                        className="text-blue-500 cursor-pointer hover:text-blue-700"
                                        onClick={() => {
                                            setEditSupplierData({
                                                id: supplier.id,
                                                name: supplier.name,
                                                email: supplier.contactInfo?.email || "",
                                                phone: supplier.contactInfo?.phone || "",
                                                address: supplier.contactInfo?.address || "",
                                                status: supplier.status,
                                            });
                                            setIsEditOpen(true);
                                        }}
                                    />
                                </div>
                                <div className="px-6 py-3 text-center flex justify-center items-center">
                                    <Trash2
                                        className="text-red-500 cursor-pointer hover:text-red-700"
                                        onClick={() => {
                                            setSelectedSupplier(supplier);
                                            setIsRemoveModalOpen(true);
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-6 italic">No suppliers found.</div>
                    )}
                </div>
            </div>

            {/* Add Supplier Modal */}
            {isPopupOpen && (
                <Modal
                    isOpen={isPopupOpen}
                    onRequestClose={() => setIsPopupOpen(false)}
                    className="bg-white p-8 rounded-lg shadow-xl w-[90%] max-w-lg mx-auto mt-20 animate-fadeIn"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Supplier</h2>

                    {/* Form */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={newSupplierData.name}
                            onChange={handleChange}
                            placeholder="Supplier Name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            name="email"
                            value={newSupplierData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={newSupplierData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            name="address"
                            value={newSupplierData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSupplier}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Add Supplier
                        </button>
                    </div>
                </Modal>
            )}

            {/* Edit Supplier Modal */}
            {isEditOpen && (
                <Modal
                    isOpen={isEditOpen}
                    onRequestClose={() => setIsEditOpen(false)}
                    className="bg-white p-8 rounded-lg shadow-xl w-[90%] max-w-lg mx-auto mt-20 animate-fadeIn"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Supplier</h2>

                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                                Supplier Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={editSupplierData.name}
                                onChange={(e) => handleChange(e, true)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={editSupplierData.email}
                                onChange={(e) => handleChange(e, true)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
                                Phone
                            </label>
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                value={editSupplierData.phone}
                                onChange={(e) => handleChange(e, true)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
                                Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={editSupplierData.address}
                                onChange={(e) => handleChange(e, true)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={editSupplierData.status}
                                onChange={(e) => handleChange(e, true)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={() => setIsEditOpen(false)}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdateSupplier}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Save Changes
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
