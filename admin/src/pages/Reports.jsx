import { saveAs } from 'file-saver';
import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';

const Reports = () => {
    const { getReport, reports, time, setTime } = useContext(AdminContext);
    const [selectedTables, setSelectedTables] = useState({}); // Track selected tables for export

    // Load report data when the component mounts or when time period changes
    useEffect(() => {
        getReport(time);
    }, [time]);

    // Handle time period change
    const handleTimePeriodChange = (event) => {
        setTime(event.target.value);
    };

    // Toggle table selection
    const toggleTableSelection = (tableKey) => {
        setSelectedTables((prev) => ({
            ...prev,
            [tableKey]: !prev[tableKey],
        }));
    };

    // Handle export for selected tables
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
            console.log('PDF export (mock)'); // PDF export logic placeholder
        } else if (type === 'word') {
            const file = new Blob([reportContent], { type: 'application/msword' });
            saveAs(file, `report_${time}.docx`);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">Reports Dashboard</h1>

            <div className="flex flex-wrap justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <label htmlFor="time-period" className="text-lg font-medium">Time Period:</label>
                    <select
                        id="time-period"
                        value={time}
                        onChange={handleTimePeriodChange}
                        className="border rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleExport('pdf')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                    >
                        Export PDF
                    </button>
                    <button
                        onClick={() => handleExport('word')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                    >
                        Export Word
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Inventory Overview */}
                <div className="p-6 bg-white shadow rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Inventory Overview</h2>
                        <input
                            type="checkbox"
                            checked={selectedTables.inventoryOverview || false}
                            onChange={() => toggleTableSelection('inventoryOverview')}
                            className="w-5 h-5"
                        />
                    </div>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Category</th>
                                <th className="border p-2">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports?.inventoryOverview?.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="border p-2">{item.id}</td>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2">{item.category}</td>
                                    <td className="border p-2">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Employee Work Logs */}
                <div className="p-6 bg-white shadow rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Employee Work Logs</h2>
                        <input
                            type="checkbox"
                            checked={selectedTables.employeeWorkLogs || false}
                            onChange={() => toggleTableSelection('employeeWorkLogs')}
                            className="w-5 h-5"
                        />
                    </div>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Employee</th>
                                <th className="border p-2">Login Time</th>
                                <th className="border p-2">Logout Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports?.employeeWorkLogs?.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        {log.employee?.firstName} {log.employee?.lastName}
                                    </td>
                                    <td className="border p-2">{log.loginTime}</td>
                                    <td className="border p-2">{log.logoutTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
