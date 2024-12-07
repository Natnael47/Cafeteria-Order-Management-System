import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { StoreContext } from '../context/StoreContext';

const MyProfile = () => {
    const { userData, setUserData, token, loadUserProfileData } = useContext(StoreContext);
    const [isEdit, setIsEdit] = useState(false);
    const [editedData, setEditedData] = useState({});

    useEffect(() => {
        setEditedData({ ...userData, phone: userData.phone || '' }); // Ensures phone is initialized
    }, [userData]);


    // Function to check if there are any changes
    const hasChanges = () => {
        return JSON.stringify(editedData) !== JSON.stringify(userData);
    };

    const updateUserProfileData = async () => {
        if (!hasChanges()) {
            toast.info("No changes detected");
            setIsEdit(false);
            return;
        }

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/update-profile`,
                editedData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setUserData(editedData);  // Update userData to reflect saved changes
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating the profile.");
        }
    };

    return userData && (
        <div className="max-w-lg mx-auto p-6 border-2 border-green-500 mt-5 rounded-2xl flex flex-col items-center gap-6 text-sm shadow-lg bg-gradient-to-br from-white via-gray-100 to-green-50">

            {/* User Information Title */}
            <p className="text-lg font-bold text-green-600 underline tracking-widest">USER INFORMATION</p>

            {isEdit ? (
                <div className="flex gap-4 mt-2">
                    <input
                        className='bg-white text-3xl font-semibold max-w-52 border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                        type='text'
                        value={editedData.firstName || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="First Name"
                    />
                    <input
                        className='bg-white text-3xl font-semibold max-w-52 border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                        type='text'
                        value={editedData.lastName || ''}
                        onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Last Name"
                    />
                </div>
            ) : (
                <p className='font-bold text-3xl text-gray-800 mt-2 text-center'>{`${userData.firstName} ${userData.lastName}`}</p>
            )}

            <hr className='bg-green-300 h-[1px] border-none w-full' />

            {/* Contact Information */}
            <div className="w-full">
                <p className='text-lg font-bold text-green-600 underline tracking-widest mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-gray-700'>
                    <p className='font-semibold'>Email:</p>
                    <p className='text-blue-600'>{userData.email}</p>

                    <p className='font-semibold'>Phone:</p>
                    {isEdit ? (
                        <div className="flex items-center border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
                            <span className="text-gray-500 font-medium text-lg">+251</span>
                            <input
                                id="phone-input"
                                className="flex-1 outline-none border-none text-lg pl-2"
                                type="text"
                                placeholder="912345678"
                                value={editedData.phone?.startsWith("+251") ? editedData.phone.slice(5) : editedData.phone || ''}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "").slice(0, 9);
                                    setEditedData(prev => ({ ...prev, phone: `+251 ${value}` }));
                                }}
                                required
                            />
                        </div>
                    ) : (
                        <p className='text-blue-500'>{userData.phone}</p>
                    )}

                    <p className='font-semibold'>Address:</p>
                    <div className={`flex flex-col ${isEdit ? 'gap-2' : 'gap-1'}`}>
                        {isEdit ? (
                            <>
                                <input
                                    className='bg-white border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                                    onChange={(e) => setEditedData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                    value={editedData.address?.line1 || ''}
                                    type="text"
                                    placeholder="Address Line 1"
                                />
                                <input
                                    className='bg-white border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                                    onChange={(e) => setEditedData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                    value={editedData.address?.line2 || ''}
                                    type="text"
                                    placeholder="Address Line 2"
                                />
                            </>
                        ) : (
                            <p className='text-gray-500'>
                                {userData.address?.line1}<br />{userData.address?.line2}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="w-full">
                <p className='text-lg font-bold text-green-600 underline tracking-widest mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-gray-700'>
                    <p className='font-semibold'>Gender:</p>
                    {isEdit ? (
                        <select
                            className='bg-white border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                            onChange={(e) => setEditedData(prev => ({ ...prev, gender: e.target.value }))}
                            value={editedData.gender || 'Not Selected'}
                        >
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <p className='text-gray-500'>{userData.gender === 'Not Selected' ? 'Not Selected' : userData.gender}</p>
                    )}

                    <p className='font-semibold'>Birthday:</p>
                    {isEdit ? (
                        <input
                            className='bg-white border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400'
                            type='date'
                            value={editedData.dob || ''}
                            onChange={e => setEditedData(prev => ({ ...prev, dob: e.target.value }))}
                        />
                    ) : (
                        <p className='text-gray-500'>{userData.dob}</p>
                    )}
                </div>
            </div>

            {/* Edit/Save Button */}
            <div className='mt-8'>
                {isEdit ? (
                    <button
                        className='bg-green-500 text-white font-semibold px-8 py-2 rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 shadow-md'
                        onClick={updateUserProfileData}
                    >
                        Save
                    </button>
                ) : (
                    <button
                        className='bg-blue-500 text-white font-semibold px-8 py-2 rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-md'
                        onClick={() => setIsEdit(true)}
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}

export default MyProfile;
