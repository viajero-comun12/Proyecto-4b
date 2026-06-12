import { useEffect, useState } from 'react';
import SeguidoCard from '../components/moleculas/SeguidoCard';
import { getSeguidos } from '../services/api';

const SeguidosPage = () => {
    const [seguidos, setSeguidos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuario_id');
        if (usuarioId) {
            getSeguidos(usuarioId)
                .then(data => {
                    setSeguidos(data);
                    setCargando(false);
                })
                .catch(() => setCargando(false));
        }
    }, []);

    return (
        <section className="block animate-fade-in py-8 px-5 max-w-[1200px] mx-auto">
            <div className="mb-8 border-b border-beige pb-4">
                <h2 className="text-3xl text-gray-dark">Personas que Sigues</h2>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5 mt-5">
                {cargando ? <p className="text-center col-span-full text-gray-muted py-5">Cargando...</p> :
                 seguidos.length > 0 ? (
                    seguidos.map(usr => <SeguidoCard key={usr.id} user={usr} />)
                 ) : (
                    <p className="text-center text-gray-muted col-span-full py-5">Aún no sigues a nadie.</p>
                 )}
            </div>
        </section>
    );
};
export default SeguidosPage;
