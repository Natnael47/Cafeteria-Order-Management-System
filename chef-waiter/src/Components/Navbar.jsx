import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../../admin/src/assets/assets'
import { ChefContext } from '../Context/ChefContext'
import { WaiterContext } from '../Context/WaiterContext'

const Navbar = () => {

    const { cToken, setCToken } = useContext(ChefContext);

    const { wToken, setWToken } = useContext(WaiterContext);

    const navigate = useNavigate()

    const logout = () => {
        navigate('/')

        wToken && setWToken('')
        wToken && localStorage.removeItem('wToken')

        cToken && setCToken('')
        cToken && localStorage.removeItem('cToken')

    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b-2 border-black bg-[#F1FAF2]'>
            <div className='flex items-center gap-2 text-xs'>
                <img className='w-36 sm:w-40 cursor-pointer' src={assets.logo2} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-black font-semibold m-4 text-black'>{cToken ? 'Chef' : 'Waiter'}</p>
            </div>
            <button onClick={logout} className='bg-black text-white text-sm px-10 py-2 rounded-full font-semibold'>Logout</button>
        </div>
    )
}

export default Navbar