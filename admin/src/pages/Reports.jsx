import { saveAs } from 'file-saver';
import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';

const Reports = () => {
    const { getReport, reports, time, setTime } = useContext(AdminContext);
    const [selectedTables, setSelectedTables] = useState({});
    const [expandedTables, setExpandedTables] = useState({});
    const [pageSize] = useState(6);
    const [currentPage, setCurrentPage] = useState({});

    useEffect(() => {
        getReport(time);
    }, [time]);

    const handleTimePeriodChange = (event) => setTime(event.target.value);

    const toggleTableSelection = (tableKey) => {
        setSelectedTables((prev) => ({
            ...prev,
            [tableKey]: !prev[tableKey],
        }));
    };

    const toggleExpandedView = (tableKey) => {
        setExpandedTables((prev) => ({
            ...prev,
            [tableKey]: !prev[tableKey],
        }));
    };

    const handlePageChange = (tableKey, direction) => {
        setCurrentPage((prev) => ({
            ...prev,
            [tableKey]: (prev[tableKey] || 0) + direction,
        }));
    };

    const downloadItemReport = (item) => {
        const content = JSON.stringify(item, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        saveAs(blob, `${item.id}_report.json`);
    };

    const handleExport = (type) => {
        const selectedReports = Object.keys(selectedTables)
            .filter((key) => selectedTables[key])
            .reduce((acc, key) => {
                acc[key] = reports[key];
                return acc;
            }, {});

        const reportContent = JSON.stringify(selectedReports, null, 2);
        const blob = new Blob([reportContent], { type: 'application/json' });

        if (type === 'pdf') {
            console.log('PDF export (mock)');
        } else if (type === 'word') {
            const file = new Blob([reportContent], { type: 'application/msword' });
            saveAs(file, `report_${time}.docx`);
        }
    };

    const renderTable = (title, tableKey, data = [], columns) => {
        // Ensure data is an array
        const validData = Array.isArray(data) ? data : [];

        const isExpanded = expandedTables[tableKey];
        const page = currentPage[tableKey] || 0;
        const paginatedData = isExpanded
            ? validData
            : validData.slice(page * pageSize, (page + 1) * pageSize);

        return (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
                    <div className="flex space-x-2">
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => toggleExpandedView(tableKey)}
                        >
                            {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${selectedTables[tableKey] ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} hover:opacity-90`}
                            onClick={() => toggleTableSelection(tableKey)}
                        >
                            {selectedTables[tableKey] ? 'Unselect' : 'Select'}
                        </button>
                    </div>
                </div>
                <table className="min-w-full mt-4 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            {columns.map((column) => (
                                <th key={column.key} className="px-6 py-3 border-b border-gray-200 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
                                    {column.label}
                                </th>
                            ))}
                            <th className="px-6 py-3 border-b border-gray-200"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-gray-700">
                                        {column.render ? column.render(row) : row[column.key]}
                                    </td>
                                ))}
                                <td className="px-6 py-4">
                                    <button
                                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                        onClick={() => downloadItemReport(row)}
                                    >
                                        Download
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!isExpanded && (
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            onClick={() => handlePageChange(tableKey, -1)}
                            disabled={page === 0}
                        >
                            Previous
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            onClick={() => handlePageChange(tableKey, 1)}
                            disabled={page >= Math.ceil(validData.length / pageSize) - 1}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="container mx-auto p-4">
            <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
                <label htmlFor="time-period" className="mr-2 font-medium text-gray-700">Select Time Period:</label>
                <select id="time-period" className="px-4 py-2 border border-gray-300 rounded" value={time} onChange={handleTimePeriodChange}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
            <div className="flex space-x-4 mb-6">
                <button
                    className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                    onClick={() => handleExport('pdf')}
                >
                    Export to PDF
                </button>
                <button
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                    onClick={() => handleExport('word')}
                >
                    Export to Word
                </button>
            </div>

            {renderTable('Top Selling Items', 'topSellingItems', reports.topSellingItems, [
                { key: 'name', label: 'Item Name' },
                { key: 'count', label: 'Sold Count' },
            ])}

            {renderTable('Inventory to Expire Soon', 'inventoryToExpireSoon', reports.inventoryToExpireSoon, [
                { key: 'inventoryId', label: 'Inventory ID' },
                { key: 'expiryDate', label: 'Expiry Date' },
            ])}

            {renderTable('Inventory Withdrawals', 'inventoryWithdrawals', reports.inventoryWithdrawals, [
                { key: 'inventoryId', label: 'Inventory ID' },
                { key: 'employeeId', label: 'Employee ID' },
                { key: 'reason', label: 'Reason' },
                { key: 'quantity', label: 'Quantity' },
            ])}

            {renderTable('Employee Work Logs', 'employeeWorkLogs', reports.employeeWorkLogs, [
                { key: 'id', label: 'Log ID' },
                { key: 'employeeId', label: 'Employee ID' },
                { key: 'loginTime', label: 'Login Time' },
                { key: 'logoutTime', label: 'Logout Time' },
            ])}

            {renderTable('Chef Order Summary', 'chefOrderSummary', reports.chefOrderSummary, [
                { key: 'chefId', label: 'Chef ID' },
                { key: 'orderCount', label: 'Order Count' },
                { key: 'totalTime', label: 'Total Time' },
                { key: 'avgTime', label: 'Average Time' },
            ])}

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-700">Orders Total Income</h2>
                <p className="mt-4 text-lg text-gray-600">Total Income: ${reports.ordersTotalIncome}</p>
            </div>
        </div>
    );
};

export default Reports;
