import React, { useState, useRef } from 'react';
import { createPublicacion } from '../../services/api';
import Button from '../atomos/Button';

const PublicacionForm = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tags, setTags] = useState('');
    const [isNsfw, setIsNsfw] = useState(false);
    const [cargando, setCargando] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Selecciona una imagen');
        setCargando(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('tags', tags);
        formData.append('is_nsfw', isNsfw);
        formData.append('usuario_id', localStorage.getItem('usuario_id'));

        try {
            await createPublicacion(formData);
            alert('¡Publicación creada con éxito!');
            window.location.href = '/';
        } catch (error) {
            alert(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <form className="form-crear" onSubmit={handleSubmit}>
            <div 
                className="zona-subida" 
                onClick={() => fileInputRef.current && fileInputRef.current.click()} 
                style={{ border: '2px dashed #620096', padding: '20px', textAlign: 'center', cursor: 'pointer', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', backgroundColor: 'var(--social-bg)' }}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" required style={{ display: 'none' }} />
                {preview ? <img src={preview} style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}} alt="Preview" /> : <p style={{ color: '#8892a0', margin: 0, fontWeight: 'bold' }}>Haz clic en toda esta área para seleccionar tu imagen</p>}
            </div>
            <div className="campos-form">
                <input type="text" placeholder="Añade un título" className="input-form" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                <textarea placeholder="Cuenta de qué trata" className="input-form" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                <input type="text" placeholder="#etiquetas" className="input-form" value={tags} onChange={(e) => setTags(e.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
                    <input type="checkbox" id="nsfw" checked={isNsfw} onChange={(e) => setIsNsfw(e.target.checked)} />
                    <label htmlFor="nsfw">Marcar como contenido NSFW (+18)</label>
                </div>
                <Button type="submit" disabled={cargando} style={{ backgroundColor: '#620096', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%' }}>{cargando ? 'Publicando...' : 'Publicar'}</Button>
            </div>
        </form>
    );
};
export default PublicacionForm;