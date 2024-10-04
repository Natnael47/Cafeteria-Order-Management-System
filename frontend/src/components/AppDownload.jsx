import React from 'react';
import { assets } from '../assets/assets';

const AppDownload = () => {
    return (
        <div className="mx-auto mt-[100px] text-center font-medium text-[max(3vw,20px)]" id="app-download">
            <p>A mobile app is coming soon for a better experience on both Android and iOS devices</p>
            <div className="flex justify-center gap-[max(2vw,10px)] mt-10">
                <img src={assets.play_store} alt="Play Store" className="w-[max(30vw,120px)] max-w-[180px] transition-transform duration-500 cursor-pointer hover:scale-105" />
                <img src={assets.app_store} alt="App Store" className="w-[max(30vw,120px)] max-w-[180px] transition-transform duration-500 cursor-pointer hover:scale-105" />
            </div>
        </div>
    );
}

export default AppDownload;
