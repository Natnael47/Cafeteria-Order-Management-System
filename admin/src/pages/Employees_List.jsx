import React, { useContext, useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const EmployeesList = () => {
    const { token, employees, getAllEmployees, navigate } = useContext(AdminContext);

    useEffect(() => {
        if (token) {
            getAllEmployees();
        }
    }, [token]);

    const handleEmployeeClick = (employeeId) => {
        navigate(`/employee-profile/${employeeId}`);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);

    // Filter and sort the employee list based on the search term
    const filteredEmployeeList = employees
        .filter((item) =>
            item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.position.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.firstName.localeCompare(b.firstName));

    // Paginate the employee list based on selected entries per page
    const paginatedEmployees = filteredEmployeeList.slice(0, entriesPerPage);

    return (
        <div className="flex flex-col m-5 w-full max-w-6.5xl overflow-scroll">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-800">Staff Records</h1>
                <div className="flex items-center space-x-4">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                        onClick={() => navigate('/add-employees')}
                    >
                        + New Employee
                    </button>
                    {/* Icon Button */}
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search and Show */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700">Show</label>
                    <select
                        className="border border-gray-300 rounded px-2 py-1"
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <label className="text-gray-700">entries</label>
                </div>
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Filter by name or position"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2"
                />
            </div>

            <div className="rounded-lg w-full max-h-[81vh] overflow-y-scroll">
                {/* Employee Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-1">
                    {paginatedEmployees.map((item) => (
                        <div
                            className="border border-gray-200 bg-white rounded-xl cursor-pointer group hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
                            key={item.id}
                            onClick={() => handleEmployeeClick(item.id)}
                        >
                            {/* Employee Image */}
                            <img
                                className="w-full max-h-[200px] object-cover rounded-t-xl"
                                src={`${backendUrl}/empIMG/${item.image}`}
                                alt={`${item.firstName} ${item.lastName}`}
                            />
                            {/* Employee Info */}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800 truncate group-hover:text-[#22C55E]">
                                    {item.firstName} {item.lastName}
                                </h2>
                                <p className="text-sm text-gray-600 truncate">{item.position}</p>
                                <p className="text-sm text-gray-600 truncate">Shift: {item.shift}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeesList;
