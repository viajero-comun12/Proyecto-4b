import { useRef } from 'react';

const FormFileDropzone = ({ preview, onFileChange, required = true }) => {
    const fileInputRef = useRef(null);

    return (
        <div 
            className="zona-subida" 
            onClick={() => fileInputRef.current && fileInputRef.current.click()} 
            style={{ border: '2px dashed #620096', padding: '20px', textAlign: 'center', cursor: 'pointer', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', backgroundColor: 'var(--social-bg)' }}
        >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onFileChange} 
                accept="image/*" 
                required={required} 
                style={{ display: 'none' }} 
            />
            {preview ? (
                <img src={preview} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} alt="Preview" />
            ) : (
                <p style={{ color: '#8892a0', margin: 0, fontWeight: 'bold' }}>
                    Haz clic en toda esta área para seleccionar tu imagen
                </p>
            )}
        </div>
    );
};

export default FormFileDropzone;
