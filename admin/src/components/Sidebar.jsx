import { BookUser, ChefHat, ClipboardList, House, ShoppingBasket, Users } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    const iconSize = 28; // Adjust this value to set the size of the icons
    const iconColor = '#000000'; // Set your desired icon color here (e.g., dark gray)

    return (
        <div className='min-h-[105vh] bg-white border-r'>
            <div className='text-black mt-5'>
                <NavLink to='/' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <House size={iconSize} color={iconColor} />
                    <p className='hidden md:block'>Dashboard</p>
                </NavLink>
                <NavLink to='/list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <ShoppingBasket size={iconSize} color={iconColor} />
                    <p className='hidden md:block'>Food Items</p>
                </NavLink>
                <NavLink to='/orders' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <ChefHat size={iconSize} color={iconColor} />
                    <p className='hidden md:block'>Orders</p>
                </NavLink>
                <NavLink to='/employees-list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <BookUser size={iconSize} color={iconColor} />
                    <p className='hidden md:block'>Employee List</p>
                </NavLink>
                <NavLink to='/reports' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <ClipboardList size={iconSize} color={iconColor} />
                    <p className='hidden md:block'>Reports</p>
                </NavLink>
                <NavLink to='/users' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
                    <Users size={iconSize} color={iconColor} />
                    <p className='hidden md:block'>Customer</p>
                </NavLink>
            </div>
        </div>
    )
}

export default Sidebar

// {/* Sidebar */ }
// <div className="w-1/5 bg-green-500 text-white">
//     <div className="p-4 font-bold text-lg">PB Fitness Store</div>
//     <nav className="space-y-2 p-4">
//         <button className="block w-full text-left py-2 px-4 hover:bg-green-600">Dashboard</button>
//         <button className="block w-full text-left py-2 px-4 hover:bg-green-600">Sales</button>
//         <button className="block w-full text-left py-2 px-4 hover:bg-green-600">Inventory</button>
//         <div>
//             <button className="block w-full text-left py-2 px-4 hover:bg-green-600">
//                 Stock Control
//             </button>
//             <div className="ml-4 space-y-2">
//                 <button className="block w-full text-left py-2 px-4 hover:bg-green-700">Purchase Orders</button>
//                 <button className="block w-full text-left py-2 px-4 bg-green-700 rounded">Inventory Purchase</button>
//                 <button className="block w-full text-left py-2 px-4 hover:bg-green-700">Stock Adjustments</button>
//             </div>
//         </div>
//         <button className="block w-full text-left py-2 px-4 hover:bg-green-600">Suppliers</button>
//     </nav>
// </div>