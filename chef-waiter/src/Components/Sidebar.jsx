import { ArchiveRestore, ClipboardList, LayoutDashboard, PackageOpen, ShieldQuestion, Store, UserRoundPen, Users } from 'lucide-react'
import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ChefContext } from '../Context/ChefContext'
import { InventoryContext } from '../Context/InventoryContext'

const SideBar = () => {

    const { cToken } = useContext(ChefContext)

    const { iToken } = useContext(InventoryContext)

    const iconSize = 28; // Adjust this value to set the size of the icons
    const iconColor = '#000000'; // Set your desired icon color here (e.g., dark gray)

    return (
        <div className='min-h-screen bg-white border-r'>
            {
                cToken && <ul className='text-black mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/dashboard'}>
                        <LayoutDashboard size={iconSize} color={iconColor} />
                        <p>DashBoard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/orders'}>
                        <PackageOpen size={iconSize} color={iconColor} />
                        <p>Orders</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/request'}>
                        <ShieldQuestion size={iconSize} color={iconColor} />
                        <p>Request</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/profile'}>
                        <UserRoundPen size={iconSize} color={iconColor} />
                        <p>Profile</p>
                    </NavLink>

                </ul>
            }
            {
                iToken && <ul className='text-black mt-5'>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/inv-dashboard'}>
                        <LayoutDashboard size={iconSize} color={iconColor} />
                        <p>Dashboard</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/reports'}>
                        <ClipboardList size={iconSize} color={iconColor} />
                        <p>Report</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/suppliers'}>
                        <Users size={iconSize} color={iconColor} />
                        <p>Suppliers</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/inventory'}>
                        <Store size={iconSize} color={iconColor} />
                        <p>Inventory</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/inv-orders'}>
                        <PackageOpen size={iconSize} color={iconColor} />
                        <p>Orders</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/store'}>
                        <ArchiveRestore size={iconSize} color={iconColor} />
                        <p>Manage Stock</p>
                    </NavLink>

                    <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/profile'}>
                        <UserRoundPen size={iconSize} color={iconColor} />
                        <p>Profile</p>
                    </NavLink>

                </ul>
            }
        </div>
    )
}

export default SideBar