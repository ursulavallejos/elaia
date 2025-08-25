import React from 'react';
import { Link } from 'react-router-dom';
import CardProducto from './CardProducto.jsx';
import { BRAND_COLORS } from '../constants/colors';

export default function FeaturedProducts({ 
    title, 
    products, 
    primaryButtonText, 
    primaryButtonLink, 
    secondaryButtonText, 
    secondaryButtonLink,
    className = '',
    onViewDetails
}) {
    return (
        <section className={`py-5 bg-light ${className}`}>
            <div className="container">
                <h2 className="text-center mb-5" style={{ color: BRAND_COLORS.dark }}>{title}</h2>
                <div className="row justify-content-center">
                    {products.slice(0, 6).map((producto, index) => (
                        <div key={`featured-${producto.productType || 'product'}-${producto.id}-${index}`} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <CardProducto
                                id={producto.id}
                                nombre={producto.nombre}
                                descripcion={producto.descripcion}
                                precio={producto.precio}
                                imagenUrl={producto.imagenUrl}
                                productType={producto.productType || (index < 4 ? 'batas' : 'cosmetiqueros')}
                                onViewDetails={onViewDetails}
                            />
                        </div>
                    ))}
                </div>
                {(primaryButtonText || secondaryButtonText) && (
                    <div className="text-center mt-4">
                        {primaryButtonText && primaryButtonLink && (
                            <Link 
                                to={primaryButtonLink} 
                                className="btn btn-outline-primary me-3"
                                style={{ 
                                    borderColor: BRAND_COLORS.primary,
                                    color: BRAND_COLORS.primary
                                }}
                            >
                                {primaryButtonText}
                            </Link>
                        )}
                        {secondaryButtonText && secondaryButtonLink && (
                            <Link 
                                to={secondaryButtonLink} 
                                className="btn btn-outline-primary"
                                style={{ 
                                    borderColor: BRAND_COLORS.primary,
                                    color: BRAND_COLORS.primary
                                }}
                            >
                                {secondaryButtonText}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
} 