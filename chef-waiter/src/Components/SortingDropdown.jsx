import { useEffect, useState } from "react";

const SortingDropdown = ({ onSortChange }) => {
    const [sortAttribute, setSortAttribute] = useState(() => {
        return localStorage.getItem("sortAttribute") || "name";
    });
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem("sortOrder") || "ascending";
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown visibility

    useEffect(() => {
        localStorage.setItem("sortAttribute", sortAttribute);
        localStorage.setItem("sortOrder", sortOrder);
    }, [sortAttribute, sortOrder]);

    const handleSortChange = (e) => {
        const [attribute, order] = e.target.value.split(",");
        setSortAttribute(attribute);
        setSortOrder(order);
        onSortChange(attribute, order); // Pass the selected values back to parent
        setIsDropdownOpen(false); // Close the dropdown after selection
    };

    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Status", value: "status" },
        { label: "Quantity", value: "quantity" },
        { label: "Price", value: "pricePerUnit" },
        { label: "Category", value: "category" },
        { label: "Date Modified", value: "dateUpdated" },
    ];

    return (
        <div className="relative inline-block">
            <button
                className="flex items-center justify-between w-[200px] px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
            >
                <span>
                    Sort: {sortOptions.find(option => option.value === sortAttribute)?.label || "Name"}
                </span>
                <span className="ml-2 text-gray-500">▼</span>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <p className="px-4 py-2 text-gray-500 text-xs font-bold">Sort By</p>
                        {sortOptions.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    setSortAttribute(option.value);
                                    onSortChange(option.value, sortOrder);
                                    setIsDropdownOpen(false); // Close the dropdown after selecting a sort option
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortAttribute === option.value ? "font-semibold text-blue-500" : "text-gray-700"
                                    }`}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-300"></div>
                    <div className="py-1">
                        <p className="px-4 py-2 text-gray-500 text-xs font-bold">Order</p>
                        {["ascending", "descending"].map((order) => (
                            <div
                                key={order}
                                onClick={() => {
                                    setSortOrder(order);
                                    onSortChange(sortAttribute, order);
                                    setIsDropdownOpen(false); // Close the dropdown after selecting order
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${sortOrder === order ? "font-semibold text-blue-500" : "text-gray-700"
                                    }`}
                            >
                                {order.charAt(0).toUpperCase() + order.slice(1)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SortingDropdown;
