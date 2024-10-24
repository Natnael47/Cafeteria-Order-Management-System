import React, { useContext, useEffect } from 'react';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const EmployeesList = () => {

    const { token, employees, getAllEmployees } = useContext(AdminContext);

    useEffect(() => {
        if (token) {
            getAllEmployees();
        }
    }, [token]);

    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-semibold'>All Employees</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {
                    employees.map((item, index) => (
                        <div className='border border-indigo-200 bg-white rounded-xl max-w-56 overflow-hidden cursor-pointer group hover:scale-105 transition-all' key={index}>
                            <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={backendUrl + "/empIMG/" + item.image} alt="" />
                            <div className='p-4'>
                                <p className='text-neutral-800 text-lg font-medium'>{item.firstName + " " + item.lastName}</p>
                                <p className='text-zinc-600 text-sm'>{item.position}</p>
                                <p className='text-zinc-600 text-sm'>Shift :{" " + item.shift}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default EmployeesList