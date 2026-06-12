import PublicacionForm from '../components/organismos/PublicacionForm';

const CrearPublicacionPage = () => {
    return (
        <section className="block animate-fade-in">
            <div className="max-w-[800px] mx-auto bg-white rounded-2xl p-10 shadow-md my-10">
                <h2 className="text-2xl mb-6 text-gray-dark">Crear Nueva Publicación</h2>
                <PublicacionForm />
            </div>
        </section>
    );
};
export default CrearPublicacionPage;
