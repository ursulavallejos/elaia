import React, { useState } from 'react';
import useFetchProducts from '../hooks/useFetchProducts';
import { FaPalette, FaTruck, FaGem, FaGift } from 'react-icons/fa';
import HeroSection from '../components/HeroSection.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import ProductDetailModal from '../components/ProductDetailModal.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
    const { data: batas, loading: loadingBatas } = useFetchProducts('batas');
    const { data: cosmetiqueros, loading: loadingCosmetiqueros } = useFetchProducts('cosmetiqueros');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Combinar productos para mostrar en "Más vendidos y lo nuevo"
    const featuredProducts = [...(batas || []).slice(0, 4), ...(cosmetiqueros || []).slice(0, 4)];

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    // Definir características
    const features = [
        {
            icon: FaPalette,
            title: 'Diseño Único',
            description: 'Cada pieza es única con diseños exclusivos y elegantes'
        },
        {
            icon: FaTruck,
            title: 'Envíos a Todo Chile',
            description: 'Llegamos a cada rincón del país con envíos seguros'
        },
        {
            icon: FaGem,
            title: 'Diseño Atemporal',
            description: 'Estilos que nunca pasan de moda, siempre elegantes'
        },
        {
            icon: FaGift,
            title: 'Empaque de Regalo',
            description: 'Presentación perfecta para regalar o regalarte'
        }
    ];

    if (loadingBatas || loadingCosmetiqueros) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <HeroSection />

            <FeaturedProducts
                title="Más Vendidos y Lo Nuevo"
                products={featuredProducts}
                primaryButtonText="Ver Todas las Batas"
                primaryButtonLink="/batas"
                secondaryButtonText="Ver Todos los Cosmetiqueros"
                secondaryButtonLink="/cosmetiqueros"
                onViewDetails={handleViewDetails}
            />

            <FeaturesSection
                title="¿Por qué elegir Elaia?"
                features={features}
            />

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