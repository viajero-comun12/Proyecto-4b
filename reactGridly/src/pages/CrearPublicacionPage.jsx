import PublicacionForm from '../components/organismos/PublicacionForm';

const CrearPublicacionPage = () => {
    return (
        <>
            <section className="seccion-app sec-crear-pub" style={{ display: 'block' }}>
                <div className="contenedor-formulario">
                    <h2>Crear Nueva Publicación</h2>
                    <PublicacionForm />
                </div>
            </section>
        </>
    );
};
export default CrearPublicacionPage;
