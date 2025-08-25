import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaLeaf, FaStar } from 'react-icons/fa';
import { BRAND_COLORS, GRADIENTS } from '../constants/colors';
import Footer from '../components/Footer.jsx';

export default function SobreElaia() {
    return (
        <div>
            {/* Hero Section */}
            <section 
                className="text-white text-center py-5"
                style={{ 
                    background: GRADIENTS.primary,
                    minHeight: '40vh',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div className="container">
                    <h1 className="display-4 fw-bold mb-4">Sobre Elaia</h1>
                    <p className="lead mb-4">Descubre la filosofía detrás de nuestras creaciones</p>
                </div>
            </section>

            {/* Contenido Principal */}
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        <div className="card shadow-sm border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-5">
                                    <FaHeart 
                                        size={48} 
                                        className="mb-3"
                                        style={{ color: BRAND_COLORS.accent }}
                                    />
                                    <h2 style={{ color: BRAND_COLORS.dark }}>Nuestra Filosofía</h2>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <div className="text-center p-3">
                                            <FaLeaf 
                                                size={32} 
                                                className="mb-3"
                                                style={{ color: BRAND_COLORS.secondary }}
                                            />
                                            <h5 style={{ color: BRAND_COLORS.primary }}>Autenticidad</h5>
                                            <p className="text-muted">En Elaia creemos en la belleza de lo auténtico y lo duradero. No seguimos modas pasajeras, creamos estilos que trascienden el tiempo.</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="text-center p-3">
                                            <FaStar 
                                                size={32} 
                                                className="mb-3"
                                                style={{ color: BRAND_COLORS.secondary }}
                                            />
                                            <h5 style={{ color: BRAND_COLORS.primary }}>Elegancia Interior</h5>
                                            <p className="text-muted">Valoramos la claridad, la intención y la fuerza interior. Sabemos que la verdadera elegancia nace de la disciplina y el cuidado consciente.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center my-5">
                                    <div className="p-4" style={{ backgroundColor: BRAND_COLORS.light, borderRadius: '15px' }}>
                                        <h4 style={{ color: BRAND_COLORS.dark }}>Más que una marca</h4>
                                        <p className="mb-0" style={{ color: BRAND_COLORS.primary }}>
                                            Elaia es más que una marca: es un espacio para crecer, para diseñar vidas con propósito. 
                                            Un lugar donde la moda se une con la filosofía y el desarrollo personal.
                                        </p>
                                    </div>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <h5 style={{ color: BRAND_COLORS.primary }}>Nuestros Valores</h5>
                                        <ul className="list-unstyled">
                                            <li className="mb-2">
                                                <span style={{ color: BRAND_COLORS.secondary }}>✦</span> Estoicismo moderno
                                            </li>
                                            <li className="mb-2">
                                                <span style={{ color: BRAND_COLORS.secondary }}>✦</span> Femineidad real
                                            </li>
                                            <li className="mb-2">
                                                <span style={{ color: BRAND_COLORS.secondary }}>✦</span> Bienestar integral
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <h5 style={{ color: BRAND_COLORS.primary }}>Nuestra Misión</h5>
                                        <p className="text-muted">
                                            A través de nuestras creaciones y contenidos, inspiramos a quienes buscan equilibrio entre mente, cuerpo y entorno.
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center mt-5">
                                    <div className="p-4" style={{ 
                                        background: GRADIENTS.light, 
                                        borderRadius: '15px',
                                        border: `2px solid ${BRAND_COLORS.secondary}`
                                    }}>
                                        <h4 style={{ color: BRAND_COLORS.dark }}>Nuestra Visión</h4>
                                        <p className="mb-0" style={{ color: BRAND_COLORS.primary }}>
                                            Guiados por la visión, diseñamos para perdurar. 
                                            Elaia es para quienes construyen su camino con pasión, disciplina y estilo atemporal.
                                        </p>
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <Link 
                                        to="/" 
                                        className="btn btn-lg px-5"
                                        style={{ 
                                            backgroundColor: BRAND_COLORS.primary,
                                            color: BRAND_COLORS.light,
                                            border: 'none'
                                        }}
                                    >
                                        Descubre Nuestros Productos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}  