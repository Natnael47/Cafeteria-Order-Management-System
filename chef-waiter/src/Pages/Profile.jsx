import React, { useContext, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';

const Profile = () => {

    const { cToken, profileData, setProfileData, get_Profile_Data } = useContext(AppContext);

    useEffect(() => {
        if (cToken) {
            get_Profile_Data();
        }
    }, [cToken])

    return profileData && (
        <div>
            PROFILE
        </div>
    )
}

export default Profile