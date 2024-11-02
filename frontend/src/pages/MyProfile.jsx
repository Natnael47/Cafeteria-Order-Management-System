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
        // Set initial editable copy of user data
        setEditedData(userData || {});
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
        <div className="max-w-lg mx-auto p-5 border-2 border-green-500 mt-5 rounded-lg flex flex-col items-center gap-4 text-sm">
            {/* Display Name */}
            <p className="text-neutral-500 underline">USER INFORMATION</p>
            {
                isEdit ? (
                    <div className="flex gap-4 mt-2">
                        <input
                            className='bg-white text-3xl font-medium max-w-52 border-2 border-gray-500 rounded'
                            type='text'
                            value={editedData.firstName || ''}
                            onChange={(e) => setEditedData(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="First Name"
                        />
                        <input
                            className='bg-white text-3xl font-medium max-w-52 border-2 border-gray-500 rounded'
                            type='text'
                            value={editedData.lastName || ''}
                            onChange={(e) => setEditedData(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Last Name"
                        />
                    </div>
                ) : (
                    <p className='font-medium text-3xl text-neutral-800 mt-2 text-center'>{`${userData.firstName} ${userData.lastName}`}</p>
                )
            }

            <hr className='bg-zinc-400 h-[1px] border-none w-full' />

            {/* Contact Information */}
            <div className="w-full">
                <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500'>{userData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {
                        isEdit ? (
                            <input
                                className='bg-white max-w-52 border-2 border-gray-500 rounded'
                                type='text'
                                value={editedData.phone || ''}
                                onChange={e => setEditedData(prev => ({ ...prev, phone: e.target.value }))}
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
                                        className='bg-white max-w-52 border-2 border-gray-500 rounded'
                                        onChange={(e) => setEditedData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                        value={editedData.address?.line1 || ''}
                                        type="text"
                                        placeholder="Address Line 1"
                                    />
                                    <input
                                        className='bg-white max-w-52 border-2 border-gray-500 rounded'
                                        onChange={(e) => setEditedData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                        value={editedData.address?.line2 || ''}
                                        type="text"
                                        placeholder="Address Line 2"
                                    />
                                </>
                            ) : (
                                <p className='text-gray-500'>
                                    {userData.address?.line1}
                                    <br />
                                    {userData.address?.line2}
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="w-full">
                <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Gender:</p>
                    {
                        isEdit ? (
                            <select
                                className='max-w-20 bg-white border-2 border-gray-500 rounded'
                                onChange={(e) => setEditedData(prev => ({ ...prev, gender: e.target.value }))}
                                value={editedData.gender || ''}
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
                                className='max-w-28 bg-white border-2 border-gray-500 rounded'
                                type='date'
                                value={editedData.dob || ''}
                                onChange={e => setEditedData(prev => ({ ...prev, dob: e.target.value }))}
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
