import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'

const About = () => {
    return (
        <div>
            <div className='text-center text-2xl pt-10 text-black'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className='my-10 flex  flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_us} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-800'>
                    <p>Welcome to CoZy Cafe, where we believe great food brings people together. Our mission is to serve fresh, delicious meals in a cozy and welcoming environment. With a wide variety of dishes, we cater to every taste and preference.</p>
                    <p>We pride ourselves on using high-quality ingredients sourced from local suppliers. Whether you're stopping by for a quick bite or a relaxing meal with friends, we are committed to making your dining experience enjoyable.</p>
                    <b className='text-gray-900'>OUR VISION</b>
                    <p>At COZY cafe, customer satisfaction is at the heart of everything we do. Our dedicated team ensures every meal is prepared with care, and we constantly seek ways to improve your experience. Visit us today and taste the difference!</p>
                </div>
            </div>

            <div>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>
            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
                    <b>Freshness</b>
                    <p>We use locally sourced, high-quality ingredients to deliver meals that are always fresh and full of flavor.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
                    <b>Service</b>
                    <p>Our team is committed to providing excellent customer service, ensuring every visit is pleasant and welcoming.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-700 cursor-pointer'>
                    <b>Variety</b>
                    <p>With a diverse menu, we offer something for everyone, catering to different tastes and dietary needs.</p>
                </div>
            </div>

        </div>
    )
}

export default About