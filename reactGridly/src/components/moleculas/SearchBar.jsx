import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder = 'Buscar ideas...', className = '' }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            navigate(`/explorar?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <input
            type="search"
            placeholder={placeholder}
            className={`grow max-w-[600px] mx-4 md:mx-8 px-6 py-3 rounded-full border border-beige-dark/30 bg-white text-gray-dark text-base transition-all duration-300 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 placeholder:text-gray-muted ${className}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
        />
    );
};

export default SearchBar;
