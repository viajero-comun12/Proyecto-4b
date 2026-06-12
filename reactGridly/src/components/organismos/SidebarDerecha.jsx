import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { IoMdNotifications } from "react-icons/io";
import { LuMessageSquareHeart } from "react-icons/lu";
import { RiUserFollowFill } from "react-icons/ri";
import Button from '../atomos/Button';
import SidebarMenuItem from '../moleculas/SidebarMenuItem';
import { getSeguidos } from '../../services/api';

const SidebarDerecha = ({ isOpen }) => {
    const navigate = useNavigate();
    const [isSeguidosHovered, setIsSeguidosHovered] = useState(false);
    const [seguidos, setSeguidos] = useState([]);
    const seguidosRef = useRef(null);
    const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

    useEffect(() => {
        const miId = localStorage.getItem('usuario_id');
        if (miId) {
            getSeguidos(miId).then(setSeguidos);
        }
    }, [isOpen]); 

    useEffect(() => {
        if (isSeguidosHovered && seguidosRef.current) {
            const rect = seguidosRef.current.getBoundingClientRect();
            setPanelPos({
                top: rect.top,
                right: window.innerWidth - rect.left + 10
            });
        }
    }, [isSeguidosHovered]);

    return (
        <aside className={`absolute top-full right-0 bg-beige w-20 flex flex-col items-center gap-7 rounded-b-xl z-[1000] overflow-visible transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0 h-[250px] py-5 pointer-events-auto' : 'opacity-0 -translate-y-2.5 h-0 py-0 pointer-events-none'}`}>
            <SidebarMenuItem icon={IoMdNotifications} label="Notificaciones" to="/notificaciones" tooltipDir="right" />
            <SidebarMenuItem icon={LuMessageSquareHeart} label="Mensajes" to="/mensajes" tooltipDir="right" />
            <div 
                ref={seguidosRef}
                className="relative"
                onMouseEnter={() => setIsSeguidosHovered(true)} 
                onMouseLeave={() => setIsSeguidosHovered(false)}
            >
                <Button onClick={() => navigate('/seguidos')} className="bg-transparent p-2.5 rounded-full flex border-none cursor-pointer transition-transform duration-200 hover:scale-125 w-fit">
                    <RiUserFollowFill className="text-gray-dark scale-[2]" />
                </Button>
                
                {isSeguidosHovered && createPortal(
                    <div 
                        className="fixed z-[99999] pointer-events-auto"
                        style={{ top: panelPos.top, right: panelPos.right }}
                        onMouseEnter={() => setIsSeguidosHovered(true)}
                        onMouseLeave={() => setIsSeguidosHovered(false)}
                    >
                        <div className="bg-white rounded-xl shadow-xl w-[220px] max-h-[300px] overflow-y-auto p-2.5 flex flex-col gap-2.5 border border-beige">
                            <h4 className="mx-0 my-1 text-sm text-gray-dark text-center font-bold">Mis Seguidos</h4>
                            <hr className="border-none border-t border-beige m-0 mb-1" />
                            
                            {seguidos.length === 0 ? (
                                <p className="text-xs text-gray-muted text-center my-2.5">No sigues a nadie aún.</p>
                            ) : (
                                seguidos.map(s => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => navigate(`/usuario/${s.id}`)}
                                        className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-beige-light"
                                    >
                                        <img src={s.profile_pic || 'https://via.placeholder.com/35'} className="w-9 h-9 rounded-full object-cover" alt={s.username} />
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-dark font-bold leading-tight">@{s.username}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </aside>
    );
};
export default SidebarDerecha;
