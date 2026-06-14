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
        <section className="block animate-fade-in">
            <div className="px-10 pt-8 pb-3">
                <h2 className="text-3xl text-gray-dark">{q ? `Resultados para: "${q}"` : "Explorar por Categorías"}</h2>
                {!q && <p className="text-gray-muted mt-2 text-base">Descubre ideas nuevas divididas por temas.</p>}
            </div>

            {!q && (
                <div className="flex flex-wrap gap-5 px-10 py-5">
                    {categorias.map(cat => (
                        <CategoriaCard key={cat.nombre} cat={cat} />
                    ))}
                </div>
            )}

            {q && usuarios.length > 0 && (
                <div className="mb-8 px-10">
                    <div className="pt-5 pb-3"><h3 className="text-2xl text-gray-dark">Usuarios Encontrados</h3></div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-3">
                        {usuarios.map(u => (
                            <SeguidoCard key={u.id} user={u} />
                        ))}
                    </div>
                </div>
            )}

            <div className="px-10 pt-8 pb-3">
                <h3 className="text-2xl text-gray-dark">{q ? 'Publicaciones Encontradas' : 'Mix de Publicaciones'}</h3>
            </div>
            
            <section className="feed-mosaico">
                {publicaciones.map(pub => <PinCard key={pub.id} pub={pub} />)}
            </section>
        </section>
    );
};

export default ExplorarPage;
