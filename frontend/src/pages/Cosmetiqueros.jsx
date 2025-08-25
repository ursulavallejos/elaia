import React, { useState } from 'react';
import CardProducto from '../components/CardProducto.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import Footer from '../components/Footer.jsx';
import useFetchProducts from '../hooks/useFetchProducts';
import { BRAND_COLORS } from '../constants/colors';

export default function Cosmetiqueros() {
    const { data: products, loading } = useFetchProducts('cosmetiqueros');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    if (loading) {
        return (
            <div>
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando productos...</span>
                    </div>
                    <p className="mt-3 text-muted">Cargando nuestros elegantes cosmetiqueros...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            {/* Header Section */}
            <div className="bg-light py-4">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1 className="display-5 fw-bold mb-2" style={{ color: BRAND_COLORS.dark }}>
                                💄 Cosmetiqueros Exclusivos
                            </h1>
                            <p className="lead text-muted mb-0">
                                Organiza tus productos de belleza con estilo en nuestros cosmetiqueros de diseño único
                            </p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <span className="badge bg-primary fs-6 px-3 py-2">
                                {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container my-5">
                {products.length === 0 ? (
                    <div className="text-center py-5">
                        <div className="mb-4">
                            <i className="fas fa-shopping-bag fa-3x text-muted"></i>
                        </div>
                        <h3 className="text-muted">No hay productos disponibles</h3>
                        <p className="text-muted">Estamos trabajando para traerte los mejores cosmetiqueros pronto.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {products.map(producto => (
                            <div key={producto.id} className="col-lg-4 col-md-6 col-sm-12">
                                <CardProducto
                                    id={producto.id}
                                    nombre={producto.nombre}
                                    descripcion={producto.descripcion}
                                    precio={producto.precio}
                                    imagenUrl={producto.imagenUrl}
                                    productType="cosmetiqueros"
                                    onViewDetails={handleViewDetails}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Additional Features Section */}
                {products.length > 0 && (
                    <div className="row mt-5 pt-4 border-top">
                        <div className="col-md-4 text-center mb-4">
                            <div className="mb-3">
                                <i className="fas fa-box fa-2x" style={{ color: BRAND_COLORS.primary }}></i>
                            </div>
                            <h5>Organización Perfecta</h5>
                            <p className="text-muted small">Compartimentos diseñados para cada tipo de cosmético</p>
                        </div>
                        <div className="col-md-4 text-center mb-4">
                            <div className="mb-3">
                                <i className="fas fa-suitcase fa-2x" style={{ color: BRAND_COLORS.primary }}></i>
                            </div>
                            <h5>Portabilidad Premium</h5>
                            <p className="text-muted small">Fáciles de transportar sin comprometer el estilo</p>
                        </div>
                        <div className="col-md-4 text-center mb-4">
                            <div className="mb-3">
                                <i className="fas fa-star fa-2x" style={{ color: BRAND_COLORS.primary }}></i>
                            </div>
                            <h5>Diseño Exclusivo</h5>
                            <p className="text-muted small">Patrones únicos que reflejan tu personalidad</p>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
            
            {/* Modal de detalles del producto */}
            <ProductDetailModal
                product={selectedProduct}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </div>
    );
}