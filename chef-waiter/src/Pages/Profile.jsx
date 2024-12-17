import React, { useContext, useEffect } from 'react';
import { backendUrl } from '../App';
import { AppContext } from '../Context/AppContext';

const Profile = () => {
    const { cToken, iToken, profileData, setProfileData, get_Profile_Data } = useContext(AppContext);

    useEffect(() => {
        if (cToken || iToken) {
            get_Profile_Data();
        }
    }, [cToken, iToken]);

    if (!profileData) {
        return <div className="text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="flex flex-col m-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-2xl font-semibold text-gray-700">My Profile</h1>
            </div>
            <div className="max-w-4xl bg-white shadow-md rounded-lg p-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-start">
                    <img
                        className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
                        src={`${backendUrl}/empIMG/${profileData.image}`}
                        alt={`${profileData.firstName}'s profile`}
                    />
                    <h1 className="text-2xl font-bold mt-4 text-gray-800">
                        {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-gray-600 mt-1">{profileData.position} - {profileData.shift}</p>
                </div>

                {/* Employee Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* About Section */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="text-lg font-semibold text-gray-800">About</h2>
                        <p className="text-gray-700 mt-2"><strong>Education:</strong> {profileData.education}</p>
                        <p className="text-gray-700"><strong>Phone:</strong> {profileData.phone}</p>
                    </div>

                    {/* Salary Section */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                        <h2 className="text-lg font-semibold text-gray-800">Salary</h2>
                        <p className="text-gray-700 text-xl font-bold mt-2">${profileData.salary}</p>
                    </div>
                </div>

                {/* Address Section */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-6">
                    <h2 className="text-lg font-semibold text-gray-800">Address</h2>
                    <p className="text-gray-700 mt-2">
                        {profileData.address.line1}, {profileData.address.line2}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
