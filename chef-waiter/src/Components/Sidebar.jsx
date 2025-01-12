import {
    ArrowUpDown,
    HandPlatter,
    LayoutDashboard,
    PackageOpen,
    ShieldQuestion,
    Store,
    UserRoundPen,
    Users
} from "lucide-react";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ChefContext } from "../Context/ChefContext";
import { InventoryContext } from "../Context/InventoryContext";

const SideBar = () => {
    const { cToken } = useContext(ChefContext);
    const { iToken } = useContext(InventoryContext);

    // Default and Active Icon Styles
    const defaultIconSize = 28;
    const activeIconSize = 32;
    const defaultIconColor = "#000000";
    const activeIconColor = "#FFFFFF";

    return (
        <div className="min-h-screen bg-white border-r">
            {cToken && (
                <ul className="text-black mt-5">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md "
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <LayoutDashboard
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Dashboard
                                </p>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md "
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <HandPlatter
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Orders
                                </p>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/request"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md "
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <ShieldQuestion
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Request
                                </p>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <UserRoundPen
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Profile
                                </p>
                            </>
                        )}
                    </NavLink>
                </ul>
            )}

            {iToken && (
                <ul className="text-black mt-5">
                    <NavLink
                        to="/inv-dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <LayoutDashboard
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Dashboard
                                </p>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/inventory"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Store
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Inventory
                                </p>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/suppliers"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Users
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Suppliers
                                </p>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/inv-orders"
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md "
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <PackageOpen
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Orders & Requests
                                </p>
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to='/store'
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md "
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <ArrowUpDown
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Manage Stock
                                </p>
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to='/profile'
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-transform duration-300 ease-in-out ${isActive
                                ? "bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]"
                                : "hover:bg-gray-100  hover:scale-95 hover:rounded-md "
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <UserRoundPen
                                    size={isActive ? activeIconSize : defaultIconSize}
                                    color={isActive ? activeIconColor : defaultIconColor}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <p
                                    className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? "text-white font-bold" : "text-black"
                                        }`}
                                >
                                    Profile
                                </p>
                            </>
                        )}
                    </NavLink>

                </ul>
            )}
        </div>
    );
};

export default SideBar;






// import { ArchiveRestore, ClipboardList, LayoutDashboard, PackageOpen, ShieldQuestion, Store, UserRoundPen, Users } from 'lucide-react'
// import React, { useContext } from 'react'
// import { NavLink } from 'react-router-dom'
// import { ChefContext } from '../Context/ChefContext'
// import { InventoryContext } from '../Context/InventoryContext'
//
// const SideBar = () => {
//
//     const { cToken } = useContext(ChefContext)
//
//     const { iToken } = useContext(InventoryContext)
//
//     const iconSize = 28; // Adjust this value to set the size of the icons
//     const iconColor = '#000000'; // Set your desired icon color here (e.g., dark gray)
//
//     return (
//         <div className='min-h-screen bg-white border-r'>
//             {
//                 cToken && <ul className='text-black mt-5'>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/dashboard'}>
//                         <LayoutDashboard size={iconSize} color={iconColor} />
//                         <p>DashBoard</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/orders'}>
//                         <PackageOpen size={iconSize} color={iconColor} />
//                         <p>Orders</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/request'}>
//                         <ShieldQuestion size={iconSize} color={iconColor} />
//                         <p>Request</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/profile'}>
//                         <UserRoundPen size={iconSize} color={iconColor} />
//                         <p>Profile</p>
//                     </NavLink>
//
//                 </ul>
//             }
//             {
//                 iToken && <ul className='text-black mt-5'>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/inv-dashboard'}>
//                         <LayoutDashboard size={iconSize} color={iconColor} />
//                         <p>Dashboard</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/reports'}>
//                         <ClipboardList size={iconSize} color={iconColor} />
//                         <p>Report</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/suppliers'}>
//                         <Users size={iconSize} color={iconColor} />
//                         <p>Suppliers</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/inventory'}>
//                         <Store size={iconSize} color={iconColor} />
//                         <p>Inventory</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/inv-orders'}>
//                         <PackageOpen size={iconSize} color={iconColor} />
//                         <p>Orders</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/store'}>
//                         <ArchiveRestore size={iconSize} color={iconColor} />
//                         <p>Manage Stock</p>
//                     </NavLink>
//
//                     <NavLink className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`} to={'/profile'}>
//                         <UserRoundPen size={iconSize} color={iconColor} />
//                         <p>Profile</p>
//                     </NavLink>
//
//                 </ul>
//             }
//         </div>
//     )
// }
//
// export default SideBar
