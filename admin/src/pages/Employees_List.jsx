import React, { useContext, useEffect } from 'react';
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

    return (
        <div className="flex flex-col m-5 w-full max-w-6xl max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Employee List</h1>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={() => navigate('/add-employees')}>
                        + New
                    </button>
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Search and Show */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700">Show</label>
                    <select className="border border-gray-300 rounded px-2 py-1">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <label className="text-gray-700">entries</label>
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-gray-300 rounded px-4 py-2"
                />
            </div>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {employees.map((item) => (
                    <div
                        className='border border-indigo-200 bg-white rounded-xl cursor-pointer group hover:scale-105 transition-all hover:bg-[#DDF7DF] duration-500'
                        style={{ width: '210px', height: '320px' }} // Fixed size for uniformity
                        key={item.id}
                        onClick={() => handleEmployeeClick(item.id)}
                    >
                        <img
                            className='w-full h-[160px] object-cover bg-indigo-50 group-hover:bg-[#DDF7DF] transition-all duration-500'
                            src={`${backendUrl}/empIMG/${item.image}`}
                            alt=""
                        />

                        <div className='p-4'>
                            <p className='text-neutral-800 text-lg font-medium truncate'>{item.firstName + " " + item.lastName}</p>
                            <p className='text-zinc-600 text-sm truncate'>{item.position}</p>
                            <p className='text-zinc-600 text-sm truncate'>Shift: {item.shift}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeesList;
