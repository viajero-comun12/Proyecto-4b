import { useNavigate } from 'react-router-dom';

const CategoriaCard = ({ cat }) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={() => navigate(`/?categoria=${cat.nombre}`)} 
            style={{ cursor: 'pointer', position: 'relative', width: '200px', height: '120px', borderRadius: '15px', overflow: 'hidden' }}
        >
            <img src={cat.imagen} alt={cat.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ color: 'white', textTransform: 'capitalize' }}>{cat.nombre}</h3>
            </div>
        </div>
    );
};

export default CategoriaCard;
