import React, { useEffect, useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import { getPublicaciones } from '../services/api';
import PinCard from '../components/moleculas/PinCard';

const HomePage = () => {
    const [publicaciones, setPublicaciones] = useState([]);

    useEffect(() => {
        getPublicaciones().then(data => setPublicaciones(data));
    }, []);

    return (
        <MainLayout>
            <section className="seccion-app sec-inicio" style={{ display: 'block' }}>
                <nav className="barra-categorias">
                    <button className="btn-categoria activo">Para ti</button>
                </nav>
                <section className="feed-mosaico" id="feed-inicio">
                    {publicaciones.map(pub => (
                        <article key={pub.id} className="tarjeta-pin">
                            <PinCard key={pub.id} pub={pub} />
                        </article>
                    ))}
                </section>
            </section>
        </MainLayout>
    );

    

};
export default HomePage;

