import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../atomos/Button';

const SidebarMenuItem = ({ icon: Icon, label, to, tooltipDir = 'left' }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0, right: 0 });

    const handleMouseOver = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (tooltipDir === 'left') {
            setTooltipCoords({ top: rect.top + rect.height / 2, left: rect.right + 15 });
        } else {
            setTooltipCoords({ top: rect.top + rect.height / 2, right: window.innerWidth - rect.left + 15 });
        }
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    return (
        <div 
            className="flex items-center cursor-pointer relative"
            onMouseOver={handleMouseOver} 
            onMouseOut={handleMouseOut}
            onClick={() => navigate(to)} 
        >
            <Button 
                className="bg-transparent p-2.5 rounded-full flex border-none transition-transform duration-200 hover:scale-125 w-fit" 
            >
                <Icon className="text-gray-dark scale-[2]" />
            </Button>
            {isHovered && createPortal(
                <div 
                    className="fixed -translate-y-1/2 bg-gray-dark text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap z-[99999] pointer-events-none shadow-lg"
                    style={{ top: tooltipCoords.top, ...(tooltipDir === 'left' ? { left: tooltipCoords.left } : { right: tooltipCoords.right }) }}
                >
                    {label}
                </div>,
                document.body
            )}
        </div>
    );
};

export default SidebarMenuItem;
