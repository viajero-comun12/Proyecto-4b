import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../atomos/Button';

const PinCard = ({ pub, label = "Ver detalle" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate(`/detalle/${pub.id}`, { state: { pub } });
            });
        } else {
            navigate(`/detalle/${pub.id}`, { state: { pub } });
        }
    };

    const [isAdultUser, setIsAdultUser] = React.useState(false);

    React.useEffect(() => {
        const fn = localStorage.getItem('fecha_nacimiento');
        if (!fn || fn === 'null') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAdultUser(false);
            return;
        }
        const dob = new Date(fn);
        const ageDifMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageDifMs);
         
        setIsAdultUser(Math.abs(ageDate.getUTCFullYear() - 1970) >= 18);
    }, []);
    
    const isBlur = pub.is_nsfw && !isAdultUser;

    return (
        <article 
            className="break-inside-avoid mb-5 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out relative cursor-pointer group hover:-translate-y-1"
            onClick={handleClick}
        >
            <div className="relative w-full pb-[100%] bg-beige-light overflow-hidden">
                <img 
                    src={pub.url_multimedia} 
                    alt={pub.titulo} 
                    className="absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ 
                        filter: isBlur ? 'blur(15px)' : 'none',
                        viewTransitionName: `pub-image-${pub.id}`
                    }}
                />
                <div className="absolute inset-0 bg-gray-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-4">
                    <Button 
                        className="self-end bg-accent text-white border-none rounded-full px-4 py-2 font-bold cursor-pointer -translate-y-2.5 group-hover:translate-y-0 transition-all duration-300 hover:bg-accent-light"
                        onClick={(e) => { e.stopPropagation(); handleClick(); }}
                    >
                        {label}
                    </Button>
                    <div className="text-white translate-y-2.5 group-hover:translate-y-0 transition-all duration-300">
                        <strong className="font-sans text-lg block mb-1">{pub.titulo}</strong>
                    </div>
                </div>
            </div>
            <div className="px-4 py-3 flex justify-between items-center">
                <p className="font-semibold text-sm text-gray-dark truncate">{pub.titulo}</p>
            </div>
        </article>
    );
};

export default PinCard;