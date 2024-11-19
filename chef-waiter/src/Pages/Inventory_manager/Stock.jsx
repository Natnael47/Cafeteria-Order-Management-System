import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { InventoryContext } from "../../Context/InventoryContext";

const Stock = () => {
    const { inventoryList, fetchInventoryList, iToken } = useContext(InventoryContext);

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
    }, []);

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

        if (selectedItem && formData.stockAmount > 0 && formData.pricePerUnit > 0) {
            const addedStock = parseInt(formData.stockAmount, 10) || 0;
            const pricePerUnit = parseFloat(formData.pricePerUnit) || 0;  // Convert string to number

            const formDataToSend = {
                inventoryId: selectedItem.id,
                quantity: addedStock,
                pricePerUnit: pricePerUnit,
                supplier: formData.supplier,
                expiryDate: formData.expiryDate,
                dateReceived: formData.dateReceived,
            };

            try {
                const response = await axios.post(
                    backendUrl + "/api/inventory/add-stock",
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
                    fetchInventoryList(); // Refresh inventory list
                    cancelEdit();
                } else {
                    toast.error(response.data.message || "Failed to add stock");
                }
            } catch (error) {
                console.error("Error adding stock:", error);
                toast.error(`Error: ${error.message}`);
            }
        } else {
            toast.error("Please enter a valid quantity and price per unit.");
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

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">Stock Overview</p>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">{getFormattedDate()}</span>
                    <input type="text" placeholder="Search item name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors w-36">Add Package</button>
            </div>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium bg-[#FAFAFA] text-black sm:grid">
                        <b>Name</b>
                        <b>Remaining Stock</b>
                        <b>Total Stock In</b>
                        <b>Total Stock Out</b>
                        <b>Opening Stock</b>
                        <b>Stock In</b>
                        <b>Stock Out</b>
                    </div>
                    {filteredInventoryList.map((item, index) => {
                        const totalStockOut = item.initialQuantity - item.quantity;
                        const totalStockIn = item.quantity + totalStockOut - item.initialQuantity;
                        return (
                            <div key={index} className="relative">
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.3fr_0.7fr] items-center gap-2 p-3 border text-sm font-medium sm:grid bg-white">
                                    <p className="text-[#112F45]">{item.name}</p>
                                    <p className="font-bold">{item.quantity} - {item.unit}</p>
                                    <p className="text-green-600">{totalStockIn} <span className="text-green-600">{item.unit}</span></p>
                                    <p className="text-red-600">{totalStockOut} <span className="text-red-600">{item.unit}</span></p>
                                    <p className="text-blue-600">{item.initialQuantity} <span className="text-blue-600">{item.unit}</span></p>
                                    <button onClick={() => handleStockAction(item, "in")} className="text-green-600 hover:text-green-800 transition-colors border-2 border-green-600 rounded-md">Stock In</button>
                                    <button onClick={() => handleStockAction(item, "out")} disabled={item.quantity <= 0} className="text-red-600 hover:text-red-800 transition-colors border-2 border-red-600 rounded-md">Stock Out</button>
                                </div>

                                {(stockAction === "in" && selectedItem === item) && (
                                    <div className="mt-1 mb-1 p-3 bg-gray-50 rounded border">
                                        <p className="font-bold text-lg">Add Stock</p>
                                        <form onSubmit={onAddStockHandler} className="w-full">
                                            <div className="flex items-start gap-2">
                                                <div>
                                                    <label htmlFor="stockAmount" className="block text-sm font-medium">Amount</label>
                                                    <input id="stockAmount" type="number" value={formData.stockAmount} onChange={onChangeHandler} name="stockAmount" className="p-2 border rounded w-20" min="1" />
                                                </div>
                                                <span className="mt-7">{item.unit}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <div>
                                                    <label htmlFor="pricePerUnit" className="block text-sm font-medium">Price per Unit</label>
                                                    <input id="pricePerUnit" type="number" placeholder="Price per unit" value={formData.pricePerUnit} onChange={onChangeHandler} name="pricePerUnit" className="p-2 border rounded w-32" />
                                                </div>
                                                <div>
                                                    <label htmlFor="dateReceived" className="block text-sm font-medium">Date Received</label>
                                                    <input id="dateReceived" type="date" placeholder="Date received" value={formData.dateReceived} onChange={onChangeHandler} name="dateReceived" className="p-2 border rounded" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <div>
                                                    <label htmlFor="supplier" className="block text-sm font-medium">Supplier</label>
                                                    <input id="supplier" type="text" placeholder="Supplier" value={formData.supplier} onChange={onChangeHandler} name="supplier" className="p-2 border rounded w-32" />
                                                </div>
                                                <div>
                                                    <label htmlFor="expiryDate" className="block text-sm font-medium">Expiry Date</label>
                                                    <input id="expiryDate" type="date" placeholder="Expiry date" value={formData.expiryDate} onChange={onChangeHandler} name="expiryDate" className="p-2 border rounded" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-4 justify-start">
                                                <button type="button" onClick={cancelEdit} className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                                                <button type="submit" className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">Add</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {(stockAction === "out" && selectedItem === item) && (
                                    <div className="mt-2 p-3 bg-gray-100 rounded border">
                                        <p className="font-semibold text-lg">Remove Stock</p>
                                        <form onSubmit={onRemoveStockHandler} className="w-full">
                                            <div className="flex items-start gap-2">
                                                <div>
                                                    <label htmlFor="stockAmountOut" className="block text-sm font-medium">Amount</label>
                                                    <input id="stockAmountOut" type="number" value={formData.stockAmount} onChange={onChangeHandler} name="stockAmount" className="p-2 border rounded w-20" min="1" max={selectedItem.quantity} />
                                                </div>
                                                <span className="mt-7">{item.unit}</span>
                                            </div>
                                            <div className="flex items-start gap-2 mt-3">
                                                <div>
                                                    <label htmlFor="withdrawnBy" className="block text-sm font-medium">Withdrawn By</label>
                                                    <input id="withdrawnBy" type="text" placeholder="Withdrawn by" value={formData.withdrawnBy} onChange={onChangeHandler} name="withdrawnBy" className="p-2 border rounded w-32" />
                                                </div>
                                                <div>
                                                    <label htmlFor="dateWithdrawn" className="block text-sm font-medium">Date Withdrawn</label>
                                                    <input id="dateWithdrawn" type="date" placeholder="Date withdrawn" value={formData.dateWithdrawn} onChange={onChangeHandler} name="dateWithdrawn" className="p-2 border rounded" />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex gap-4 justify-start">
                                                <button type="button" onClick={cancelEdit} className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                                                <button type="submit" className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">Remove</button>
                                            </div>
                                        </form>
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
