import { useState } from 'react';

function SearchBar({ placeholder, value, onChange }) {
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="searchBar"
        />
    );
}

export default SearchBar;