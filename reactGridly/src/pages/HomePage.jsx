import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import { getPublicaciones, getCategorias } from '../services/api';
import PinCard from '../components/moleculas/PinCard';
import Button from '../components/atomos/Button';

const HomePage = () => {
    const [searchParams] = useSearchParams();
    const categoriaQuery = searchParams.get('categoria');
    const [publicaciones, setPublicaciones] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroCat, setFiltroCat] = useState(categoriaQuery || null);

    useEffect(() => {
        getPublicaciones().then(data => setPublicaciones(data));
        getCategorias().then(data => setCategorias(data));
    }, []);

    useEffect(() => {
        if (categoriaQuery) {
            setFiltroCat(categoriaQuery);
        }
    }, [categoriaQuery]);

    const pubsFiltradas = filtroCat ? publicaciones.filter(p => p.tags && p.tags.toLowerCase().includes(filtroCat)) : publicaciones;

    return (
        <MainLayout>
            <section className="seccion-app sec-inicio" style={{ display: 'block' }}>
                <nav className="barra-categorias" style={{ display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
                    <Button className={`btn-categoria ${!filtroCat ? 'activo' : ''}`} onClick={() => setFiltroCat(null)}>Para ti</Button>
                    {categorias.map(cat => (
                        <Button key={cat.nombre} className={`btn-categoria ${filtroCat === cat.nombre ? 'activo' : ''}`} onClick={() => setFiltroCat(cat.nombre)}>
                            {cat.nombre}
                        </Button>
                    ))}
                </nav>
                <section className="feed-mosaico" id="feed-inicio">
                    {pubsFiltradas.map(pub => (
                        <article key={pub.id} className="tarjeta-pin">
                            <PinCard pub={pub} />
                        </article>
                    ))}
                </section>
            </section>
        </MainLayout>
    );

    

};
export default HomePage;

