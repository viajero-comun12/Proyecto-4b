import React, { useState } from 'react';
import { createPortal } from 'react-dom'; 
import { Link } from 'react-router-dom';
import { SiHomebridge } from "react-icons/si";
import { MdOutlineTravelExplore, MdPublish } from "react-icons/md";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GoPin } from "react-icons/go";
import Button from '../atomos/Button';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0 });

  const handleMouseOver = (e, name) => {
    const buttonTarget = e.currentTarget.querySelector('button') || e.currentTarget;
    buttonTarget.style.transform = 'scale(1.2)';
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipCoords({
      top: rect.top + rect.height / 2, 
      left: rect.right + 15 
    });
    setActiveTooltip(name);
  };

  const handleMouseOut = (e) => {
    const buttonTarget = e.currentTarget.querySelector('button') || e.currentTarget;
    buttonTarget.style.transform = 'scale(1)';
    setActiveTooltip(null);
  };

  return (
    <aside className="sidebar-izq" style={{ backgroundColor: '#F6A700', width: isOpen ? '80px' : '0', overflow: 'hidden', transition: 'width 0.3s ease', height: 'auto', minHeight: '100%', position: 'sticky', top: '73px', alignSelf: 'stretch' }}>
      <nav className="menu-lateral" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: isOpen ? '20px 0' : '0' }}>
        <div className="grupo-menu" style={{ display: 'flex', flexDirection: 'column', gap: '30px', opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          
         
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onMouseOver={(e) => handleMouseOver(e, 'inicio')} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate('/')} 
          >
            <Button 
              className="tooltip-container tooltip-left" 
              data-tooltip="Inicio" 
              style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', pointerEvents: 'none', transition: 'transform 0.2s', width: 'fit-content' }} 
            >
              <SiHomebridge style={{ color: '#660066', scale: '2' }} />
            </Button>
            {activeTooltip === 'inicio' && createPortal(
              <div style={{ ...tooltipFloatingStyle, top: tooltipCoords.top, left: tooltipCoords.left }}>Inicio</div>,
              document.body
            )}
          </div>


          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onMouseOver={(e) => handleMouseOver(e, 'explorar')} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate('/explorar')}
          >
            <Button 
              className="tooltip-container tooltip-left" 
              data-tooltip="Explorar" 
              style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', pointerEvents: 'none', transition: 'transform 0.2s', width: 'fit-content' }} 
            >
              <MdOutlineTravelExplore style={{ color: '#660066', scale: '2' }} />
            </Button>
            {activeTooltip === 'explorar' && createPortal(
              <div style={{ ...tooltipFloatingStyle, top: tooltipCoords.top, left: tooltipCoords.left }}>Explorar</div>,
              document.body
            )}
          </div>


          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onMouseOver={(e) => handleMouseOver(e, 'tableros')} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate('/tableros')}
          >
            <Button 
              className="tooltip-container tooltip-left" 
              data-tooltip="Tableros" 
              style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', pointerEvents: 'none', transition: 'transform 0.2s', width: 'fit-content' }} 
            >
              <FaTableCellsLarge style={{ color: '#660066', scale: '2' }} />
            </Button>
            {activeTooltip === 'tableros' && createPortal(
              <div style={{ ...tooltipFloatingStyle, top: tooltipCoords.top, left: tooltipCoords.left }}>Tableros</div>,
              document.body
            )}
          </div>

         
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onMouseOver={(e) => handleMouseOver(e, 'publicar')} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate('/publicacion')}
          >
            <Button 
              className="tooltip-container tooltip-left" 
              data-tooltip="Subir Publicación" 
              style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', pointerEvents: 'none', transition: 'transform 0.2s', width: 'fit-content' }} 
            >
              <MdPublish style={{ color: '#660066', scale: '2' }} />
            </Button>
            {activeTooltip === 'publicar' && createPortal(
              <div style={{ ...tooltipFloatingStyle, top: tooltipCoords.top, left: tooltipCoords.left }}>Subir Publicación</div>,
              document.body
            )}
          </div>

        
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onMouseOver={(e) => handleMouseOver(e, 'pines')} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate('/pines')}
          >
            <Button 
              className="tooltip-container tooltip-left" 
              data-tooltip="Mis Pines" 
              style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', pointerEvents: 'none', transition: 'transform 0.2s', width: 'fit-content' }} 
            >
              <GoPin style={{ color: '#660066', scale: '2' }} />
            </Button>
            {activeTooltip === 'pines' && createPortal(
              <div style={{ ...tooltipFloatingStyle, top: tooltipCoords.top, left: tooltipCoords.left }}>Mis Pines</div>,
              document.body
            )}
          </div>

        </div>
      </nav>
    </aside>
  );
};

const tooltipFloatingStyle = {
  position: 'fixed',          
  transform: 'translateY(-50%)', 
  backgroundColor: '#1d011d',
  color: '#FFFFFF',
  padding: '8px 16px',
  borderRadius: '12px',    
  fontSize: '15px',
  fontWeight: '500',
  fontFamily: 'sans-serif',
  whiteSpace: 'nowrap',
  zIndex: 99999,             
  pointerEvents: 'none',   
  boxShadow: '0px 4px 8px rgba(0,0,0,0.3)'
};

export default Sidebar;