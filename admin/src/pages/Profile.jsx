import { ArrowLeft } from 'lucide-react';
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Profile = () => {
    const navigate = useNavigate();
    const { token, profile, setProfile, getProfile } = useContext(AdminContext);

    useEffect(() => {
        getProfile();
        if (token) {
            getProfile();
        }
    }, [token]);

    return (
        <div className="m-5 w-full max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-between mb-8">
                <h1 className="text-4xl font-extrabold text-gray-800">Admin Profile</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
            </div>

            {profile ? (
                <div className="bg-white shadow-xl px-8 py-8 border rounded-lg w-full">
                    <div className="flex items-center gap-6 mb-6">
                        <img
                            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
                            src={`${backendUrl}/empIMG/${profile.image}`}
                            alt={`${profile.firstName}'s profile`}
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{`${profile.firstName} ${profile.lastName}`}</h2>
                            <p className="text-xl text-gray-600">{profile.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-lg">Phone</h3>
                            <p>{profile.phone}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">About</h3>
                            <p>{profile.about || 'No information available'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Position</h3>
                            <p>{profile.position}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Address</h3>
                            <p>{profile.address ? 'Address information not available' : 'No address provided'}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
};

export default Profile;
