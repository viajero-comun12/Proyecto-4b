import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder = 'Buscar ideas...', className = 'buscador' }) => {
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
            className={className}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
        />
    );
};

export default SearchBar;
