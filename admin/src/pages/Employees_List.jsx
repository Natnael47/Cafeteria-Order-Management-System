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
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-semibold'>All Employees</h1>
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
