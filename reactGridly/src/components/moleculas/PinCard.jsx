import React from 'react';

const PinCard = ({ pub }) => {
    return (
        <article className="tarjeta-pin">
            <div className="imagen-wrapper">
                <img src={pub.url_multimedia} alt={pub.titulo} />
                <div className="pin-overlay">
                    <button className="btn-guardar">Ver detalle</button>
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