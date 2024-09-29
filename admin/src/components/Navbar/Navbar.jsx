import React from 'react'
import { assets } from '../../assets/assets'


const Navbar = ({ setToken }) => {
    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b-2 border-black bg-[#F1FAF2]'>
            <img className='w-[max(10%,80px)]' src={assets.logo2} alt='' />
            <button className='bg-black text-white text-sm px-10 py-2 rounded-full font-semibold' onClick={() => setToken('')}>Logout</button>
        </div>
    )
}

export default Navbar