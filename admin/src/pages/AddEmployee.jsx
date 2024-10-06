import React from 'react'
import { assets } from '../assets/assets'

const AddEmployee = () => {
    return (
        <form className='m-5 w-full'>

            <p className="mb-3 text-lg font-semibold">Add Employees</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="emp-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={assets.upload_area2} alt="" />
                    </label>
                    <input type="file" id='emp-img' hidden />
                    <p>Upload Employee <br /> Picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Employee Name</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Gender</p>
                            <select className='border rounded px-3 py-2' name="" id="">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Employee Email</p>
                            <input className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Employee Password</p>
                            <input className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select className='border rounded px-3 py-2' name="" id="">
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Phone</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='+251' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Position</p>
                            <select className='border rounded px-3 py-2' name="" id="">
                                <option value="Executive Chef">Executive Chef</option>
                                <option value="Pastry Chef">Pastry Chef</option>
                                <option value="Waitstaff/Servers">Waitstaff/Servers</option>
                                <option value="Baristas">Baristas</option>
                                <option value="Bartenders">Bartenders</option>
                                <option value="Cashier">Cashier</option>
                                <option value="Inventory Manager">Inventory Manager</option>
                                <option value="Bar Manager">Bar Manager</option>
                                <option value="Cleaner/Janitorial Staff">Cleaner/Janitorial Staff</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Shift</p>
                            <select className='border rounded px-3 py-2' name="" id="">
                                <option value="Opening Shift">"Opening Shift (Morning Shift)</option>
                                <option value="Midday Shift">Midday Shift (Lunch Shift)</option>
                                <option value="Afternoon Shift">Afternoon Shift</option>
                                <option value="Closing Shift">Closing Shift (Night Shift)</option>
                                <option value="Weekend Shift">Weekend/Part-Time Shift</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='Education' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input className='border rounded px-3 py-2 mt-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>Employee Info</p>
                    <textarea className='w-full px-4 pt-2 border rounded' placeholder='Any Specialty about Employee' rows={5} required />
                </div>

                <button className='bg-black px-10 py-3 mt-4 text-white rounded-md hover:bg-primary'>Add Employee</button>

            </div>

        </form>
    )
}

export default AddEmployee