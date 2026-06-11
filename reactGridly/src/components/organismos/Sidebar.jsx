import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { SiHomebridge } from "react-icons/si";
import { MdOutlineTravelExplore, MdPublish } from "react-icons/md";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GoPin } from "react-icons/go";
import Button from '../atomos/Button';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen }) => { 
    const navigate = useNavigate();

    return (
        <aside className="sidebar-izq" style={{ backgroundColor: '#F6A700', width: isOpen ? '80px' : '0', overflow: 'hidden', transition: 'width 0.3s ease', minHeight: 'calc(100vh - 60px)' }}>
            <nav className="menu-lateral" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isOpen ? '20px 0' : '0' }}>
                <div className="grupo-menu" style={{ display: 'flex', flexDirection: 'column', gap: '30px', opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                    <Button onClick={() => navigate('/')} className="tooltip-container tooltip-left" data-tooltip="Inicio" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <SiHomebridge style={{ color: '#660066', scale: '2' }} />
                    </Button>
                    <Button onClick={() => navigate('/explorar')} className="tooltip-container tooltip-left" data-tooltip="Explorar" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <MdOutlineTravelExplore style={{ color: '#660066', scale: '2' }} />
                    </Button>
                    <Button onClick={() => navigate('/tableros')} className="tooltip-container tooltip-left" data-tooltip="Tableros" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <FaTableCellsLarge style={{ color: '#660066', scale: '2' }} />
                    </Button>
                    <Button onClick={() => navigate('/publicacion')} className="tooltip-container tooltip-left" data-tooltip="Publicar" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <MdPublish style={{ color: '#660066', scale: '2' }} />
                    </Button>
                    <Button onClick={() => navigate('/pines')} className="tooltip-container tooltip-left" data-tooltip="Mis Pines" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <GoPin style={{ color: '#660066', scale: '2' }} />
                    </Button>
                </div>
            </nav>
        </aside>
    );
};
export default Sidebar;