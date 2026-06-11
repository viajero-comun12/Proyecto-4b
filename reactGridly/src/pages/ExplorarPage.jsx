import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../components/templates/MainLayout';
import { getPublicaciones, buscarUsuarios, getCategorias } from '../services/api';
import PinCard from '../components/moleculas/PinCard';
import UserCard from '../components/moleculas/UserCard';
import { useNavigate } from 'react-router-dom';

const ExplorarPage = () => {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const [publicaciones, setPublicaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const navigate = useNavigate();

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
                const cats = await getCategorias();
                setCategorias(cats);
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
                    <div className="categorias-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '20px 0' }}>
                        {categorias.map(cat => (
                            <div key={cat.nombre} onClick={() => navigate(`/?categoria=${cat.nombre}`)} style={{ cursor: 'pointer', position: 'relative', width: '200px', height: '120px', borderRadius: '15px', overflow: 'hidden' }}>
                                <img src={cat.imagen} alt={cat.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <h3 style={{ color: 'white', textTransform: 'capitalize' }}>{cat.nombre}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {q && usuarios.length > 0 && (
                    <div id="resultados-usuarios" style={{ marginBottom: '30px' }}>
                        <div className="encabezado-seccion"><h3>Usuarios Encontrados</h3></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                            {usuarios.map(u => (
                                <UserCard key={u.id} user={u} />
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