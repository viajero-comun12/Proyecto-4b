import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../atomos/Button';

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

const SidebarMenuItem = ({ icon: Icon, label, to, tooltipDir = 'left' }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0, right: 0 });

    const handleMouseOver = (e) => {
        const buttonTarget = e.currentTarget.querySelector('button') || e.currentTarget;
        buttonTarget.style.transform = 'scale(1.2)';
        
        const rect = e.currentTarget.getBoundingClientRect();
        if (tooltipDir === 'left') {
            setTooltipCoords({ top: rect.top + rect.height / 2, left: rect.right + 15 });
        } else {
            setTooltipCoords({ top: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 15 });
        }
        setIsHovered(true);
    };

    const handleMouseOut = (e) => {
        const buttonTarget = e.currentTarget.querySelector('button') || e.currentTarget;
        buttonTarget.style.transform = 'scale(1)';
        setIsHovered(false);
    };

    return (
        <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
            onMouseOver={handleMouseOver} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate(to)} 
        >
            <Button 
                className={`tooltip-container tooltip-${tooltipDir}`} 
                data-tooltip={label} 
                style={{ backgroundColor: 'transparent', padding: '10px', borderRadius: '50%', display: 'flex', border: 'none', pointerEvents: 'none', transition: 'transform 0.2s', width: 'fit-content' }} 
            >
                <Icon style={{ color: '#620096', scale: '2' }} />
            </Button>
            {isHovered && createPortal(
                <div style={{ ...tooltipFloatingStyle, top: tooltipCoords.top, ...(tooltipDir === 'left' ? { left: tooltipCoords.left } : { right: tooltipCoords.right }) }}>{label}</div>,
                document.body
            )}
        </div>
    );
};

export default SidebarMenuItem;
