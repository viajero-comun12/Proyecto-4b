import { useRef } from 'react';

const FormFileDropzone = ({ preview, onFileChange, required = true }) => {
    const fileInputRef = useRef(null);

    return (
        <div 
            className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-accent rounded-2xl bg-beige-light/30 text-center cursor-pointer transition-all duration-300 p-5 hover:border-accent-light hover:bg-beige/20"
            onClick={() => fileInputRef.current && fileInputRef.current.click()} 
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileChange} 
                accept="image/*" 
                required={required} 
                className="hidden" 
            />
            {preview ? (
                <img src={preview} className="max-h-full max-w-full object-contain rounded-xl" alt="Preview" />
            ) : (
                <p className="text-gray-muted m-0 font-semibold">
                    Haz clic en toda esta área para seleccionar tu imagen
                </p>
            )}
        </div>
    );
};

export default FormFileDropzone;
