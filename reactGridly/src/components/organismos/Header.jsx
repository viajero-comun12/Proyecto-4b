import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { FaCircleUser } from 'react-icons/fa6';
import { IoMdMenu } from "react-icons/io";
import Button from '../atomos/Button';
import SidebarDerecha from './SidebarDerecha';
import SearchBar from '../moleculas/SearchBar';
import { logoutUser } from '../../services/authService';

const Header = ({toggleSidebar}) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const navigate = useNavigate();
    const usuarioId = localStorage.getItem('usuario_id');

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    return (
        <header className="bg-gray-dark backdrop-blur-xl px-3 md:px-10 py-3.5 flex flex-nowrap justify-between items-center shadow-md sticky top-0 z-[1000] border-b border-beige-dark/20 gap-2">
            <Button onClick={toggleSidebar} className="bg-transparent border-none cursor-pointer shrink-0">
                <IoMdMenu className="mr-2 md:mr-8 text-beige text-2xl" />
            </Button>

            <Link to="/" className="flex items-center gap-2.5 shrink-0">
                <div className="font-sans text-2xl text-beige font-bold tracking-tight">Gridly</div>
            </Link>

            <SearchBar />

            <nav className="flex items-center gap-2 md:gap-5 shrink-0">
                {usuarioId && (
                    <div className="relative flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-beige text-2xl bg-transparent border-none cursor-pointer transition-opacity duration-300 hover:opacity-80"
                            title="Yo"
                        >
                            <FaCircleUser />
                        </button>
                        <SidebarDerecha isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                    </div>
                )}
                {usuarioId ? (
                    <button onClick={handleLogout} className="text-beige text-xl bg-transparent border-none cursor-pointer transition-opacity duration-300 hover:opacity-80" title="Cerrar Sesión">
                        <FaSignOutAlt />
                    </button>
                ) : (
                    <Link to="/register" className="text-beige text-xl transition-opacity duration-300 hover:opacity-80" title="Crear una cuenta"><FaCircleUser /></Link>
                )}
            </nav>
        </header>
    );
};
export default Header;