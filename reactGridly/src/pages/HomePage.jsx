import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFiltroCat(categoriaQuery);
        }
    }, [categoriaQuery]);

    const pubsFiltradas = filtroCat ? publicaciones.filter(p => p.tags && p.tags.toLowerCase().includes(filtroCat)) : publicaciones;

    return (
        <section className="block animate-fade-in">
            <nav className="flex gap-3 overflow-x-auto py-4 px-6 md:px-10 scrollbar-hide">
                <Button 
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-sm border border-beige hover:-translate-y-0.5 ${!filtroCat ? 'bg-gray-dark text-white border-gray-dark' : 'bg-white text-gray-dark hover:bg-beige-light/50'}`} 
                    onClick={() => setFiltroCat(null)}
                >
                    Para ti
                </Button>
                {categorias.map(cat => (
                    <Button 
                        key={cat.nombre} 
                        className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-sm border border-beige hover:-translate-y-0.5 ${filtroCat === cat.nombre ? 'bg-gray-dark text-white border-gray-dark' : 'bg-white text-gray-dark hover:bg-beige-light/50'}`} 
                        onClick={() => setFiltroCat(cat.nombre)}
                    >
                        {cat.nombre}
                    </Button>
                ))}
            </nav>
            <section className="feed-mosaico pt-5">
                {pubsFiltradas.map(pub => (
                    <PinCard key={pub.id} pub={pub} />
                ))}
            </section>
        </section>
    );
};
export default HomePage;
