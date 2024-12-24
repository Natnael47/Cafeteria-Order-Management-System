import { CircleX } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const SearchBar = () => {
    const { search, setSearch, showSearch, setShowSearch, food_list } = useContext(StoreContext);
    const [visible, setVisibility] = useState(false);
    const [suggestion, setSuggestion] = useState('');

    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('menu')) {
            setVisibility(true);
        } else {
            setVisibility(false);
        }
    }, [location]);

    useEffect(() => {
        // Generate the first matching suggestion dynamically
        if (search) {
            const match = food_list.find((food) =>
                food.name.toLowerCase().startsWith(search.toLowerCase())
            );
            setSuggestion(match ? match.name : ''); // Set the suggestion
        } else {
            setSuggestion('');
        }
    }, [search, food_list]);

    const handleInputChange = (e) => {
        setSearch(e.target.value); // Update search with user input
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && suggestion) {
            setSearch(suggestion); // Accept the suggestion on Enter
        }
    };

    const handleSuggestionClick = () => {
        setSearch(suggestion); // Accept the suggestion when clicked
    };

    return showSearch && visible ? (
        <div className="relative border-t border-b text-center">
            <div className="relative inline-flex items-center justify-center border border-gray-500 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
                {/* Wrapper for input and suggestion */}
                <div className="relative w-full">
                    <div className="absolute w-full h-full flex items-center pointer-events-none">
                        {/* User's typed text */}
                        <span
                            className="text-gray-800 font-medium"
                            style={{
                                fontFamily: 'inherit',
                                fontSize: 'inherit',
                                lineHeight: '1.5rem', // Match input line height
                            }}
                        >
                            {search}
                        </span>
                        {/* Suggestion text */}
                        {suggestion && search && suggestion.toLowerCase() !== search.toLowerCase() && (
                            <span
                                className="text-gray-400 font-light"
                                style={{
                                    fontFamily: 'inherit',
                                    fontSize: 'inherit',
                                    lineHeight: '1.5rem', // Match input line height
                                }}
                            >
                                {suggestion.slice(search.length)}
                            </span>
                        )}
                    </div>
                    <input
                        className="w-full outline-none bg-transparent text-sm text-gray-800 placeholder-gray-400"
                        value={search}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        type="text"
                        placeholder="Search for items or categories"
                        autoComplete="off"
                        style={{
                            caretColor: '#000',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            lineHeight: '1.5rem',
                        }}
                    />
                </div>
                <CircleX className="inline w-8 cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
                    onClick={() => {
                        setSearch(''); // Clear search
                        setShowSearch(false); // Hide search bar
                    }} />
            </div>
            {/* Clear search input when closing the search bar */}

            {/* Show "Did you mean:" text only if suggestion differs from the user's input */}
            {suggestion &&
                search &&
                suggestion.toLowerCase() !== search.toLowerCase() && (
                    <div
                        className="mb-2 text-blue-500 text-sm cursor-pointer"
                        onClick={handleSuggestionClick}
                    >
                        Did you mean: <strong>{suggestion}</strong>?
                    </div>
                )}
        </div>
    ) : null;
};

export default SearchBar;