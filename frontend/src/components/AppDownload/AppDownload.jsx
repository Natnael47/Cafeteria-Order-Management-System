import React from 'react'
import { assets } from '../../assets/assets'
import './AppDownload.css'

const AppDownload = () => {
    return (
        <div className='app-download' id='app-download'>
            <p>A mobile app is coming soon for a better experience on both Android and iOS devices</p>
            <div className="app-downloads-platforms">
                <img src={assets.play_store} alt="" />
                <img src={assets.app_store} alt="" />
            </div>
        </div>
    )
}

export default AppDownload