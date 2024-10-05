import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <div className='min-h-screen bg-white border-r'>
            <div className='text-black mt-5'>
                <NavLink to='/dashboard' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.home_icon} alt='' />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>
                <NavLink to='/add' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.add_icon} alt='' />
                    <p className='hidden md:block'>Add Food</p>
                </NavLink>
                <NavLink to='/list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.order_icon} alt='' />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>
                <NavLink to='/orders' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.chef_icon} alt='' />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
                <NavLink to='/reports' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.report_icon} alt='' />
                    <p className='hidden md:block'>Reports</p>
                </NavLink>
                <NavLink to='/add-employees' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <img src={assets.add_icon} alt='' />
                    <p className='hidden md:block'>Add Employees</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar