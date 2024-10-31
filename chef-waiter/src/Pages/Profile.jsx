import React, { useContext, useEffect } from 'react';
import { backendUrl } from '../App';
import { AppContext } from '../Context/AppContext';

const Profile = () => {
    const { cToken, wToken, profileData, setProfileData, get_Profile_Data } = useContext(AppContext);

    useEffect(() => {
        if (cToken || wToken) {
            get_Profile_Data();
        }
    }, [cToken, wToken]); // Adding wToken as a dependency

    return profileData && (
        <div>
            <div>

                <div>
                    <img className='w-[200px]' src={backendUrl + "/empIMG/" + profileData.image} alt="" />
                </div>

                <div>
                    {/*----emp info name position,shift, education etc ----*/}
                    <p>{profileData.firstName + " " + profileData.lastName}</p>
                    <div>
                        <p>{profileData.position} - {profileData.shift}</p>
                    </div>
                    {/*----emp about ----*/}
                    <div>
                        <p>About:</p>
                        <p>{profileData.education}</p>
                        <p>{profileData.phone}</p>
                    </div>

                    <p>SALARY : ${profileData.salary} </p>

                    <div>
                        <p>Address:</p>
                        <p>
                            {profileData.address.line1}
                            <br />
                            {profileData.address.line2}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Profile;
