import React from 'react';
import { useNavigate } from 'react-router-dom';

const PinCard = ({ pub, label = "Ver detalle" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/detalle/${pub.id}`);
    };

    return (
        <article className="tarjeta-pin" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <div className="imagen-wrapper" style={{ paddingBottom: '100%', position: 'relative' }}>
                <img 
                    src={pub.url_multimedia} 
                    alt={pub.titulo} 
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="pin-overlay">
                    <button className="btn-guardar" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
                        {label}
                    </button>
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