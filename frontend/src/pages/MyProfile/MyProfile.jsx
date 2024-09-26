import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import "./MyProfile.css";

const MyProfile = () => {
    const [userData, setUserData] = useState({
        name: "Natnael Mahteme",
        image: assets.profile_pic,
        email: "nati@gmail.com",
        phone: "555-586-4587",
        address: {
            line1: "Addis Abeba",
            line2: "Addis Abeba, Ethiopia"
        },
        gender: "Male",
        dob: "2000-01-10"
    });

    const [isEdit, setIsEdit] = useState(false);

    return (
        <div className='profile'>
            <img src={userData.image} alt="" className='profile-image' />
            {
                isEdit
                    ? <input type='text' value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} />
                    : <p className='profile-name'>{userData.name}</p>
            }
            <hr className='divider' />
            <div className='contact-section'>
                <p className='section-title'>CONTACT INFORMATION</p>
                <div className='contact-info'>
                    <p className='info-label'>Email:</p>
                    <p className='info-value'>{userData.email}</p>
                    <p className='info-label'>Phone:</p>
                    {
                        isEdit
                            ? <input type='text' value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} />
                            : <p className='info-value'>{userData.phone}</p>
                    }
                    <p className='info-label'>Address:</p>
                    {
                        isEdit
                            ? <p>
                                <input onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} type="text" />
                                <br />
                                <input onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} type="text" />
                            </p>
                            : <p className='info-value'>
                                {userData.address.line1}
                                <br />
                                {userData.address.line2}
                            </p>
                    }
                </div>
            </div>
            <div className='basic-info-section'>
                <p className='section-title'>BASIC INFORMATION</p>
                <div className='basic-info'>
                    <p className='info-label'>Gender:</p>
                    {
                        isEdit
                            ? <select onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            : <p className='info-value'>{userData.gender}</p>
                    }
                    <p className='info-label'>Birthday:</p>
                    {
                        isEdit
                            ? <input type='date' value={userData.dob} onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} />
                            : <p className='info-value'>{userData.dob}</p>
                    }
                </div>
            </div>
            <div className='edit-button-container'>
                {
                    isEdit
                        ? <button className='edit-button' onClick={() => setIsEdit(false)}>Save</button>
                        : <button className='edit-button' onClick={() => setIsEdit(true)}>Edit</button>
                }
            </div>
        </div>
    );
}

export default MyProfile;