import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { IoMdNotifications } from "react-icons/io";
import { LuMessageSquareHeart } from "react-icons/lu";
import { RiUserFollowFill } from "react-icons/ri";
import { IoMdMenu } from "react-icons/io"; // 2. Agrega el ícono del menú
import Button from '../atomos/Button';
import SidebarDerecha from './SidebarDerecha';

const Header = ({toggleSidebar}) => {
    const navigate = useNavigate();
    const [isProfileHovered, setIsProfileHovered] = React.useState(false);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/explorar?q=${e.target.value}`);
        }
    };
    return (
        <header style={{ backgroundColor: '#620096'}}>
            <Button onClick={toggleSidebar} style={{ background: 'transparent', border: 'none'} }>
                <IoMdMenu style={{ marginRight: '30px', color: '#F6A700', fontSize: '24px' }} />
            </Button>

            <Link to="/" className="logo">
                <div className="logo-texto" style={{color: '#F6A700'}}>Gridly</div>
            </Link>

            <input 
            type="search" 
            placeholder="Buscar ideas..." 
            className="buscador" 
            onKeyPress={handleSearch}
            />
            <nav>
                <div 
                    onMouseEnter={() => setIsProfileHovered(true)} 
                    onMouseLeave={() => setIsProfileHovered(false)}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                >
                    <Link to="/usuario" className="logo-texto" style={{color: '#F6A700', fontSize: '90%', padding: '10px 0'}}>Mi Perfil</Link>
                    <SidebarDerecha isOpen={isProfileHovered} />
                </div>
                <Link to="/login" className="logo-texto" style={{color: '#F6A700', fontSize: '90%'}}>Cerrar Sesión </Link>
            </nav>
        </header>
    );
};
export default Header;