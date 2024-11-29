import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';

const AddEmployeeModal = ({ isOpen, onClose }) => {
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
        try {
            if (!empImg) {
                return toast.error('Image not Selected');
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

            const { data } = await axios.post(backendUrl + '/api/admin/add-employee', formData, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                resetForm();
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
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
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-md w-full max-w-5xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
                <form onSubmit={onSubmitHandler}>
                    {/* Upload Employee Picture */}
                    <div className="flex items-center gap-4 mb-8">
                        <label htmlFor="emp-img">
                            <img
                                className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer"
                                src={empImg ? URL.createObjectURL(empImg) : assets.upload_area2}
                                alt="Upload Employee"
                            />
                        </label>
                        <input onChange={(e) => setEmpImg(e.target.files[0])} type="file" id="emp-img" hidden />
                        <p>Upload Employee Picture</p>
                    </div>

                    {/* Form Sections */}
                    <div className="flex flex-col lg:flex-row items-start gap-10">
                        {/* Left Section */}
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p>Employee Name</p>
                                <div className="flex gap-3">
                                    <input
                                        onChange={(e) => setFirstName(e.target.value)}
                                        value={firstName}
                                        type="text"
                                        placeholder="First Name"
                                        required
                                        className="border rounded px-3 py-2"
                                    />
                                    <input
                                        onChange={(e) => setLastName(e.target.value)}
                                        value={lastName}
                                        type="text"
                                        placeholder="Last Name"
                                        required
                                        className="border rounded px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Gender</p>
                                <select
                                    onChange={(e) => setGender(e.target.value)}
                                    value={gender}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Employee Email</p>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="border rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Employee Password</p>
                                <input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="border rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Experience</p>
                                <select
                                    onChange={(e) => setExperience(e.target.value)}
                                    value={experience}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="1 Year">1 Year</option>
                                    <option value="2 Year">2 Years</option>
                                    <option value="3 Year">3 Years</option>
                                    <option value="4 Year">4 Years</option>
                                    <option value="5 Year">5 Years</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Salary</p>
                                <input
                                    onChange={(e) => setSalary(e.target.value)}
                                    value={salary}
                                    type="number"
                                    placeholder="Salary"
                                    required
                                    className="border rounded px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="w-full lg:flex-1 flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <p>Phone</p>
                                <input
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    type="text"
                                    placeholder="Phone"
                                    required
                                    className="border rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Position</p>
                                <select
                                    onChange={(e) => setPosition(e.target.value)}
                                    value={position}
                                    className="border rounded px-3 py-2"
                                >
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

                            <div className="flex flex-col gap-1">
                                <p>Shift</p>
                                <select
                                    onChange={(e) => setShift(e.target.value)}
                                    value={shift}
                                    className="border rounded px-3 py-2"
                                >
                                    <option value="Opening Shift">Opening Shift</option>
                                    <option value="Midday Shift">Midday Shift</option>
                                    <option value="Afternoon Shift">Afternoon Shift</option>
                                    <option value="Closing Shift">Closing Shift</option>
                                    <option value="Weekend Shift">Weekend Shift</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Education</p>
                                <input
                                    onChange={(e) => setEducation(e.target.value)}
                                    value={education}
                                    type="text"
                                    placeholder="Education"
                                    required
                                    className="border rounded px-3 py-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>Address</p>
                                <input
                                    onChange={(e) => setAddress1(e.target.value)}
                                    value={address1}
                                    type="text"
                                    placeholder="Address Line 1"
                                    required
                                    className="border rounded px-3 py-2"
                                />
                                <input
                                    onChange={(e) => setAddress2(e.target.value)}
                                    value={address2}
                                    type="text"
                                    placeholder="Address Line 2"
                                    className="border rounded px-3 py-2 mt-2"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p>About</p>
                                <textarea
                                    onChange={(e) => setAbout(e.target.value)}
                                    value={about}
                                    placeholder="Write something about the employee"
                                    className="border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-500 px-6 py-2 text-white rounded hover:bg-green-600">
                            Add Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeModal;
