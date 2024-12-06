import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const SortingDropdown = ({ onSortChange }) => {
    const [sortAttribute, setSortAttribute] = useState(() => {
        return localStorage.getItem("sortAttribute") || "name";
    });
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem("sortOrder") || "ascending";
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("sortAttribute", sortAttribute);
        localStorage.setItem("sortOrder", sortOrder);
    }, [sortAttribute, sortOrder]);

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
                className="flex items-center justify-between w-[200px] px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <span>
                    Sort:{" "}
                    <span className="font-semibold text-blue-600">
                        {sortOptions.find(option => option.value === sortAttribute)?.label || "Name"}
                    </span>
                </span>
                <ChevronDown />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {/* Sort By Section */}
                    <div className="py-1">
                        <p className="px-4 py-2 text-gray-500 text-xs font-bold uppercase">Sort By</p>
                        {sortOptions.map(option => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    setSortAttribute(option.value);
                                    onSortChange(option.value, sortOrder);
                                    setIsDropdownOpen(false);
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 transition ${sortAttribute === option.value
                                    ? "bg-blue-50 text-blue-600 font-semibold"
                                    : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {sortAttribute === option.value && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                                {option.label}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-300"></div>

                    {/* Sort Order Section */}
                    <div className="py-1">
                        <p className="px-4 py-2 text-gray-500 text-xs font-bold uppercase">Order</p>
                        {["ascending", "descending"].map(order => (
                            <div
                                key={order}
                                onClick={() => {
                                    setSortOrder(order);
                                    onSortChange(sortAttribute, order);
                                    setIsDropdownOpen(false);
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 transition ${sortOrder === order
                                    ? "bg-green-50 text-green-600 font-semibold"
                                    : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {sortOrder === order && (
                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                )}
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
