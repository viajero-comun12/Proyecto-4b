import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import { getPublicaciones, buscarUsuarios } from '../services/api';
import PinCard from '../components/moleculas/PinCard';

const ExplorarPage = () => {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const [publicaciones, setPublicaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const pubs = await getPublicaciones();
            
            if (q) {
                // Filtrar publicaciones por título o autor (lógica que tenías en js)
                const filtradas = pubs.filter(p => 
                    p.titulo.toLowerCase().includes(q.toLowerCase()) || 
                    (p.autor && p.autor.username.toLowerCase().includes(q.toLowerCase()))
                );
                setPublicaciones(filtradas);
                
                const users = await buscarUsuarios(q);
                setUsuarios(users);
            } else {
                setPublicaciones(pubs);
            }
        };
        fetchData();
    }, [q]); // Se vuelve a ejecutar si la 'q' cambia

    return (
        <MainLayout>
            <section className="seccion-app sec-explorar" style={{ display: 'block' }}>
                <div className="encabezado-seccion">
                    <h2>{q ? `Resultados para: "${q}"` : "Explorar por Categorías"}</h2>
                    {!q && <p style={{ color: '#8892a0', marginTop: '5px' }}>Descubre ideas nuevas divididas por temas.</p>}
                </div>

                {!q && (
                    <div className="categorias-grid">
                        <div className="cat-card">Categoria 1</div>
                        <div className="cat-card">Categoria 2</div>
                        {/*categorias dinamicas implementar a futuro*/}
                    </div>
                )}

                {q && usuarios.length > 0 && (
                    <div id="resultados-usuarios" style={{ marginBottom: '30px' }}>
                        <div className="encabezado-seccion"><h3>Usuarios Encontrados</h3></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                            {usuarios.map(u => (
                                <div key={u.id} className="usuario-resultado">
                                    <strong>@{u.username}</strong>
                                    <button onClick={() => window.location.href = `/usuario/${u.id}`}>Ver Perfil</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="encabezado-seccion">
                    <h3>{q ? 'Publicaciones Encontradas' : 'Mix de Publicaciones'}</h3>
                </div>
                
                <section className="feed-mosaico">
                    {publicaciones.map(pub => <PinCard key={pub.id} pub={pub} />)}
                </section>
            </section>
        </MainLayout>
    );
};

export default ExplorarPage;