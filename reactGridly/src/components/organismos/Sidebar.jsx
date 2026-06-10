import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { SiHomebridge } from "react-icons/si";
import { MdOutlineTravelExplore, MdPublish } from "react-icons/md";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GoPin } from "react-icons/go";

const Sidebar = ({ isOpen }) => { 
    const [activeTab, setActiveTab] = useState('/');

    
    if (!isOpen) return null;

    return (
        <aside className="sidebar-izq" style={{ backgroundColor: '#F6A700', width: '7%'}}>
            <nav className="menu-lateral">
                <div className="grupo-menu">
                    <Link to="/" className="item-menu activo"><SiHomebridge style={{ color: '#660066ff', scale: '3', marginBottom: '15px', marginTop: '30px' }} /></Link>
                    <Link to="/explorar" className="item-menu"><MdOutlineTravelExplore style={{ color: '#660066ff', scale: '3', marginBottom: '15px', marginTop: '30px' }} /></Link>
                    <Link to="/tableros" className="item-menu"><FaTableCellsLarge style={{ color: '#660066ff', scale: '3', marginBottom: '15px', marginTop: '30px' }} /></Link>
                    <Link to="/publicacion" className="item-menu"><MdPublish style={{ color: '#660066ff', scale: '3', marginBottom: '15px', marginTop: '30px' }} /></Link>
                    <Link to="/pines" className="item-menu"><GoPin style={{ color: '#660066ff', scale: '3', marginBottom: '15px', marginTop: '30px' }} /></Link>
                </div>
            </nav>
        </aside>
    );
};
export default Sidebar;