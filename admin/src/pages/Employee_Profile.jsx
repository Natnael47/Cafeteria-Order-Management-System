import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { backendUrl } from '../App';

const Employee_Profile = () => {
    const { employeeId } = useParams(); // Get employeeId from URL
    const [profileData, setProfileData] = useState(null); // State to store employee profile data

    // Fetch employee profile data on component mount
    useEffect(() => {
        const getProfileData = async () => {
            try {
                const { data } = await axios.post(`${backendUrl}/emp-profile`, { employeeId });

                if (data.success) {
                    setProfileData(data.profileData);
                    console.log("Profile Data:", data.profileData);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Failed to fetch employee profile data.");
            }
        };

        getProfileData();
    }, [employeeId]);

    // Display loading message if data is not yet fetched
    if (!profileData) return <div>Loading...</div>;

    return (
        <div className="m-5 p-6 border rounded-lg shadow-md bg-white max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                {profileData.firstName} {profileData.lastName}
            </h1>
            <img
                src={`${backendUrl}/empIMG/${profileData.image}`}
                alt={`${profileData.firstName}'s profile`}
                className="w-32 h-32 rounded-full mb-4"
            />
            <div className="space-y-2">
                <p><strong>Position:</strong> {profileData.position}</p>
                <p><strong>Shift:</strong> {profileData.shift}</p>
                <p><strong>Gender:</strong> {profileData.gender}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone:</strong> {profileData.phone}</p>
                <p><strong>Education:</strong> {profileData.education}</p>
                <p><strong>Experience:</strong> {profileData.experience}</p>
                <p><strong>Salary:</strong> ${profileData.salary}</p>
                <p><strong>Address:</strong> {profileData.address}</p>
                <p><strong>About:</strong> {profileData.about}</p>
                <p><strong>Date Joined:</strong> {new Date(profileData.date).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default Employee_Profile;
