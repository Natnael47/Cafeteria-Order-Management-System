import React, { useContext, useEffect, useRef, useState } from "react";
import { ChefContext } from "../../Context/ChefContext";

const Request_Stock = () => {
    const {
        inventoryList,
        fetchInventoryList,
    } = useContext(ChefContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [requestQuantity, setRequestQuantity] = useState("");
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

    const handleSubmitRequest = (inventoryId) => {
        if (!requestQuantity || requestQuantity <= 0) {
            setError("Please enter a valid quantity.");
            return;
        }
        // Add your request stock logic here, e.g., send data to the backend
        console.log(`Requesting ${requestQuantity} units for inventory ID: ${inventoryId}`);
        setRequestQuantity("");
        setSelectedIndex(null);
        setError(null);
    };

    const filteredInventoryList = inventoryList
        .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">Request Inventory Stock</p>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <span className="text-gray-700">{getFormattedDate()}</span>
                    <input
                        type="text"
                        placeholder="Search item name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors w-36"
                >
                    Add Item
                </button>
            </div>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium bg-[#FAFAFA] text-black sm:grid">
                        <b>Status</b>
                        <b className="ml-5">Name</b>
                        <b>Category</b>
                        <b>Quantity</b>
                        <b>Price / Unit</b>
                        <b>Request</b>
                    </div>

                    {filteredInventoryList.map((item, index) => (
                        <div key={index}>
                            <div
                                className={`grid grid-cols-[0.7fr_0.7fr_0.7fr_0.6fr_0.3fr_0.7fr] items-center gap-2 p-3 border text-sm font-medium sm:grid ${item.status === "out of stock" ? "bg-red-100" : "bg-white"
                                    }`}
                            >
                                <div className="relative w-full bg-gray-200 rounded h-8">
                                    <div
                                        className={`absolute top-0 left-0 h-8 rounded transition-all`}
                                        style={{
                                            width: `${Math.min(Number(item.status), 100)}%`,
                                            backgroundColor: `hsl(${Number(item.status) * 1.2}, 100%, 50%)`
                                        }}
                                    ></div>
                                    <p className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-black">
                                        {item.status}%
                                    </p>
                                </div>
                                <p className="text-[#112F45] ml-5">{item.name}</p>
                                <p>{item.category}</p>
                                <p>
                                    {item.quantity} {item.unit}
                                </p>
                                <p>${item.pricePerUnit}</p>
                                <button
                                    className="text-blue-500 hover:text-blue-700 font-semibold cursor-pointer"
                                    onClick={() => handleRequestClick(index)}
                                >
                                    Request More
                                </button>
                            </div>
                            {selectedIndex === index && (
                                <div ref={requestRef} className="p-4 border-t bg-gray-50">
                                    <h3 className="text-lg font-semibold mb-2">Request Inventory Stock</h3>
                                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">Quantity</label>
                                        <input
                                            type="number"
                                            value={requestQuantity}
                                            onChange={(e) => setRequestQuantity(e.target.value)}
                                            className="border p-2 rounded w-full"
                                        />
                                    </div>
                                    <div className="flex justify-start gap-4 mt-4">
                                        <button
                                            onClick={() => setSelectedIndex(null)}
                                            className="py-2 px-4 bg-gray-300 text-gray-700 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleSubmitRequest(item.id)}
                                            className="py-2 px-4 bg-blue-500 text-white rounded"
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
        </div>
    );
};

export default Request_Stock;
