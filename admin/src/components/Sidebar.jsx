import { BookUser, ClipboardList, CupSoda, HandPlatter, House, Users, Utensils } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    // Default colors for icons
    const defaultColors = {
        dashboard: '#000000',
        foodItems: '#000000',
        orders: '#000000',
        employeeList: '#000000',
        reports: '#000000',
        customer: '#000000',
    };

    // Active colors for icons
    const activeColors = {
        dashboard: '#FFFFFF',
        foodItems: '#FFFFFF',
        orders: '#FFFFFF',
        employeeList: '#FFFFFF',
        reports: '#FFFFFF',
        customer: '#FFFFFF',
    };

    return (
        <div className="min-h-screen bg-white border-r">
            <div className="text-black mt-5">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <House
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.dashboard : defaultColors.dashboard}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Dashboard
                            </p>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/list"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Utensils
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.foodItems : defaultColors.foodItems}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Menu Items
                            </p>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/list-drink"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <CupSoda
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.foodItems : defaultColors.foodItems}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Drinks
                            </p>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <HandPlatter
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.orders : defaultColors.orders}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Orders
                            </p>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/employees-list"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <BookUser
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.employeeList : defaultColors.employeeList}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Employee List
                            </p>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <ClipboardList
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.reports : defaultColors.reports}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Reports
                            </p>
                        </>
                    )}
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transform transition-transform duration-300 ease-in-out ${isActive ? 'bg-[#22C55E] scale-95 border-r-4 rounded-md shadow-lg border-[#22C55E]' : ''}`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Users
                                size={isActive ? 32 : 28}
                                color={isActive ? activeColors.customer : defaultColors.customer}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <p
                                className={`hidden md:block transition-colors duration-300 ease-in-out ${isActive ? 'text-white font-bold' : 'text-black'}`}
                            >
                                Customer
                            </p>
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;


// import { BookUser, ChefHat, ClipboardList, House, ShoppingBasket, Users } from 'lucide-react';
// import React from 'react';
// import { NavLink } from 'react-router-dom';
//
// const Sidebar = () => {
//
//     const iconSize = 28; // Adjust this value to set the size of the icons
//     const iconColor = '#000000'; // Set your desired icon color here (e.g., dark gray)
//
//     return (
//         <div className='min-h-[105vh] bg-white border-r'>
//             <div className='text-black mt-5'>
//                 <NavLink to='/' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
//                     <House size={iconSize} color={iconColor} />
//                     <p className='hidden md:block'>Dashboard</p>
//                 </NavLink>
//                 <NavLink to='/list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
//                     <ShoppingBasket size={iconSize} color={iconColor} />
//                     <p className='hidden md:block'>Food Items</p>
//                 </NavLink>
//                 <NavLink to='/orders' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
//                     <ChefHat size={iconSize} color={iconColor} />
//                     <p className='hidden md:block'>Orders</p>
//                 </NavLink>
//                 <NavLink to='/employees-list' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
//                     <BookUser size={iconSize} color={iconColor} />
//                     <p className='hidden md:block'>Employee List</p>
//                 </NavLink>
//                 <NavLink to='/reports' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
//                     <ClipboardList size={iconSize} color={iconColor} />
//                     <p className='hidden md:block'>Reports</p>
//                 </NavLink>
//                 <NavLink to='/users' className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#DDF7DF] border-r-4 border-primary' : ''}`}>
//                     <Users size={iconSize} color={iconColor} />
//                     <p className='hidden md:block'>Customer</p>
//                 </NavLink>
//             </div>
//         </div>
//     )
// }
//
// export default Sidebar