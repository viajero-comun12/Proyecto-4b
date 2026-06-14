import { useNavigate } from 'react-router-dom';

const CategoriaCard = ({ cat }) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={() => navigate(`/?categoria=${cat.nombre}`)} 
            className="relative w-[200px] h-[120px] rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gray-dark/50 group-hover:bg-gray-dark/60 transition-all duration-300 flex items-center justify-center">
                <h3 className="text-white capitalize text-lg font-bold">{cat.nombre}</h3>
            </div>
        </div>
    );
};

export default CategoriaCard;
