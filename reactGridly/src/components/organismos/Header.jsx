import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/explorar?q=${e.target.value}`);
        }
    };
    return (
        <header>
            <Link to="/" className="logo">
                <div className="logo-icono">G</div>
                <div className="logo-texto">Gridly</div>
            </Link>
            <input 
            type="search" 
            placeholder="Buscar ideas..." 
            className="buscador" 
            onKeyPress={handleSearch}
            />
            <nav>
                <Link to="/usuario" className="link-texto">Mi Perfil</Link>
                <Link to="/login" className="btn-primario">Cerrar Sesión </Link>
            </nav>
        </header>
    );
};
export default Header;