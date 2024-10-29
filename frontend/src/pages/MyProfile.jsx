import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';
import { StoreContext } from '../context/StoreContext';

const MyProfile = () => {
    const { userData, setUserData, token, loadUserProfileData } = useContext(StoreContext);
    const [isEdit, setIsEdit] = useState(false);

    const updateUserProfileData = async () => {
        try {
            // Prepare JSON payload
            const updatedData = {
                name: userData.name,
                gender: userData.gender,
                phone: userData.phone,
                address: userData.address, // Ensure address is a JSON object
                dob: userData.dob,
            };

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', updatedData, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
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
        <div className='max-w-lg flex flex-col gap-2 text-sm'>
            {/* Display Name */}
            {
                isEdit ? (
                    <input
                        className='bg-gray-50 text-3xl font-medium max-w-60 mt-4'
                        type='text'
                        value={userData.name}
                        onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                    />
                ) : (
                    <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
                )
            }

            <hr className='bg-zinc-400 h-[1px] border-none' />

            {/* Contact Information */}
            <div>
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500'>{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {
                        isEdit ? (
                            <input
                                className='bg-gray-100 max-w-52'
                                type='text'
                                value={userData.phone}
                                onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        ) : (
                            <p className='text-blue-400'>{userData.phone}</p>
                        )
                    }

                    <p className='font-medium'>Address:</p>
                    <div className={`flex flex-col ${isEdit ? 'gap-2' : 'gap-1'}`}>
                        {
                            isEdit ? (
                                <>
                                    <input
                                        className='bg-gray-50'
                                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                        value={userData.address.line1}
                                        type="text"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        className='bg-gray-50'
                                        onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                        value={userData.address.line2}
                                        type="text"
                                        placeholder="Address Line 2"
                                    />
                                </>
                            ) : (
                                <p className='text-gray-500'>
                                    {userData.address.line1}
                                    <br />
                                    {userData.address.line2}
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div>
                <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Gender:</p>
                    {
                        isEdit ? (
                            <select
                                className='max-w-20 bg-gray-100'
                                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                value={userData.gender}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p className='text-gray-400'>{userData.gender}</p>
                        )
                    }

                    <p className='font-medium'>Birthday:</p>
                    {
                        isEdit ? (
                            <input
                                className='max-w-28 bg-gray-100'
                                type='date'
                                value={userData.dob}
                                onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                            />
                        ) : (
                            <p className='text-gray-400'>{userData.dob}</p>
                        )
                    }
                </div>
            </div>

            {/* Edit/Save Button */}
            <div className='mt-10'>
                {
                    isEdit ? (
                        <button
                            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                            onClick={updateUserProfileData}
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
                            onClick={() => setIsEdit(true)}
                        >
                            Edit
                        </button>
                    )
                }
            </div>
        </div>
    );
}

export default MyProfile;
