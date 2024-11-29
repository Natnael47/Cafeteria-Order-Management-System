import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const AddEmployee = () => {

    const { token, navigate } = useContext(AdminContext);

    const [empImg, setEmpImg] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Male');
    const [phone, setPhone] = useState('');
    const [position, setPosition] = useState('Executive Chef');
    const [shift, setShift] = useState('Opening Shift');
    const [education, setEducation] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [salary, setSalary] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [about, setAbout] = useState('');

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        // Add employee data to the database here
        try {
            if (!empImg) {
                return toast.error('Image not Selected')
            }

            const formData = new FormData();
            formData.append('image', empImg);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('gender', gender);
            formData.append('phone', phone);
            formData.append('Position', position);
            formData.append('shift', shift);
            formData.append('education', education);
            formData.append('experience', experience);
            formData.append('salary', Number(salary));
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
            formData.append('about', about);

            //console log formData
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            })

            const { data } = await axios.post(backendUrl + '/api/admin/add-employee', formData, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                // Clear form inputs here
                setEmpImg(false);
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setGender('Male');
                setPhone('');
                setPosition('Executive Chef');
                setShift('Opening Shift');
                setEducation('');
                setExperience('1 Year');
                setSalary('');
                setAddress1('');
                setAddress2('');
                setAbout('');
                () => navigate('/employees-list')
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className="mb-3 text-lg font-semibold">Add Employees</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="emp-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={empImg ? URL.createObjectURL(empImg) : assets.upload_area2} alt="" />
                    </label>
                    <input onChange={(e) => setEmpImg(e.target.files[0])} type="file" id='emp-img' hidden />
                    <p>Upload Employee <br /> Picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Employee Name</p>
                            <div className='flex flex-row gap-3'>
                                <input onChange={(e) => setFirstName(e.target.value)} value={firstName} className='border rounded px-3 py-2' type="text" placeholder='First Name' required />
                                <input onChange={(e) => setLastName(e.target.value)} value={lastName} className='border rounded px-3 py-2' type="text" placeholder='Last Name' required />
                            </div>

                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Gender</p>
                            <select onChange={(e) => setGender(e.target.value)} value={gender} className='border rounded px-3 py-2' name="" id="gender">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Employee Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Employee Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' name="" id="experiance">
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Year</option>
                                <option value="3 Year">3 Year</option>
                                <option value="4 Year">4 Year</option>
                                <option value="5 Year">5 Year</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Salary</p>
                            <input onChange={(e) => setSalary(e.target.value)} value={salary} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="phone-input" className="text-sm font-medium">
                                Phone
                            </label>
                            <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 focus-within:ring focus-within:ring-green-500">
                                <span className="text-gray-500 font-medium text-lg">+251</span>
                                <input
                                    id="phone-input"
                                    onChange={(e) => {
                                        let value = e.target.value;

                                        // Remove non-digit characters
                                        value = value.replace(/\D/g, "");

                                        // If the number starts with "0", limit to 10 digits
                                        if (value.startsWith("0")) {
                                            value = value.slice(1); // Remove the leading "0"
                                        }

                                        // Limit to a maximum of 9 digits (after "0" is removed if present)
                                        value = value.slice(0, 9);

                                        // Update state with the full formatted phone number
                                        setPhone(`+251 ${value}`);
                                    }}
                                    value={phone.startsWith("+251") ? phone.slice(5) : phone} // Display only the local part in the input
                                    className="flex-1 outline-none border-none text-lg pl-2"
                                    type="text"
                                    placeholder="912345678"
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Position</p>
                            <select onChange={(e) => setPosition(e.target.value)} value={position} className='border rounded px-3 py-2' name="" id="position">
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
                            <select onChange={(e) => setShift(e.target.value)} value={shift} className='border rounded px-3 py-2' name="" id="shift">
                                <option value="Opening Shift">"Opening Shift (Morning Shift)</option>
                                <option value="Midday Shift">Midday Shift (Lunch Shift)</option>
                                <option value="Afternoon Shift">Afternoon Shift</option>
                                <option value="Closing Shift">Closing Shift (Night Shift)</option>
                                <option value="Weekend Shift">Weekend/Part-Time Shift</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setEducation(e.target.value)} value={education} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2 mt-2' type="text" placeholder='Address 2' required />
                        </div>

                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>Employee Info</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Any Specialty about Employee' rows={5} required />
                </div>

                <button className='bg-green-400 px-10 py-3 mt-4 text-white rounded-md hover:bg-primary'>Add Employee</button>
                <button className='bg-gray-300 px-10 py-3 mt-4 ml-3 text-gray-900 rounded-md hover:bg-gray-400' onClick={() => navigate('/employees-list')}>Cancel</button>

            </div>

        </form>
    )
}

export default AddEmployee