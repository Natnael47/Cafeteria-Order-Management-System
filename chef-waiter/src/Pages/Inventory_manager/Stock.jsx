import axios from "axios";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import SortingDropdown from "../../Components/SortingDropdown";
import { InventoryContext } from "../../Context/InventoryContext";

const Stock = () => {
    const { inventoryList, fetchInventoryList, iToken, supplierList, packageList, fetchPackages, fetchSuppliers } = useContext(InventoryContext);

    const [stockAction, setStockAction] = useState(null); // "in" or "out"
    const [selectedItem, setSelectedItem] = useState(null); // Item to update stock for
    const [formData, setFormData] = useState({
        stockAmount: 0,
        pricePerUnit: 0, // For stock in
        supplier: "", // For stock in
        expiryDate: "", // For stock in
        dateReceived: "", // For stock in
        withdrawnBy: "", // For stock out
        dateWithdrawn: "", // For stock out
    });

    useEffect(() => {
        fetchInventoryList(); // Fetch inventory list on component load
        fetchSuppliers(); // Fetch supplier list on component load
    }, []);
    // Use effect to fetch packages on mount
    useEffect(() => {
        fetchPackages(); // Fetch packages when the component mounts
    }, [fetchPackages]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleStockAction = (item, action) => {
        const today = new Date();
        const twoMonthsFromToday = new Date();
        twoMonthsFromToday.setMonth(today.getMonth() + 2);

        setSelectedItem(item);
        setStockAction(action); // Set to "in" or "out"
        setFormData({
            stockAmount: 0,
            pricePerUnit: item.pricePerUnit || 0, // Set default pricePerUnit from the selected item
            supplier: item.supplier || "", // Set default supplier from the selected item
            dateReceived: today.toISOString().split("T")[0], // Default to today's date
            expiryDate: twoMonthsFromToday.toISOString().split("T")[0], // Default to two months from today
            withdrawnBy: "",
            dateWithdrawn: today.toISOString().split("T")[0], // Default to today's date
        }); // Reset form data
    };

    // Handle Stock In
    const onAddStockHandler = async (event) => {
        event.preventDefault();

        if (!formData.supplierId || !formData.supplier) {
            toast.error("Please select a valid supplier.");
            return;
        }

        if (selectedItem && formData.stockAmount > 0 && formData.pricePerUnit > 0) {
            if (!formData.supplierId || !formData.supplier) {
                toast.error("Please select a valid supplier.");
                return;
            }

            const formDataToSend = {
                inventoryId: selectedItem.id,
                quantity: parseInt(formData.stockAmount, 10),
                pricePerUnit: parseFloat(formData.pricePerUnit),
                supplier: formData.supplier, // Supplier name
                supplierId: formData.supplierId, // Supplier ID
                expiryDate: formData.expiryDate,
                dateReceived: formData.dateReceived,
            };

            try {
                const response = await axios.post(
                    `${backendUrl}/api/inventory/add-stock`,
                    formDataToSend,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            iToken,
                        },
                    }
                );

                if (response.data.success) {
                    toast.success("Stock added successfully");
                    fetchInventoryList();
                    cancelEdit();
                } else {
                    toast.error(response.data.message || "Failed to add stock");
                }
            } catch (error) {
                console.error("Error adding stock:", error);
                toast.error("Failed to add stock. Please try again.");
            }
        } else {
            toast.error("Please enter a valid quantity, price per unit, and supplier.");
        }
    };

    // Handle Stock Out
    const onRemoveStockHandler = async (event) => {
        event.preventDefault();

        if (selectedItem && formData.stockAmount > 0 && formData.withdrawnBy) {
            const removedStock = parseInt(formData.stockAmount);
            if (removedStock > selectedItem.quantity) {
                toast.error("Insufficient stock available.");
                return;
            }

            const formDataToSend = {
                inventoryId: selectedItem.id,
                withdrawnBy: formData.withdrawnBy,
                quantity: removedStock,
                dateWithdrawn: formData.dateWithdrawn || new Date().toISOString(),
            };

            try {
                const response = await axios.post(
                    backendUrl + "/api/inventory/remove-stock",
                    formDataToSend,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            iToken,
                        },
                    }
                );

                if (response.data.success) {
                    toast.success("Stock removed successfully");
                    fetchInventoryList(); // Refresh inventory list
                    cancelEdit();
                } else {
                    toast.error(response.data.message || "Failed to remove stock");
                }
            } catch (error) {
                console.error("Error removing stock:", error);
                toast.error(`Error: ${error.message}`);
            }
        } else {
            toast.error("Please enter a valid quantity and withdrawn by.");
        }
    };

    const cancelEdit = () => {
        setStockAction(null);
        setSelectedItem(null);
        setFormData({
            stockAmount: 0,
            pricePerUnit: 0,
            supplier: "",
            expiryDate: "",
            dateReceived: "",
            withdrawnBy: "",
            dateWithdrawn: "",
        });
    };

    // Function to get the formatted date
    const getFormattedDate = () => {
        const today = new Date();
        const options = { weekday: 'short', day: '2-digit', year: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

    const [searchTerm, setSearchTerm] = useState('');

    // Filter and sort the inventory list based on the search term
    const filteredInventoryList = inventoryList
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const [isPackagePopupOpen, setIsPackagePopupOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packageForm, setPackageForm] = useState({
        dateReceived: "",
        expiryDate: "",
    });


    // Button to open the package popup
    const handleAddPackageClick = () => {
        setIsPackagePopupOpen(true);
    };

    // Button inside popup to close
    const handleClosePopup = () => {
        setIsPackagePopupOpen(false);
    };

    const handleSelectPackage = (pkg) => {
        setSelectedPackage(pkg);  // This will store the selected package
    };

    const handlePackageFormChange = (event) => {
        const { name, value } = event.target;
        setPackageForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePackageSubmit = async (event) => {
        event.preventDefault();
        if (!selectedPackage || !packageForm.dateReceived || !packageForm.expiryDate) {
            toast.error("Please complete all fields before submitting.");
            return;
        }

        const payload = {
            packageId: selectedPackage.id,
            dateReceived: new Date(packageForm.dateReceived).toISOString(),
            expiryDate: new Date(packageForm.expiryDate).toISOString(),
        };
        console.log(payload);


        try {
            const response = await axios.post(
                backendUrl + "/api/inventory/stock-package", payload, { headers: { iToken } }
            );
            if (response.data.success) {
                toast.success("Package stocked successfully!");
                fetchInventoryList();
                setIsPackagePopupOpen(false); // Close the popup
                setSelectedPackage(null); // Reset selected package
                setPackageForm({ dateReceived: "", expiryDate: "" }); // Reset form data
                fetchPackages(); // Refresh the package list
            } else {
                toast.error(response.data.message || "Failed to stock package.");
            }
        } catch (error) {
            console.error("Error stocking package:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    const [sortAttribute, setSortAttribute] = useState('name');  // Default sort by name
    const [sortOrder, setSortOrder] = useState('ascending');     // Default ascending

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
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Stock Overview</h1>
                    <div className="flex items-center space-x-3">
                        {/* New Inventory Button */}
                        <button
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition"
                            onClick={handleAddPackageClick}
                        >
                            + Add Package
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

            <div className="bg-[#F3F4F6] rounded w-full max-h-[83vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr] items-center gap-4 p-5 border-b text-sm font-semibold bg-[#FAFAFA] text-black sm:grid">
                        <div className="text-center font-medium">Status</div>
                        <div className="text-center font-medium">Name</div>
                        <div className="text-center font-medium">Remaining Stock</div>
                        <div className="text-center font-medium">Total Stock Out</div>
                        <div className="text-center font-medium">Opening Stock</div>
                        <div className="text-center font-medium">Stock In</div>
                        <div className="text-center font-medium">Stock Out</div>
                    </div>

                    {filteredInventoryList.map((item, index) => {
                        const totalStockOut = item.initialQuantity - item.quantity;

                        return (
                            <div key={index} className="relative">
                                <div
                                    className={`grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.6fr_0.4fr] items-center gap-4 p-4 border-b ${item.quantity === 0 ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                                        } text-sm font-medium sm:grid transition-all hover:bg-blue-50`} >

                                    {/* Status Bar */}
                                    <div className="relative w-full bg-gray-200 rounded h-8 overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-8 transition-all"
                                            style={{
                                                width: `${(item.quantity / item.initialQuantity) * 100}%`,
                                                backgroundColor: `hsl(${(item.quantity / item.initialQuantity) * 120}, 100%, 50%)`,
                                            }}
                                        ></div>
                                        <p className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
                                            {item.quantity === 0 ? "Out of Stock" : `${((item.quantity / item.initialQuantity) * 100).toFixed(0)}%`}
                                        </p>
                                    </div>

                                    {/* Name */}
                                    <p className="text-center text-[#112F45] font-semibold">{item.name}</p>

                                    {/* Remaining Stock */}
                                    <p className="text-center font-bold text-gray-700">
                                        {item.quantity} <span className="text-gray-500">{item.unit}</span>
                                    </p>

                                    {/* Total Stock Out */}
                                    <p className="text-center text-red-500">
                                        {totalStockOut} <span className="text-red-400">{item.unit}</span>
                                    </p>

                                    {/* Opening Stock */}
                                    <p className="text-center text-blue-500">
                                        {item.initialQuantity} <span className="text-blue-400">{item.unit}</span>
                                    </p>

                                    {/* Stock In Button */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleStockAction(item, "in")}
                                            className="px-3 py-2 mr-4 text-white bg-green-600 rounded hover:bg-green-700 border border-green-600 text-xs font-medium transition-all"
                                        >
                                            <ArrowDownToLine />
                                        </button>
                                    </div>

                                    {/* Stock Out Button */}
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => handleStockAction(item, "out")}
                                            disabled={item.quantity <= 0}
                                            className={`px-3 py-2 text-xs font-medium rounded transition-all mr-4 ${item.quantity > 0
                                                ? "text-white bg-red-600 hover:bg-red-700 border border-red-600"
                                                : "text-gray-400 bg-gray-200 border border-gray-300 cursor-not-allowed"
                                                }`}
                                        >
                                            <ArrowUpFromLine />
                                        </button>
                                    </>
                                </div>

                                {/* Add Stock Form */}
                                {stockAction === "in" && selectedItem === item && (
                                    <div className="mt-2 mb-2 p-4 bg-white shadow-md rounded-lg border border-gray-200">
                                        {/* Header */}
                                        <p className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">
                                            Add Stock
                                        </p>
                                        <form onSubmit={onAddStockHandler} className="space-y-4">
                                            {/* Input Fields */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Stock Amount */}
                                                <div>
                                                    <label htmlFor="stockAmount" className="block text-sm font-medium text-gray-700">
                                                        Stock Amount
                                                    </label>
                                                    <input
                                                        id="stockAmount"
                                                        type="number"
                                                        name="stockAmount"
                                                        value={formData.stockAmount}
                                                        onChange={onChangeHandler}
                                                        min="1"
                                                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                                    />
                                                </div>

                                                {/* Price per Unit */}
                                                <div>
                                                    <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
                                                        Price per Unit
                                                    </label>
                                                    <input
                                                        id="pricePerUnit"
                                                        type="number"
                                                        name="pricePerUnit"
                                                        value={formData.pricePerUnit}
                                                        onChange={onChangeHandler}
                                                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                                    />
                                                </div>

                                                {/* Date Received */}
                                                <div>
                                                    <label htmlFor="dateReceived" className="block text-sm font-medium text-gray-700">
                                                        Date Received
                                                    </label>
                                                    <input
                                                        id="dateReceived"
                                                        type="date"
                                                        name="dateReceived"
                                                        value={formData.dateReceived}
                                                        onChange={onChangeHandler}
                                                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                                    />
                                                </div>

                                                {/* Supplier */}
                                                <div>
                                                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                                                        Supplier
                                                    </label>
                                                    <select
                                                        id="supplier"
                                                        name="supplier"
                                                        value={formData.supplierId || ""}
                                                        onChange={(event) => {
                                                            const selectedSupplierId = event.target.value;
                                                            const selectedSupplier = supplierList.find(
                                                                (supplier) => supplier.id.toString() === selectedSupplierId
                                                            );
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                supplierId: selectedSupplier ? selectedSupplier.id : "",
                                                                supplier: selectedSupplier ? selectedSupplier.name : "",
                                                            }));
                                                        }}
                                                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                                    >
                                                        <option value="">Select a supplier</option>
                                                        {supplierList.map((supplier) => (
                                                            <option key={supplier.id} value={supplier.id}>
                                                                {supplier.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Expiry Date */}
                                                <div>
                                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        id="expiryDate"
                                                        type="date"
                                                        name="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={onChangeHandler}
                                                        className="mt-1 p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
                                                    />
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md border hover:bg-gray-300 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Remove Stock Form */}
                                {stockAction === "out" && selectedItem === item && (
                                    <div className="mt-2 mb-2 p-4 bg-white shadow-md rounded-lg border border-gray-200">
                                        {/* Header */}
                                        <p className="font-bold text-lg text-gray-800 border-b pb-2 mb-4">
                                            Remove Stock
                                        </p>
                                        {/* Form */}
                                        <form onSubmit={onRemoveStockHandler} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Stock Amount */}
                                                <div>
                                                    <label
                                                        htmlFor="stockAmountOut"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Stock Amount
                                                    </label>
                                                    <input
                                                        id="stockAmountOut"
                                                        type="number"
                                                        name="stockAmount"
                                                        value={formData.stockAmount}
                                                        onChange={onChangeHandler}
                                                        className="p-3 border rounded-md w-full focus:ring focus:ring-red-300 focus:outline-none"
                                                        placeholder="Enter amount"
                                                        min="1"
                                                        max={selectedItem.quantity}
                                                    />
                                                </div>
                                                {/* Date Withdrawn */}
                                                <div>
                                                    <label
                                                        htmlFor="dateWithdrawn"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Date Withdrawn
                                                    </label>
                                                    <input
                                                        id="dateWithdrawn"
                                                        type="date"
                                                        name="dateWithdrawn"
                                                        value={formData.dateWithdrawn}
                                                        onChange={onChangeHandler}
                                                        className="p-3 border rounded-md w-full focus:ring focus:ring-red-300 focus:outline-none"
                                                    />
                                                </div>
                                                {/* Withdrawn By */}
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="withdrawnBy"
                                                        className="block text-sm font-medium text-gray-700 mb-1"
                                                    >
                                                        Withdrawn By
                                                    </label>
                                                    <input
                                                        id="withdrawnBy"
                                                        type="text"
                                                        name="withdrawnBy"
                                                        value={formData.withdrawnBy}
                                                        onChange={onChangeHandler}
                                                        className="p-3 border rounded-md w-full focus:ring focus:ring-red-300 focus:outline-none"
                                                        placeholder="Enter name"
                                                    />
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-3 mt-4">
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md border hover:bg-gray-300 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {isPackagePopupOpen && (
                                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                                        <div className="bg-white p-6 rounded-lg shadow-xl w-2/3 max-w-lg">
                                            {/* Title */}
                                            <h2 className="text-2xl font-bold mb-6 text-gray-700">Select a Package</h2>

                                            {/* Package List */}
                                            <div className="max-h-60 overflow-y-auto mb-4 border rounded-md p-2 shadow-inner">
                                                {packageList
                                                    .filter((pkg) => pkg.totalCost > 0) // Exclude packages with totalCost equal to 0
                                                    .map((pkg) => (
                                                        <div
                                                            key={pkg.id}
                                                            className={`p-3 rounded-md cursor-pointer transition-all ${selectedPackage?.id === pkg.id
                                                                ? "bg-blue-100 border-blue-400 shadow"
                                                                : "hover:bg-gray-100"
                                                                }`}
                                                            onClick={() => handleSelectPackage(pkg)}
                                                        >
                                                            <span className="font-medium text-gray-700">{pkg.name}</span>
                                                        </div>
                                                    ))}
                                            </div>

                                            {/* Cancel Button */}
                                            <div className="flex justify-end mb-4">
                                                <button
                                                    type="button"
                                                    onClick={handleClosePopup}
                                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>

                                            {/* Form (Only visible when a package is selected) */}
                                            {selectedPackage && (
                                                <form onSubmit={handlePackageSubmit}>
                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        {/* Date Received */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                                Date Received
                                                            </label>
                                                            <input
                                                                type="date"
                                                                name="dateReceived"
                                                                value={packageForm.dateReceived}
                                                                onChange={handlePackageFormChange}
                                                                className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            />
                                                        </div>

                                                        {/* Expiry Date */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                                                Expiry Date
                                                            </label>
                                                            <input
                                                                type="date"
                                                                name="expiryDate"
                                                                value={packageForm.expiryDate}
                                                                onChange={handlePackageFormChange}
                                                                className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleClosePopup}
                                                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Stock;
