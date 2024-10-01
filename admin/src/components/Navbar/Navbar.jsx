import React from 'react'
import { assets } from '../../assets/assets'


const Navbar = ({ setToken }) => {
    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b-2 border-black bg-[#F1FAF2]'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.logo2} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-black font-semibold m-2 text-black'>Admin</p>
            </div>
            <button className='bg-black text-white text-sm px-10 py-2 rounded-full font-semibold' onClick={() => setToken('')}>Logout</button>
        </div>
    )
}

export default Navbar