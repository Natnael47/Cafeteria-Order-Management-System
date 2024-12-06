import { Pencil, Trash2 } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { backendUrl } from "../../App";
import SortingDropdown from "../../Components/SortingDropdown";
import { InventoryContext } from "../../Context/InventoryContext";

Modal.setAppElement("#root");

const Inventory = () => {
    const {
        inventoryList,
        fetchInventoryList,
        updateInventory,
        removeInventory,
        navigate
    } = useContext(InventoryContext);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editInventory, setEditInventory] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        pricePerUnit: "",
        status: "",
        image: null,
    });
    const [originalInventory, setOriginalInventory] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const editRef = useRef(null);

    useEffect(() => {
        fetchInventoryList();
        const handleFocus = () => {
            fetchInventoryList();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    const openModal = (inventoryId) => {
        setSelectedInventoryId(inventoryId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedInventoryId(null);
        setModalIsOpen(false);
    };

    const handleEditClick = (inventory, index) => {
        if (editIndex === index) {
            cancelEdit();
        } else {
            setEditInventory({ ...inventory });
            setOriginalInventory({ ...inventory });
            setEditIndex(index);
            setSelectedIndex(null);
            setHasChanges(false);
            setTimeout(() => {
                editRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        }
    };

    const handleNameClick = (index) => {
        if (selectedIndex === index) setSelectedIndex(null);
        else {
            setSelectedIndex(index);
            setEditIndex(null);
        }
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditInventory({
            name: "",
            category: "",
            quantity: "",
            unit: "",
            pricePerUnit: "",
            status: "",
            image: null,
        });
        setOriginalInventory(null);
        setHasChanges(false);
    };

    const checkForChanges = (newData) => {
        setHasChanges(JSON.stringify(originalInventory) !== JSON.stringify(newData));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditInventory((prevState) => {
            const updatedInventory = { ...prevState, [name]: value };
            checkForChanges(updatedInventory);
            return updatedInventory;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditInventory((prevState) => {
            const updatedInventory = { ...prevState, image: file };
            checkForChanges(updatedInventory);
            return updatedInventory;
        });
    };

    const handleUpdateInventory = () => {
        updateInventory(editInventory, fetchInventoryList, cancelEdit);
    };

    const handleRemoveInventory = () => {
        removeInventory(selectedInventoryId, fetchInventoryList, closeModal);
    };

    // Function to get the formatted date
    const getFormattedDate = () => {
        const today = new Date();
        const options = { weekday: 'short', day: '2-digit', year: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

    const [sortAttribute, setSortAttribute] = useState('name');  // Default sort by name
    const [sortOrder, setSortOrder] = useState('ascending');     // Default ascending

    useEffect(() => {
        // Retrieve the sorting state from localStorage
        const savedSortAttribute = localStorage.getItem('sortAttribute');
        const savedSortOrder = localStorage.getItem('sortOrder');

        // If saved values exist, use them; otherwise, use the default values
        if (savedSortAttribute && savedSortOrder) {
            setSortAttribute(savedSortAttribute);
            setSortOrder(savedSortOrder);
        }

        fetchInventoryList();
    }, []);

    const handleSortChange = (attribute, order) => {
        setSortAttribute(attribute);
        setSortOrder(order);
        // Save the selected sorting state to localStorage
        localStorage.setItem('sortAttribute', attribute);
        localStorage.setItem('sortOrder', order);
    };

    const filteredAndSortedInventoryList = inventoryList
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let valueA = a[sortAttribute];
            let valueB = b[sortAttribute];

            // If sorting by dateUpdated, convert the date strings to Date objects for proper sorting
            if (sortAttribute === "dateUpdated") {
                valueA = new Date(a.dateUpdated); // Convert to Date object
                valueB = new Date(b.dateUpdated);
            }

            // Handle numeric sorting for quantity, pricePerUnit, and status
            if (["quantity", "pricePerUnit", "status"].includes(sortAttribute)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }

            // Ascending/Descending sorting
            if (sortOrder === "ascending") {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });


    return (
        <div className="flex flex-col m-5 w-full max-w-6.5xl">
            {/* Header */}
            <div className="flex flex-col space-y-2 mb-2">
                {/* Top Section: Title and Buttons */}
                <div className="flex items-center justify-between h-[10vh]">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Inventory Items</h1>
                    <div className="flex items-center space-x-3">
                        {/* New Inventory Button */}
                        <button
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition"
                            onClick={() => navigate('/add_inventory')}
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

            <div className="bg-[#F3F4F6] rounded-lg w-full max-h-[76vh] overflow-y-auto shadow-lg">
                {/* Header */}
                <div className="grid grid-cols-[0.4fr_0.8fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr] items-center gap-4 p-4 border-b bg-[#FAFAFA] text-sm font-semibold text-gray-800">
                    <b>Name</b>
                    <b>Status</b>
                    <b className="ml-2">Quantity</b>
                    <b>Category</b>
                    <b>Price / Unit</b>
                    <b>Remove</b>
                    <b>Modify</b>
                </div>

                {/* Inventory Items */}
                {filteredAndSortedInventoryList.map((item, index) => (
                    <div key={index} className="border-b last:border-none">
                        {/* Item Row */}
                        <div
                            className={`grid grid-cols-[0.4fr_0.8fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr] items-center gap-4 p-4 text-sm font-medium ${item.status === "out of stock" ? "bg-red-100" : "bg-white"
                                } hover:bg-blue-50`}
                        >
                            <p
                                className="text-[#112F45] cursor-pointer hover:text-blue-500 hover:font-bold truncate"
                                onClick={() => handleNameClick(index)}
                            >
                                {item.name}
                            </p>
                            <div className="relative w-[150px] bg-gray-200 rounded-full h-8 overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-8 rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(Number(item.status), 100)}%`,
                                        backgroundColor: `hsl(${Number(item.status) * 1.2}, 100%, 50%)`,
                                    }}
                                ></div>
                                <p className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
                                    {item.status}%
                                </p>
                            </div>
                            <p className="ml-2">{item.quantity} {item.unit}</p>
                            <p className="truncate">{item.category}</p>
                            <p>${item.pricePerUnit}</p>
                            <Trash2
                                onClick={() => openModal(item.id)}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                size={20}
                            />
                            <Pencil
                                className="cursor-pointer text-blue-500 hover:text-blue-700"
                                onClick={() => handleEditClick(item, index)}
                                size={20}
                            />
                        </div>

                        {/* Selected Item Details */}
                        {selectedIndex === index && (
                            <div className="p-6 border-t bg-white shadow-md rounded-lg mt-4 flex items-center gap-6">
                                {/* Item Image */}
                                <div className="w-40 h-40 flex-shrink-0">
                                    <img
                                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                                        src={item.image ? `${backendUrl}/Inv_img/${item.image}` : "placeholder.jpg"}
                                        alt={item.name}
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex-grow space-y-2 text-gray-700">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{item.name}</h3>
                                    <p className="text-sm flex">
                                        <span className="w-32 font-semibold text-gray-800">Category:</span>
                                        <span>{item.category}</span>
                                    </p>
                                    <p className="text-sm flex">
                                        <span className="w-32 font-semibold text-gray-800">Quantity:</span>
                                        <span>
                                            {item.quantity} {item.unit}
                                        </span>
                                    </p>
                                    <p className="text-sm flex">
                                        <span className="w-32 font-semibold text-gray-800">Price/Unit:</span>
                                        <span>${item.pricePerUnit}</span>
                                    </p>
                                    <p className="text-sm flex">
                                        <span className="w-32 font-semibold text-gray-800">Status:</span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-sm font-medium ${item.status === "out of stock"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Edit Section */}
                        {editIndex === index && (
                            <div ref={editRef} className="p-4 border-t bg-gray-50">
                                <div className="grid gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editInventory.name}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            name="category"
                                            value={editInventory.category}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                        >
                                            <option value="Food Supplies">Food Supplies</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Cleaning Supplies">Cleaning Supplies</option>
                                            <option value="Utensils">Utensils</option>
                                            <option value="Electronics">Electronics</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={editInventory.quantity}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Unit</label>
                                        <select
                                            name="unit"
                                            value={editInventory.unit}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                        >
                                            <option value="kg">kg</option>
                                            <option value="liters">liters</option>
                                            <option value="packs">packs</option>
                                            <option value="pieces">pieces</option>
                                            <option value="grams">grams</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Price per Unit</label>
                                        <input
                                            type="number"
                                            name="pricePerUnit"
                                            value={editInventory.pricePerUnit}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Image</label>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="border border-gray-300 rounded-lg p-2 w-full"
                                        />
                                        {editInventory.image && (typeof editInventory.image === "object" ? (
                                            <img
                                                className="w-32 h-32 object-cover mt-2 rounded"
                                                src={URL.createObjectURL(editInventory.image)}
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                className="w-32 h-32 object-cover mt-2 rounded"
                                                src={`${backendUrl}/Inv_img/${editInventory.image}`}
                                                alt=""
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4 mt-4">
                                    <button
                                        onClick={cancelEdit}
                                        className="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdateInventory}
                                        disabled={!hasChanges}
                                        className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Confirmation"
                className="bg-white p-5 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-lg font-semibold">Confirm Delete</h2>
                <p>Are you sure you want to delete this Inventory item?</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleRemoveInventory} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Inventory;
