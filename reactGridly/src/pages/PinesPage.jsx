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
    
    const getPinesTodos = () => {
        let todos = [...misPubs, ...misPines];
        misTableros.forEach(t => { 
            if (t.publicaciones) todos = todos.concat(t.publicaciones); 
        });
        
        const uniqueMap = new Map();
        todos.forEach(p => uniqueMap.set(p.id, p));
        return Array.from(uniqueMap.values());
    };

    const renderContenido = () => {
        if (cargando) return <p className="text-center w-full text-gray-muted mt-10">Cargando tus pines...</p>;

        if (tableroId) {
            const tableroActual = misTableros.find(t => t.id === parseInt(tableroId));
            if (!tableroActual) return <p className="text-center w-full text-gray-muted mt-10">Tablero no encontrado.</p>;
            
            const pinesTablero = tableroActual.publicaciones || [];
            if (pinesTablero.length === 0) return <p className="text-center w-full text-gray-muted mt-10">Este tablero está vacío.</p>;

            return pinesTablero.map(pub => (
                <div key={pub.id} className="relative group">
                    <PinCard pub={pub} />
                    {tableroActual.usuario_id === miId && (
                        <Button 
                            onClick={() => handleRemoveFromTablero(pub.id)}
                            className="absolute bottom-5 right-4 px-3 py-1.5 text-xs z-10 bg-danger/90 border-none rounded-lg text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-danger"
                        >
                            Remover
                        </Button>
                    )}
                </div>
            ));
        }

        if (filtro === 'todos') {
            const pinesTodos = getPinesTodos();
            if (pinesTodos.length === 0) return <p className="text-center w-full text-gray-muted mt-10">No hay pines para mostrar.</p>;
            return pinesTodos.map(pub => <PinCard key={pub.id} pub={pub} />);
        }

        if (filtro === 'subidos') {
            if (misPubs.length === 0) return <p className="text-center w-full text-gray-muted mt-10">No has subido ningún pin aún.</p>;
            return misPubs.map(pub => <PinCard key={pub.id} pub={pub} />);
        }

        if (filtro === 'guardados') {
            if (misTableros.length === 0 && misPines.length === 0) {
                return <p className="text-center w-full text-gray-muted mt-10">No has guardado nada aún.</p>;
            }

            return (
                <>
                    {misTableros.map(t => (
                        <TableroCard key={`tab-${t.id}`} tablero={t} onClick={() => setSearchParams({ tablero: t.id })} />
                    ))}
                    {misPines.map(pub => (
                        <PinCard key={`pin-${pub.id}`} pub={pub}/>
                    ))}
                </>
            );
        }
    };

    if (!miId) return <p className="p-5 text-center mt-10 text-gray-dark">Inicia sesión para ver tus pines.</p>;

    let tituloEncabezado = "Todos los Pines";
    if (tableroId) {
        const t = misTableros.find(tab => tab.id === parseInt(tableroId));
        if (t) tituloEncabezado = `Tablero: ${t.nombre}`;
    } else if (filtro === 'subidos') tituloEncabezado = "Mis Subidas";
    else if (filtro === 'guardados') tituloEncabezado = "Mis Guardados (Tableros y Favoritos)";

    const getEstiloFiltro = (nombreFiltro) => {
        return filtro === nombreFiltro && !tableroId 
            ? "bg-gray-dark text-white px-5 py-2 rounded-full cursor-pointer font-bold shadow-sm transition-all duration-300" 
            : "px-5 py-2 cursor-pointer text-gray-muted font-medium hover:bg-beige/50 rounded-full transition-all duration-300";
    };

    return (
        <section className="block animate-fade-in">
            <div className="px-10 pt-8 pb-4 flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-3xl text-gray-dark">{tituloEncabezado}</h2>
                
                <div className="flex gap-5">
                    <div className="flex gap-1.5 bg-white p-1.5 rounded-full shadow-sm border border-beige">
                        <span className={getEstiloFiltro('todos')} onClick={() => cambiarFiltro('todos')}>Todos</span>
                        <span className={getEstiloFiltro('subidos')} onClick={() => cambiarFiltro('subidos')}>Mis Subidas</span>
                        <span className={getEstiloFiltro('guardados')} onClick={() => cambiarFiltro('guardados')}>Guardados</span>
                    </div>
                </div>
            </div>

            <section className="feed-mosaico">
                {renderContenido()}
            </section>
        </section>
    );
};

export default PinesPage;
