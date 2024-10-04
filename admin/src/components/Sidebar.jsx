import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
    return (
        <div className='w-[18%] min-h-screen border-r-2'>
            <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
                <NavLink to='/dashboard' className="flex items-center gap-3 border border-black border-r-0 px-3 py-2 rounded-1">
                    <img src={assets.home_icon} alt='' />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>
                <NavLink to='/add' className="flex items-center gap-3 border border-black border-r-0 px-3 py-2 rounded-1" >
                    <img src={assets.add_icon} alt='' />
                    <p className='hidden md:block'>Add Food</p>
                </NavLink>
                <NavLink to='/list' className="flex items-center gap-3 border border-black border-r-0 px-3 py-2 rounded-1">
                    <img src={assets.order_icon} alt='' />
                    <p className='hidden md:block'>List Items</p>
                </NavLink>
                <NavLink to='/orders' className="flex items-center gap-3 border border-black border-r-0 px-3 py-2 rounded-1">
                    <img src={assets.chef_icon} alt='' />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
                <NavLink to='/reports' className="flex items-center gap-3 border border-black border-r-0 px-3 py-2 rounded-1">
                    <img src={assets.report_icon} alt='' />
                    <p className='hidden md:block'>Reports</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar