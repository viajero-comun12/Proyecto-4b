import React, { useState } from 'react';
import { createPublicacion } from '../../services/api';
import Button from '../atomos/Button';

const PublicacionForm = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tags, setTags] = useState('');
    const [cargando, setCargando] = useState(false);

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
            <div className="zona-subida">
                <input type="file" onChange={handleFileChange} accept="image/*" required />
                {preview ? <img src={preview} style={{width: '100%'}} alt="Preview" /> : <p>Haz clic para seleccionar imagen</p>}
            </div>
            <div className="campos-form">
                <input type="text" placeholder="Añade un título" className="input-form" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                <textarea placeholder="Cuenta de qué trata" className="input-form" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                <input type="text" placeholder="#etiquetas" className="input-form" value={tags} onChange={(e) => setTags(e.target.value)} />
                <Button type="submit" disabled={cargando}>{cargando ? 'Publicando...' : 'Publicar'}</Button>
            </div>
        </form>
    );
};
export default PublicacionForm;