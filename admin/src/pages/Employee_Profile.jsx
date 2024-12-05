import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-modal";
import { useParams } from 'react-router-dom';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';
Modal.setAppElement("#root");

const Employee_Profile = () => {
    const { employeeId } = useParams();
    const { getEmployeeData, employeeProfile, navigate, updateEmployeeData, deleteEmployee } = useContext(AdminContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: 'Male',
        phone: '',
        position: 'Executive Chef',
        shift: 'Opening Shift',
        education: '',
        experience: '1 Year',
        salary: '',
        address: { line1: '', line2: '' },
        about: '',
        image: null,
    });

    const [originalImage, setOriginalImage] = useState(null);

    useEffect(() => {
        if (employeeId && !isEditing) {
            getEmployeeData(employeeId);
        }
    }, [employeeId, isEditing, getEmployeeData]);

    useEffect(() => {
        if (employeeProfile) {
            setFormData({
                ...employeeProfile,
                address: employeeProfile.address || { line1: '', line2: '' },
                image: `${backendUrl}/empIMG/${employeeProfile.image}`,
            });
            setOriginalImage(employeeProfile.image);
        }
    }, [employeeProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setFormData({
            ...employeeProfile,
            address: employeeProfile.address || { line1: '', line2: '' },
            image: `${backendUrl}/empIMG/${employeeProfile.image}`,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        await updateEmployeeData(formData, employeeId);
        setIsEditing(false); // Exit edit mode
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, image: file }));
    };

    const handleDelete = async () => {
        await deleteEmployee(employeeId); // Call the context function
    };

    return (
        <div className="m-5 w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-5">{isEditing ? 'Edit Employee' : 'Employee Profile'}</h1>
            <div className="bg-white shadow-lg px-8 py-8 border rounded-lg w-full max-w-6xl max-h-[78vh] overflow-y-scroll">
                {isEditing ? (
                    <form onSubmit={handleSave} className="text-gray-600">
                        <div className="flex items-center gap-6 mb-8">
                            <label htmlFor="emp-img">
                                <img
                                    className="w-24 h-24 rounded-full object-cover cursor-pointer border-2 border-indigo-400 hover:border-indigo-600 transition-all"
                                    src={
                                        formData.image instanceof File
                                            ? URL.createObjectURL(formData.image)
                                            : formData.image
                                    }
                                    alt="Employee"
                                />
                            </label>
                            <input
                                onChange={handleImageChange}
                                type="file"
                                id="emp-img"
                                hidden
                            />
                            <div className='flex flex-col'>
                                <label className="text-sm font-semibold text-gray-700">First Name</label>
                                <input
                                    onChange={handleInputChange}
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="First Name"
                                    required
                                />
                            </div>

                            <div className='flex flex-col'>
                                <label className="text-sm font-semibold text-gray-700">Last Name</label>
                                <input
                                    onChange={handleInputChange}
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="line1"
                                        value={formData.address.line1 || ''}
                                        onChange={handleAddressChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full mt-2"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        type="text"
                                        name="line2"
                                        value={formData.address.line2 || ''}
                                        onChange={handleAddressChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full mt-2"
                                        placeholder="Address Line 2"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Position</label>
                                    <select
                                        name="position"
                                        value={formData.position}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
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
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Shift</label>
                                    <select
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                    >
                                        <option value="Opening Shift">Opening Shift</option>
                                        <option value="Midday Shift">Midday Shift</option>
                                        <option value="Afternoon Shift">Afternoon Shift</option>
                                        <option value="Closing Shift">Closing Shift</option>
                                        <option value="Weekend Shift">Weekend Shift</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Education</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={formData.education}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Experience</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                    >
                                        <option value="1 Year">1 Year</option>
                                        <option value="2 Years">2 Years</option>
                                        <option value="3 Years">3 Years</option>
                                        <option value="5 Years">5 Years</option>
                                        <option value="10 Years">10 Years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700">Salary</label>
                                    <input
                                        type="number"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="text-sm font-semibold text-gray-700">About</label>
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                rows="4"
                                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 w-full"
                                placeholder="Brief description"
                                required
                            ></textarea>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                Save
                            </button>
                            <button onClick={handleCancelEdit} type="button" className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="max-w-6xl bg-white rounded-lg p-6">
                        {/* Profile Picture and Basic Details */}
                        <div className="flex flex-col items-start">
                            <img
                                className=" items-start w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
                                src={`${backendUrl}/empIMG/${employeeProfile.image}`}
                                alt={`${formData.firstName}'s profile`}
                            />
                            <h1 className="text-2xl font-bold mt-4 text-gray-800">
                                {formData.firstName} {formData.lastName}
                            </h1>
                            <p className="text-gray-500 mt-1 text-lg">{formData.position} - {formData.shift}</p>
                        </div>

                        {/* Employee Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* About Section */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h2 className="text-lg font-semibold text-gray-800">About</h2>
                                <p className="text-gray-700 mt-2"><strong>Education:</strong> {formData.education}</p>
                                <p className="text-gray-700"><strong>Phone:</strong> {formData.phone}</p>
                            </div>

                            {/* Experience and Salary Section */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h2 className="text-lg font-semibold text-gray-800">Details</h2>
                                <p className="text-gray-700"><strong>Experience:</strong> {formData.experience}</p>
                                <p className="text-gray-700 text-xl font-bold mt-2"><strong>Salary:</strong> ${formData.salary}</p>
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-inner mt-6">
                            <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                            <p className="text-gray-700 mt-2">
                                {formData.address.line1}, {formData.address.line2}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center mt-6 gap-4">
                            <button
                                onClick={handleEditToggle}
                                className="px-5 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={openModal}
                                className="px-5 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                )}
            </div>
            <button onClick={() => navigate('/employees-list')} className="px-5 py-2 bg-gray-400 rounded text-white ml-7 mt-3">Back</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Confirmation"
                className="bg-white p-5 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-lg font-semibold">Confirm Delete</h2>
                <p>Are you sure you want to delete this employee?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete} // Call the delete function
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default Employee_Profile;
