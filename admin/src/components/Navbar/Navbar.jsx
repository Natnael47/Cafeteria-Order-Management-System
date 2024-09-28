import React from 'react'
import { assets } from '../../assets/assets'


const Navbar = ({ setToken }) => {
    return (
        <div className='flex items-center py-2 px-[4%] justify-between'>
            <img className='w-[max(10%,80px)]' src={assets.logo2} alt='' />
            <button className='bg-gray-900 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm' onClick={() => setToken('')}>Logout</button>
        </div>
    )
}

export default Navbar