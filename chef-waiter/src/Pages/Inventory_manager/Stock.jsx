import React, { useContext, useEffect, useState } from "react";
import { InventoryContext } from "../../Context/InventoryContext";

const Stock = () => {
    const { inventoryList, fetchInventoryList, updateInventory } = useContext(InventoryContext);

    const [stockAction, setStockAction] = useState(null); // "in" or "out"
    const [selectedItem, setSelectedItem] = useState(null); // Item to update stock for
    const [stockAmount, setStockAmount] = useState(0); // Amount to add or remove

    useEffect(() => {
        fetchInventoryList();
    }, []);

    const handleStockAction = (item, action) => {
        setSelectedItem(item);
        setStockAction(action); // Set action to either "in" or "out"
        setStockAmount(0); // Reset stock amount when opening the form
    };

    const handleAmountChange = (e) => {
        setStockAmount(e.target.value);
    };

    const handleAddStock = () => {
        if (stockAmount > 0) {
            const updatedQuantity = selectedItem.quantity + parseInt(stockAmount);
            const updatedInitialQuantity = selectedItem.initialQuantity + parseInt(stockAmount); // Update opening stock as well
            // Pass cancelEdit function to updateInventory
            updateInventory(
                { ...selectedItem, quantity: updatedQuantity, initialQuantity: updatedInitialQuantity },
                fetchInventoryList,
                cancelEdit // Pass cancelEdit as the third argument
            );
        }
    };

    const handleTakeStock = () => {
        if (stockAmount > 0 && selectedItem.quantity >= stockAmount) {
            const updatedQuantity = selectedItem.quantity - parseInt(stockAmount);
            const updatedInitialQuantity = selectedItem.initialQuantity; // Opening stock stays the same when taking stock out
            // Pass cancelEdit function to updateInventory
            updateInventory(
                { ...selectedItem, quantity: updatedQuantity, initialQuantity: updatedInitialQuantity },
                fetchInventoryList,
                cancelEdit // Pass cancelEdit as the third argument
            );
        }
    };

    const resetStockForm = () => {
        setStockAction(null);
        setSelectedItem(null);
        setStockAmount(0);
    };

    // cancelEdit function to reset the form
    const cancelEdit = () => {
        resetStockForm(); // Call the reset function to clear all states
    };

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">Stock Overview</p>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium bg-[#FAFAFA] text-black sm:grid">
                        <b>Name</b>
                        <b>Opening Stock</b>
                        <b>Total Stock</b>
                        <b>Total Stock Out</b>
                        <b>Remaining Stock</b>
                        <b>Stock In</b>
                        <b>Stock Out</b>
                    </div>
                    {inventoryList.map((item, index) => (
                        <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium sm:grid bg-white">
                            <p className="text-[#112F45]">{item.name}</p>
                            <p>{item.initialQuantity} {item.unit}</p>
                            <p className="text-green-600">{item.quantity} <span className="text-green-600">{item.unit}</span></p>
                            <p className="text-red-600">{item.initialQuantity - item.quantity} <span className="text-red-600">{item.unit}</span></p>
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

                            {/* Hidden div for Stock In/Stock Out action */}
                            {stockAction && selectedItem === item && (
                                <div className="mt-2 p-3 bg-gray-100 rounded border">
                                    <p className="font-semibold">{stockAction === "in" ? "Add Stock" : "Remove Stock"}</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={stockAmount}
                                            onChange={handleAmountChange}
                                            className="p-2 border rounded w-20"
                                            min="1"
                                        />
                                        <span>{item.unit}</span>
                                    </div>
                                    <div className="mt-2 flex gap-4 justify-end">
                                        <button
                                            onClick={cancelEdit} // Using cancelEdit here to reset the form
                                            className="py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        {stockAction === "in" ? (
                                            <button
                                                onClick={handleAddStock}
                                                className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Add
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleTakeStock}
                                                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Take
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stock;
