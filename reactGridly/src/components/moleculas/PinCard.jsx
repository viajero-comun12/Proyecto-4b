import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atomos/Button';

const PinCard = ({ pub, label = "Ver detalle" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/detalle/${pub.id}`);
    };

    const isAdult = () => {
        const fn = localStorage.getItem('fecha_nacimiento');
        if (!fn || fn === 'null') return false;
        const dob = new Date(fn);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
    };
    
    const isBlur = pub.is_nsfw && !isAdult();

    return (
        <article className="tarjeta-pin" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className="imagen-wrapper" style={{ paddingBottom: '100%', position: 'relative' }}>
                <img 
                    src={pub.url_multimedia} 
                    alt={pub.titulo} 
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: isBlur ? 'blur(15px)' : 'none' }}
                />
                <div className="pin-overlay">
                    <Button className="btn-guardar" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
                        {label}
                    </Button>
                    <div className="pin-info-hover">
                        <strong>{pub.titulo}</strong>
                    </div>
                </div>
            </div>
            <div className="info-basica">
                <p>{pub.titulo}</p>
            </div>
        </article>
    );
};

export default PinCard;