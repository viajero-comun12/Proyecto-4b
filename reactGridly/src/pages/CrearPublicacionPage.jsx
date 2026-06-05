import React from 'react';
import MainLayout from '../components/templates/MainLayout';
import PublicacionForm from '../components/organismos/PublicacionForm';

const CrearPublicacionPage = () => {
    return (
        <MainLayout>
            <section className="seccion-app sec-crear-pub" style={{ display: 'block' }}>
                <div className="contenedor-formulario">
                    <h2>Crear Nueva Publicación</h2>
                    <PublicacionForm />
                </div>
            </section>
        </MainLayout>
    );
};
export default CrearPublicacionPage;