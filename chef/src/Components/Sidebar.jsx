import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../../admin/src/assets/assets'
import { ChefContext } from '../Context/ChefContext'
import { WaiterContext } from '../Context/WaiterContext'

const SideBar = () => {

    const { cToken } = useContext(ChefContext)

    const { wToken } = useContext(WaiterContext)

    return (
        <div className='min-h-screen bg-white border-r'>
            {
                cToken && <ul className='text-black mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/dashboard'}>
                        <img src={assets.home_icon} alt="" />
                        <p>DashBoard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/orders'}>
                        <img src={assets.order_icon} alt="" />
                        <p>Orders</p>
                    </NavLink>

                </ul>
            }
            {
                wToken && <ul className='text-black mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/customer'}>
                        <img src={assets.people_icon} alt="" />
                        <p>Customer</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/myOrder'}>
                        <img src={assets.order_icon} alt="" />
                        <p>Orders</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/tip'}>
                        <img src={assets.order_icon} alt="" />
                        <p>Tip</p>
                    </NavLink>

                </ul>
            }
        </div>
    )
}

export default SideBar