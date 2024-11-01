import React from 'react'
import { assets } from '../assets/assets'

const Feedback = () => {
    return (
        <div className="mt-12 text-center p-5 bg-[#f4f8f4]">
            <h2 className="text-2xl font-bold mb-5">What Our Customers Say?</h2>
            <div className="bg-[#D7F6DA] rounded-lg shadow-md p-5 w-72 mx-auto text-center">
                <img
                    src={assets.person}
                    alt="Customer"
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-2.5"
                />
                <h3 className="mt-2.5 mb-2.5 text-lg text-gray-800">Lydia</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                    Cozy Cafe is a family-owned business that has been serving the
                    community for over 10 years. We are dedicated to providing
                    high-quality food and exceptional customer service.
                </p>
                <div className="flex justify-center mt-2.5 space-x-1 text-yellow-500 text-xl">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                </div>
            </div>
        </div>
    )
}

export default Feedback
