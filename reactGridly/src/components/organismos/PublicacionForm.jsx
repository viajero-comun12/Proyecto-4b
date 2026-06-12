import { useState } from 'react';
import { createPublicacion } from '../../services/api';
import Button from '../atomos/Button';
import FormInput from '../moleculas/FormInput';
import FormTextarea from '../moleculas/FormTextarea';
import FormCheckbox from '../moleculas/FormCheckbox';
import FormFileDropzone from '../moleculas/FormFileDropzone';

const PublicacionForm = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tags, setTags] = useState('');
    const [isNsfw, setIsNsfw] = useState(false);
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
        formData.append('titulo', titulo.trim());
        formData.append('descripcion', descripcion.trim());
        formData.append('tags', tags.trim());
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
        <form className="flex gap-8 mt-5 flex-wrap" onSubmit={handleSubmit}>
            <FormFileDropzone 
                preview={preview} 
                onFileChange={handleFileChange} 
                required={true} 
            />
            <div className="flex-1 min-w-[300px] flex flex-col gap-5">
                <FormInput type="text" id="titulo" placeholder="Añade un título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required={true} maxLength={100} />
                <FormTextarea id="descripcion" placeholder="Cuenta de qué trata" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} maxLength={500} />
                <FormInput 
                    type="text" id="tags" placeholder="etiquetas (separadas por coma)" value={tags} 
                    onChange={(e) => {
                        let val = e.target.value;
                        if (val && !val.startsWith('#')) val = '#' + val;
                        val = val.replace(/,\s*/g, ', #').replace(/#{2,}/g, '#');
                        setTags(val);
                    }}
                    maxLength={150}
                />
                <FormCheckbox id="nsfw" label="Marcar como contenido NSFW (+18)" checked={isNsfw} onChange={(e) => setIsNsfw(e.target.checked)} />
                <Button type="submit" disabled={cargando} className="w-full bg-gray-dark text-beige py-3 px-6 rounded-2xl border-none cursor-pointer text-base font-semibold transition-all duration-300 hover:bg-gray-mid hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    {cargando ? 'Publicando...' : 'Publicar'}
                </Button>
            </div>
        </form>
    );
};
export default PublicacionForm;