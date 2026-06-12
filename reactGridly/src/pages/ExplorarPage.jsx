import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublicaciones, buscarUsuarios, getCategorias } from '../services/api';
import PinCard from '../components/moleculas/PinCard';
import SeguidoCard from '../components/moleculas/SeguidoCard';
import CategoriaCard from '../components/moleculas/CategoriaCard';

const ExplorarPage = () => {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q');
    const [publicaciones, setPublicaciones] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const pubs = await getPublicaciones();
            if (q) {
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
    }, [q]); 

    return (
        <>
            <section className="seccion-app sec-explorar" style={{ display: 'block' }}>
                <div className="encabezado-seccion">
                    <h2>{q ? `Resultados para: "${q}"` : "Explorar por Categorías"}</h2>
                    {!q && <p style={{ color: '#8892a0', marginTop: '5px' }}>Descubre ideas nuevas divididas por temas.</p>}
                </div>

                {!q && (
                    <div className="categorias-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '20px 0' }}>
                        {categorias.map(cat => (
                            <CategoriaCard key={cat.nombre} cat={cat} />
                        ))}
                    </div>
                )}

                {q && usuarios.length > 0 && (
                    <div id="resultados-usuarios" style={{ marginBottom: '30px' }}>
                        <div className="encabezado-seccion"><h3>Usuarios Encontrados</h3></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '10px' }}>
                            {usuarios.map(u => (
                                <SeguidoCard key={u.id} user={u} />
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
        </>
    );
};

export default ExplorarPage;
