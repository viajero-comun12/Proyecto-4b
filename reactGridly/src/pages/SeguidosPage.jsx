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
        <>
            <section className="seccion-app sec-explorar" style={{ display: 'block' }}>
                <div className="encabezado-seccion flex-between">
                    <h2>Personas que Sigues</h2>
                </div>

                <div id="lista-seguidos" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    {cargando ? <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Cargando...</p> :
                     seguidos.length > 0 ? (
                        seguidos.map(usr => <SeguidoCard key={usr.id} user={usr} />)
                     ) : (
                        <p style={{ textAlign: 'center', color: '#8892a0', gridColumn: '1 / -1' }}>Aún no sigues a nadie.</p>
                     )}
                </div>
            </section>
        </>
    );
};
export default SeguidosPage;
