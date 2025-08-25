import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingBag, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import { BRAND_COLORS } from '../constants/colors';

export default function Footer() {
    return (
        <footer className="pt-5 pb-3" style={{ backgroundColor: BRAND_COLORS.light }}>
            <div className="container">
                {/* Descripción centrada */}
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <div className="mb-3">
                            <img 
                                src="/logo-elaia.png" 
                                alt="ELAIA"
                                height="40"
                                className="mb-3"
                            />
                        </div>
                        <p className="lead mb-3" style={{ color: BRAND_COLORS.dark, maxWidth: '800px', margin: '0 auto' }}>
                            Creamos piezas únicas y elegantes que combinan tradición con diseño atemporal. 
                            Descubre la elegancia en cada detalle.
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                            <a href="https://instagram.com/elaia" 
                               className="hover-primary" 
                               style={{ color: BRAND_COLORS.dark }}
                               target="_blank" 
                               rel="noopener noreferrer"
                               title="Instagram">
                                <FaInstagram size={24} />
                            </a>
                            <a href="https://facebook.com/elaia" 
                               className="hover-primary" 
                               style={{ color: BRAND_COLORS.dark }}
                               target="_blank" 
                               rel="noopener noreferrer"
                               title="Facebook">
                                <FaFacebook size={24} />
                            </a>
                            <a href="https://twitter.com/elaia" 
                               className="hover-primary" 
                               style={{ color: BRAND_COLORS.dark }}
                               target="_blank" 
                               rel="noopener noreferrer"
                               title="Twitter">
                                <FaTwitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Productos, Contacto e Información */}
                <div className="row">
                    {/* Productos - Izquierda */}
                    <div className="col-md-4 text-center mb-4">
                        <h6 className="text-uppercase fw-bold mb-3" style={{ color: BRAND_COLORS.primary }}>
                            Productos
                        </h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/batas" className="text-decoration-none hover-primary" style={{ color: BRAND_COLORS.dark }}>
                                    <FaShoppingBag className="me-2" size={14} />
                                    Batas
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/cosmetiqueros" className="text-decoration-none hover-primary" style={{ color: BRAND_COLORS.dark }}>
                                    <FaShoppingBag className="me-2" size={14} />
                                    Cosmetiqueros
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto - Centro */}
                    <div className="col-md-4 text-center mb-4">
                        <h6 className="text-uppercase fw-bold mb-3" style={{ color: BRAND_COLORS.primary }}>
                            Contacto
                        </h6>
                        <ul className="list-unstyled">
                            <li className="mb-2" style={{ color: BRAND_COLORS.dark }}>
                                <FaEnvelope className="me-2" size={14} />
                                contacto@elaia.cl
                            </li>
                            <li className="mb-2" style={{ color: BRAND_COLORS.dark }}>
                                <FaPhone className="me-2" size={14} />
                                +56 9 8765 4321
                            </li>
                            <li className="mb-2" style={{ color: BRAND_COLORS.dark }}>
                                <FaMapMarkerAlt className="me-2" size={14} />
                                Santiago, Chile
                            </li>
                        </ul>
                    </div>

                    {/* Información - Derecha */}
                    <div className="col-md-4 text-center mb-4">
                        <h6 className="text-uppercase fw-bold mb-3" style={{ color: BRAND_COLORS.primary }}>
                            Información
                        </h6>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/sobre-elaia" className="text-decoration-none hover-primary" style={{ color: BRAND_COLORS.dark }}>
                                    <FaInfoCircle className="me-2" size={14} />
                                    Sobre Elaia
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/terminos-condiciones" className="text-decoration-none hover-primary" style={{ color: BRAND_COLORS.dark }}>
                                    <FaFileAlt className="me-2" size={14} />
                                    Términos y Condiciones
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/politicas-cambio" className="text-decoration-none hover-primary" style={{ color: BRAND_COLORS.dark }}>
                                    <FaFileAlt className="me-2" size={14} />
                                    Políticas de Cambio
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: BRAND_COLORS.secondary }} />
                
                {/* Copyright */}
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="mb-0 small" style={{ color: BRAND_COLORS.dark }}>
                            © 2025 Elaia. Todos los derechos reservados.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <p className="mb-0 small" style={{ color: BRAND_COLORS.dark }}>
                            Desarrollado con 🤍 por Úrsula Vallejos
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-primary:hover {
                    color: ${BRAND_COLORS.primary} !important;
                    transition: color 0.3s ease;
                }
            `}</style>
        </footer>
    );
} 