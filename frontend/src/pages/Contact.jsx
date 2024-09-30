import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'

const Contact = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 '>
                <Title text1={'Contact'} text2={'Us'} />
            </div>

            <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
                <img className='w-full md:max-w-[360px]' src={assets.kare} alt="" />
                <div className='flex flex-col justify-center items-start gap-6'>
                    <p className='font-semibold text-lg text-gray-600'>Our Location</p>
                    <p className='text-gray-500'>Lebu, Addis Ababa <br /> Ethiopia</p>
                    <p className='text-gray-500'>Tel : (251) 963-8965 <br /> Email :Contact@order.com</p>
                    <p className='font-semibold text-lg text-gray-600'>Careers at PRESCRIPTO</p>
                    <p className='text-gray-500'>Learn more about our Team anj service</p>
                    <button className='border border-black px-8 py-4 text-sm hover:bg-primary hover:border-primary hover:text-white transition-all duration-400'>Contact us</button>
                </div>
            </div>

        </div>
    )
}

export default Contact