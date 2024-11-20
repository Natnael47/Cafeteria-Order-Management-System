import { useEffect, useState } from "react";

const SortingDropdown = ({ onSortChange }) => {
    // Get sortAttribute and sortOrder from localStorage if they exist, or use defaults
    const [sortAttribute, setSortAttribute] = useState(() => {
        return localStorage.getItem("sortAttribute") || "name";
    });
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem("sortOrder") || "ascending";
    });

    // Update localStorage whenever sortAttribute or sortOrder changes
    useEffect(() => {
        localStorage.setItem("sortAttribute", sortAttribute);
        localStorage.setItem("sortOrder", sortOrder);
    }, [sortAttribute, sortOrder]);

    const handleSortChange = (e) => {
        const [attribute, order] = e.target.value.split(",");
        setSortAttribute(attribute);
        setSortOrder(order);
        onSortChange(attribute, order);  // Pass the selected values back to parent
    };

    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Status", value: "status" },
        { label: "Quantity", value: "quantity" },
        { label: "Price", value: "pricePerUnit" },
        { label: "Category", value: "category" },
        { label: "Date Modified", value: "dateUpdated" },  // Make sure the key matches your data
    ];

    return (
        <div className="relative inline-block">
            <select
                onChange={handleSortChange}
                value={`${sortAttribute},${sortOrder}`}
                className="appearance-none border border-gray-300 rounded px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
            >
                <optgroup label="Sort By">
                    {sortOptions.map((option) => (
                        <option
                            key={option.value}
                            value={`${option.value},${sortOrder}`}
                            className="relative pl-8"
                            style={{
                                fontWeight: sortAttribute === option.value ? "bold" : "normal",
                            }}
                        >
                            <span className="ml-2">{option.label}</span>
                        </option>
                    ))}
                </optgroup>

                <optgroup label="Order">
                    <option
                        value={`${sortAttribute},ascending`}
                        className="relative pl-8"
                        style={{
                            fontWeight: sortOrder === "ascending" ? "bold" : "normal",
                        }}
                    >
                        <span className="ml-2">Ascending</span>
                    </option>
                    <option
                        value={`${sortAttribute},descending`}
                        className="relative pl-8"
                        style={{
                            fontWeight: sortOrder === "descending" ? "bold" : "normal",
                        }}
                    >
                        <span className="ml-2">Descending</span>
                    </option>
                </optgroup>
            </select>

            {/* Dropdown symbol (arrow) */}
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">▼</span>
        </div>
    );
};

export default SortingDropdown;
