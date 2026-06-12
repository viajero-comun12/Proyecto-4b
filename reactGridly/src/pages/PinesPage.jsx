import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PinCard from '../components/moleculas/PinCard';
import TableroCard from '../components/moleculas/TableroCard';
import { getPublicaciones, getUsuarioPines, getTablerosUsuario, removePinFromTablero } from '../services/api';
import Button from '../components/atomos/Button';
const PinesPage = () => {
    const miId = parseInt(localStorage.getItem('usuario_id'));
    
    const [searchParams, setSearchParams] = useSearchParams();
    const tableroId = searchParams.get('tablero');

    const [filtro, setFiltro] = useState(tableroId ? 'guardados' : 'todos');
    const [misPubs, setMisPubs] = useState([]);
    const [misPines, setMisPines] = useState([]);
    const [misTableros, setMisTableros] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!miId || isNaN(miId)) return;

        const cargarDatos = async () => {
            setCargando(true);
            try {
                const pubs = await getPublicaciones();
                if (Array.isArray(pubs)) {
                    setMisPubs(pubs.filter(p => p.usuario_id === miId));
                }

                const pines = await getUsuarioPines(miId);
                if (Array.isArray(pines)) setMisPines(pines);

                const tableros = await getTablerosUsuario(miId);
                if (Array.isArray(tableros)) setMisTableros(tableros);

            } catch (error) {
                console.error("Error al cargar pines:", error);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [miId]);

    const cambiarFiltro = (nuevoFiltro) => {
        setFiltro(nuevoFiltro);
        if (tableroId) {
            setSearchParams({}); 
        }
    };

    // ==========================================
    // LÓGICA DE RENDERIZADO (Filtros)
    // ==========================================

    const handleRemoveFromTablero = async (pubId) => {
        if (!window.confirm("¿Seguro que quieres quitar este pin del tablero?")) return;
        try {
            await removePinFromTablero(tableroId, pubId);
            const tableros = await getTablerosUsuario(miId);
            setMisTableros(tableros);
        } catch (err) {
            console.error(err);
            alert("Error al quitar el pin");
        }
    };
    
    // Obtener pines deduplicados para "Todos"
    const getPinesTodos = () => {
        let todos = [...misPubs, ...misPines];
        misTableros.forEach(t => { 
            if (t.publicaciones) todos = todos.concat(t.publicaciones); 
        });
        
        // Eliminar duplicados por ID
        const uniqueMap = new Map();
        todos.forEach(p => uniqueMap.set(p.id, p));
        return Array.from(uniqueMap.values());
    };

    // ==========================================
    const renderContenido = () => {
        if (cargando) return <p style={{ textAlign: 'center', width: '100%', color: '#8892a0' }}>Cargando tus pines...</p>;

        // 1. MODO TABLERO ESPECÍFICO (Se activó en la URL)
        if (tableroId) {
            const tableroActual = misTableros.find(t => t.id === parseInt(tableroId));
            if (!tableroActual) return <p style={{ textAlign: 'center', width: '100%', color: '#8892a0' }}>Tablero no encontrado.</p>;
            
            const pinesTablero = tableroActual.publicaciones || [];
            if (pinesTablero.length === 0) return <p style={{ textAlign: 'center', width: '100%', color: '#8892a0' }}>Este tablero está vacío.</p>;

            return pinesTablero.map(pub => (
                <div key={pub.id} style={{ position: 'relative' }}>
                    <PinCard pub={pub} />
                    {tableroActual.usuario_id === miId && (
                        <Button 
                            onClick={() => handleRemoveFromTablero(pub.id)}
                            style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '5px 10px', fontSize: '0.8rem', zIndex: 10, background: 'rgba(255,0,0,0.8)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}
                        >
                            Remover
                        </Button>
                    )}
                </div>
            ));
        }

        // 2. MODO "TODOS"
        if (filtro === 'todos') {
            const pinesTodos = getPinesTodos();
            if (pinesTodos.length === 0) return <p style={{ textAlign: 'center', width: '100%', color: '#8892a0' }}>No hay pines para mostrar.</p>;
            
            return pinesTodos.map(pub => (
                <PinCard key={pub.id} pub={pub} />
            ));
        }

        // 3. MODO "SUBIDOS"
        if (filtro === 'subidos') {
            if (misPubs.length === 0) return <p style={{ textAlign: 'center', width: '100%', color: '#8892a0' }}>No has subido ningún pin aún.</p>;
            
            return misPubs.map(pub => (
                <PinCard key={pub.id} pub={pub} />
            ));
        }

        // 4. MODO "GUARDADOS" (Tableros + Likes)
        if (filtro === 'guardados') {
            if (misTableros.length === 0 && misPines.length === 0) {
                return <p style={{ textAlign: 'center', width: '100%', color: '#8892a0' }}>No has guardado nada aún.</p>;
            }

            return (
                <>
                    {/* Renderizar Tableros como Carpetas */}
                    {misTableros.map(t => (
                        <TableroCard 
                            key={`tab-${t.id}`} 
                            tablero={t} 
                            onClick={() => setSearchParams({ tablero: t.id })} 
                        />
                    ))}

                    {/* Renderizar Pines sueltos guardados (Likes) */}
                    {misPines.map(pub => (
    <PinCard key={`pin-${pub.id}`} pub={pub}/>
))}
                </>
            );
        }
    };

    if (!miId) return <><p style={{ padding: '20px', textAlign: 'center' }}>Inicia sesión para ver tus pines.</p></>;

    // Determinar el título dinámicamente
    let tituloEncabezado = "Todos los Pines";
    if (tableroId) {
        const t = misTableros.find(tab => tab.id === parseInt(tableroId));
        if (t) tituloEncabezado = `Tablero: ${t.nombre}`;
    } else if (filtro === 'subidos') tituloEncabezado = "Mis Subidas";
    else if (filtro === 'guardados') tituloEncabezado = "Mis Guardados (Tableros y Favoritos)";

    const getEstiloFiltro = (nombreFiltro) => {
        return filtro === nombreFiltro && !tableroId 
            ? { backgroundColor: 'var(--color-morado)', color: 'white', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' } 
            : { padding: '6px 16px', cursor: 'pointer', color: '#8892a0' };
    };

    return (
        <>
            <section className="seccion-app sec-pines" style={{ display: 'block' }}>
                
                <div className="encabezado-seccion flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>{tituloEncabezado}</h2>
                    
                    <div className="controles-vista" style={{ display: 'flex', gap: '20px' }}>
                        <div className="filtros" style={{ display: 'flex', gap: '10px', background: '#f5f4f0', padding: '4px', borderRadius: '24px' }}>
                            <span style={getEstiloFiltro('todos')} onClick={() => cambiarFiltro('todos')}>Todos</span>
                            <span style={getEstiloFiltro('subidos')} onClick={() => cambiarFiltro('subidos')}>Mis Subidas</span>
                            <span style={getEstiloFiltro('guardados')} onClick={() => cambiarFiltro('guardados')}>Guardados</span>
                        </div>
                    </div>
                </div>

                <section className="feed-dinamico feed-mosaico">
                    {renderContenido()}
                </section>
                
            </section>
        </>
    );
};

export default PinesPage;
