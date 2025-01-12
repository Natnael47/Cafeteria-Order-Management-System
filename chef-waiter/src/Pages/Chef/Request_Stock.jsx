import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify"; // Ensure you have this installed for notifications
import { backendUrl } from "../../App";
import { ChefContext } from "../../Context/ChefContext";

const Request_Stock = () => {
    const {
        inventoryList,
        fetchInventoryList,
        cToken
    } = useContext(ChefContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [requestQuantity, setRequestQuantity] = useState("");
    const [requestReason, setRequestReason] = useState("");
    const [error, setError] = useState(null);
    const requestRef = useRef(null);

    useEffect(() => {
        fetchInventoryList();
    }, []);

    const getFormattedDate = () => {
        const today = new Date();
        const options = { weekday: "short", day: "2-digit", year: "numeric" };
        return today.toLocaleDateString("en-US", options);
    };

    const handleRequestClick = (index) => {
        if (selectedIndex === index) setSelectedIndex(null);
        else {
            setSelectedIndex(index);
            setTimeout(() => {
                requestRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        }
    };

    const handleSubmitRequest = async (inventoryId) => {
        if (!requestQuantity || requestQuantity <= 0) {
            setError("Please enter a valid quantity.");
            return;
        }

        const quantity = parseInt(requestQuantity, 10) || 0;

        // Create data to send to the backend (following the example format)
        const formDataToSend = {
            inventoryId: inventoryId, // The ID of the inventory item
            quantity: quantity, // The quantity requested
        };

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/inv-request`, formDataToSend, { headers: { cToken } });

            if (response.data.success) {
                toast.success("Inventory request submitted successfully");
                setRequestQuantity(""); // Clear the input field
                setSelectedIndex(null); // Reset the selected inventory item
                fetchInventoryList(); // Refresh the inventory list after submitting the request
            } else {
                toast.error(response.data.message || "Failed to submit inventory request");
            }
        } catch (error) {
            console.error("Error submitting inventory request:", error);
            toast.error(`Error: ${error.message}`);
        }
    };

    const filteredInventoryList = inventoryList
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex flex-col m-5 w-full max-w-6.5xl">
            {/* Header Section */}
            <p className="mb-6 text-2xl font-bold text-gray-800">Request Inventory Stock</p>

            {/* Search and Add Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-medium">{getFormattedDate()}</span>
                    <input
                        type="text"
                        placeholder="Search item name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </div>
            </div>

            {/* Inventory List Section */}
            <div className="bg-white rounded-xl w-full max-h-[80vh] overflow-auto shadow-lg border border-gray-200">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_0.6fr_0.6fr_0.6fr] items-center gap-6 p-4 bg-gray-100 text-sm font-bold text-gray-800 border-b">
                    <span>Status</span>
                    <span>Name</span>
                    <span>Category</span>
                    <span>Quantity</span>
                    <span>Price / Unit</span>
                    <span>Action</span>
                </div>

                {/* Inventory Items */}
                {filteredInventoryList.map((item, index) => (
                    <div key={index} className="border-b last:border-none">
                        {/* Inventory Row */}
                        <div
                            className={`grid grid-cols-[1fr_1fr_1fr_0.6fr_0.3fr_0.9fr] items-center gap-6 p-4 text-sm transition ${item.status === "out of stock" ? "bg-red-50" : "bg-white hover:bg-gray-50"
                                }`}
                        >
                            {/* Status Bar */}
                            <div className="relative w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-6 rounded-full transition-all"
                                    style={{
                                        width: `${Math.min(Number(item.status), 100)}%`,
                                        backgroundColor: `hsl(${Math.min(Number(item.status), 100) * 1.2}, 100%, 50%)`,
                                    }}
                                ></div>
                                <p className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-900">
                                    {item.status}%
                                </p>
                            </div>
                            <p className="text-gray-800 font-medium">{item.name}</p>
                            <p className="text-gray-600">{item.category}</p>
                            <p className="text-gray-600">{item.quantity} {item.unit}</p>
                            <p className="text-gray-600">${item.pricePerUnit}</p>
                            <button
                                className="text-blue-600 hover:text-blue-800 font-semibold transition"
                                onClick={() => handleRequestClick(index)}
                            >
                                Request More
                            </button>
                        </div>

                        {/* Request Modal */}
                        {selectedIndex === index && (
                            <div ref={requestRef} className="p-6 bg-gray-50 border-t">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Request Inventory Stock</h3>
                                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={requestQuantity}
                                        onChange={(e) => setRequestQuantity(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                    <select
                                        value={requestReason}
                                        onChange={(e) => setRequestReason(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="finish">Finish</option>
                                        <option value="damaged">Damaged</option>
                                        <option value="expired">Expired</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <button
                                        onClick={() => setSelectedIndex(null)}
                                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSubmitRequest(item.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );

};

export default Request_Stock;
