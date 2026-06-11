import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdNotifications } from "react-icons/io";
import { LuMessageSquareHeart } from "react-icons/lu";
import { RiUserFollowFill } from "react-icons/ri";
import Button from '../atomos/Button';
import { getSeguidos } from '../../services/api';

const SidebarDerecha = ({ isOpen }) => {
    const navigate = useNavigate();
    const [isSeguidosHovered, setIsSeguidosHovered] = useState(false);
    const [seguidos, setSeguidos] = useState([]);

    useEffect(() => {
        const miId = localStorage.getItem('usuario_id');
        if (miId) {
            getSeguidos(miId).then(setSeguidos);
        }
    }, [isOpen]); // Recargar seguidos cuando se abre el perfil

    return (
        <aside style={{ 
            position: 'absolute', 
            top: '100%', 
            right: 0, 
            backgroundColor: '#F6A700', 
            width: '80px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: isOpen ? '20px 0' : '0', 
            gap: '30px', 
            transition: 'opacity 0.3s ease, transform 0.3s ease, height 0.3s ease', 
            opacity: isOpen ? 1 : 0, 
            transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
            pointerEvents: isOpen ? 'auto' : 'none',
            borderRadius: '0 0 10px 10px',
            zIndex: 1000,
            overflow: 'hidden',
            height: isOpen ? '250px' : '0'
        }}>
            <Button onClick={() => navigate('/notificaciones')} className="tooltip-container tooltip-right" data-tooltip="Notificaciones" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <IoMdNotifications style={{ color: '#620096', scale: '2' }} />
            </Button>
            <Button onClick={() => navigate('/mensajes')} className="tooltip-container tooltip-right" data-tooltip="Mensajes" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                <LuMessageSquareHeart style={{ color: '#620096', scale: '2' }} />
            </Button>
            <div 
                style={{ position: 'relative' }} 
                onMouseEnter={() => setIsSeguidosHovered(true)} 
                onMouseLeave={() => setIsSeguidosHovered(false)}
            >
                <Button onClick={() => navigate('/seguidos')} className="tooltip-container tooltip-right" data-tooltip="Seguidos" style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', width: 'fit-content' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                    <RiUserFollowFill style={{ color: '#620096', scale: '2' }} />
                </Button>
                
                {isSeguidosHovered && (
                    <div style={{ position: 'absolute', top: 0, right: '100%', paddingRight: '10px', zIndex: 1000 }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            width: '220px',
                            maxHeight: '250px',
                            overflowY: 'auto',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <h4 style={{ margin: '5px 0', fontSize: '0.9rem', color: 'var(--color-azul)', textAlign: 'center' }}>Mis Seguidos</h4>
                            <hr style={{ border: 'none', borderTop: '1px solid #eae8e3', margin: '0 0 5px 0' }} />
                            
                            {seguidos.length === 0 ? (
                                <p style={{ fontSize: '0.8rem', color: '#8892a0', textAlign: 'center', margin: '10px 0' }}>No sigues a nadie aún.</p>
                            ) : (
                                seguidos.map(s => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => navigate(`/usuario/${s.id}`)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s ease', backgroundColor: 'transparent' }}
                                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#f4f3ec'}
                                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <img src={s.profile_pic || 'https://via.placeholder.com/35'} style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} alt={s.username} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--color-azul)', fontWeight: 'bold', lineHeight: '1.2' }}>@{s.username}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
export default SidebarDerecha;
