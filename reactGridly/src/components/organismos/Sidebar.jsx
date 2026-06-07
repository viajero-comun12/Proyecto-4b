import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar-izq">
            <nav className="menu-lateral">
                <div className="grupo-menu">
                    <Link to="/" className="item-menu activo"><span className="icono"></span> Inicio</Link>
                    <Link to="/explorar" className="item-menu"><span className="icono"></span> Explorar</Link>
                    <Link to="/notificaciones" className="item-menu"><span className="icono"></span> Notificaciones</Link>
                    <Link to="/publicacion" className="item-menu"><span className="icono"></span> Publicar</Link>
                    <Link to="/tableros" className="item-menu"><span className="icono"></span>Tableros</Link>
                    <Link to="/seguidos" className="item-menu"><span className="icono"></span> Seguidos</Link>
                    <Link to="/mensajes" className="item-menu"><span className="icono"></span> Mensajes</Link>
                    <Link to="/pines" className="item-menu"><span className="icono"></span>Pines</Link>
                </div>
            </nav>
        </aside>
    );
};
export default Sidebar;