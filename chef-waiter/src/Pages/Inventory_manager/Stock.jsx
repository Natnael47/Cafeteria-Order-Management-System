import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { InventoryContext } from "../../Context/InventoryContext";

const Stock = () => {
    const { inventoryList, fetchInventoryList, updateInventory, iToken } = useContext(InventoryContext);

    const [stockAction, setStockAction] = useState(null); // "in" or "out"
    const [selectedItem, setSelectedItem] = useState(null); // Item to update stock for
    const [formData, setFormData] = useState({
        stockAmount: 0, // Amount of stock to add or remove
        pricePerUnit: 0, // Price per unit when adding stock
        supplier: "", // Supplier input
        expiryDate: "", // Expiry date input
        dateReceived: "", // Date received input
    });

    useEffect(() => {
        fetchInventoryList(); // Fetch inventory list on load
    }, []);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleStockAction = (item, action) => {
        setSelectedItem(item);
        setStockAction(action); // Set action to either "in" or "out"
        setFormData({
            stockAmount: 0,
            pricePerUnit: 0,
            supplier: "",
            expiryDate: "",
            dateReceived: "",
        }); // Reset the form data
    };

    // Handle stock addition to backend
    const onAddStockHandler = async (event) => {
        event.preventDefault();

        if (selectedItem && formData.stockAmount > 0 && formData.pricePerUnit > 0) {
            const addedStock = parseInt(formData.stockAmount);
            const formDataToSend = {
                inventoryId: selectedItem.id,
                quantity: formData.stockAmount,
                pricePerUnit: formData.pricePerUnit,
                supplier: formData.supplier,
                expiryDate: formData.expiryDate,
                dateReceived: formData.dateReceived,
            };

            try {
                const response = await axios.post(backendUrl + "/api/inventory/add-stock", formDataToSend, {
                    headers: {
                        'Content-Type': 'application/json', // Set content type as JSON
                        iToken, // Add the auth token
                    },
                });

                if (response.data.success) {
                    // Update inventory state after successful stock addition
                    let updatedQuantity = selectedItem.quantity + addedStock;
                    let updatedInitialQuantity = selectedItem.initialQuantity;
                    if (selectedItem.initialQuantity - selectedItem.quantity === 0) {
                        updatedInitialQuantity = selectedItem.initialQuantity + addedStock;
                    }
                    updateInventory(
                        { ...selectedItem, quantity: updatedQuantity, initialQuantity: updatedInitialQuantity },
                        fetchInventoryList,
                        cancelEdit
                    );
                    toast.success("Stock added successfully");
                } else {
                    toast.error(response.data.message || "Failed to add stock");
                }
            } catch (error) {
                console.error("Error adding stock to inventory:", error);
                toast.error(`Error: ${error.message}`);
            }
        } else {
            toast.error("Please enter a valid quantity and price per unit.");
        }
    };

    const handleTakeStock = () => {
        if (formData.stockAmount > 0 && selectedItem.quantity >= formData.stockAmount) {
            const updatedQuantity = selectedItem.quantity - parseInt(formData.stockAmount);
            const updatedInitialQuantity = selectedItem.initialQuantity;
            updateInventory(
                { ...selectedItem, quantity: updatedQuantity, initialQuantity: updatedInitialQuantity },
                fetchInventoryList,
                cancelEdit
            );
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
        });
    };

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">Stock Overview</p>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium bg-[#FAFAFA] text-black sm:grid">
                        <b>Name</b>
                        <b>Opening Stock</b>
                        <b>Total Stock In</b>
                        <b>Total Stock Out</b>
                        <b>Remaining Stock</b>
                        <b>Stock In</b>
                        <b>Stock Out</b>
                    </div>
                    {inventoryList.map((item, index) => {
                        const totalStockOut = item.initialQuantity - item.quantity;
                        const totalStockIn = item.quantity + totalStockOut - item.initialQuantity;
                        return (
                            <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.3fr_0.7fr] items-center gap-2 p-3 border text-sm font-medium sm:grid bg-white">
                                <p className="text-[#112F45]">{item.name}</p>
                                <p>{item.initialQuantity} {item.unit}</p>
                                <p className="text-green-600">{totalStockIn} <span className="text-green-600">{item.unit}</span></p>
                                <p className="text-red-600">{totalStockOut} <span className="text-red-600">{item.unit}</span></p>
                                <p className="text-blue-600">{item.quantity} <span className="text-blue-600">{item.unit}</span></p>
                                <button
                                    onClick={() => handleStockAction(item, "in")}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                    Stock In
                                </button>
                                <button
                                    onClick={() => handleStockAction(item, "out")}
                                    disabled={item.quantity <= 0}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                    Stock Out
                                </button>

                                {stockAction === "in" && selectedItem === item && (
                                    <div className="mt-2 p-3 bg-gray-100 rounded border">
                                        <p className="font-semibold">Add Stock</p>
                                        <form onSubmit={onAddStockHandler} className="w-full">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={formData.stockAmount}
                                                    onChange={onChangeHandler}
                                                    name="stockAmount"
                                                    className="p-2 border rounded w-20"
                                                    min="1"
                                                />
                                                <span>{item.unit}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <input
                                                    type="number"
                                                    placeholder="Price per unit"
                                                    value={formData.pricePerUnit}
                                                    onChange={onChangeHandler}
                                                    name="pricePerUnit"
                                                    className="p-2 border rounded w-32"
                                                />
                                                <input
                                                    type="date"
                                                    placeholder="Date received"
                                                    value={formData.dateReceived}
                                                    onChange={onChangeHandler}
                                                    name="dateReceived"
                                                    className="p-2 border rounded"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <input
                                                    type="text"
                                                    placeholder="Supplier"
                                                    value={formData.supplier}
                                                    onChange={onChangeHandler}
                                                    name="supplier"
                                                    className="p-2 border rounded w-32"
                                                />
                                                <input
                                                    type="date"
                                                    placeholder="Expiry date"
                                                    value={formData.expiryDate}
                                                    onChange={onChangeHandler}
                                                    name="expiryDate"
                                                    className="p-2 border rounded"
                                                />
                                            </div>
                                            <div className="mt-2 flex gap-4 justify-end">
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Add
                                                </button>
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
