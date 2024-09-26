import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import "./SearchBar.css";

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(StoreContext);
    const [visible, setVisibility] = useState(false);

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('menu')) {
            setVisibility(true);
        } else {
            setVisibility(false);
        }

    }, [location])

    return showSearch && visible ? (
        <div className='search_bar'>
            <div className="bar">
                <input value={search} onChange={(e) => setSearch(e.target.value)} type='text' placeholder='Search' />
                <img src={assets.search_icon} alt="" />
            </div>
            <img onClick={() => setShowSearch(false)} src={assets.cross_icon} alt="" />
        </div>
    ) : null;
}

export default SearchBar