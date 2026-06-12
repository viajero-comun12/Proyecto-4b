import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import Button from '../atomos/Button';
import SidebarDerecha from './SidebarDerecha';
import SearchBar from '../moleculas/SearchBar';

const Header = ({toggleSidebar}) => {
    const [isProfileHovered, setIsProfileHovered] = React.useState(false);

    return (
        <header className="bg-gray-dark backdrop-blur-xl px-5 md:px-10 py-3.5 flex justify-between items-center shadow-md sticky top-0 z-[1000] border-b border-beige-dark/20 flex-wrap gap-2.5">
            <Button onClick={toggleSidebar} className="bg-transparent border-none cursor-pointer">
                <IoMdMenu className="mr-4 md:mr-8 text-beige text-2xl" />
            </Button>

            <Link to="/" className="flex items-center gap-2.5 grow-0">
                <div className="font-sans text-2xl text-beige font-bold tracking-tight">Gridly</div>
            </Link>

            <SearchBar />

            <nav className="flex items-center gap-3 md:gap-5 order-2">
                <div 
                    onMouseEnter={() => setIsProfileHovered(true)} 
                    onMouseLeave={() => setIsProfileHovered(false)}
                    className="relative flex items-center"
                >
                    <Link to="/usuario" className="font-sans text-beige text-sm font-semibold py-2.5">Mi Perfil</Link>
                    <SidebarDerecha isOpen={isProfileHovered} />
                </div>
                <Link to="/login" className="font-sans text-beige text-sm font-semibold">Cerrar Sesión</Link>
            </nav>
        </header>
    );
};
export default Header;