import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { BRAND_COLORS } from '../constants/colors';
import Footer from '../components/Footer';

export default function Profile() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center">
                        <h3>Acceso Requerido</h3>
                        <p>Debes iniciar sesión para ver tu perfil.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container mt-5 mb-5" style={{ minHeight: '60vh' }}>
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <div 
                                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            backgroundColor: BRAND_COLORS.primary,
                                            color: 'white'
                                        }}
                                    >
                                        <FaUser size={32} />
                                    </div>
                                    <h2 className="fw-bold mb-2" style={{ color: BRAND_COLORS.primary }}>
                                        Mi Perfil
                                    </h2>
                                    <p className="text-muted">Información de tu cuenta</p>
                                </div>

                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="card bg-light border-0">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <FaEnvelope className="text-muted me-3" />
                                                    <div>
                                                        <small className="text-muted d-block">Email</small>
                                                        <span className="fw-semibold">{user?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="card bg-light border-0">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <FaUserTag className="text-muted me-3" />
                                                    <div>
                                                        <small className="text-muted d-block">Rol</small>
                                                        <span className="fw-semibold">{user?.rol || 'Usuario'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="card bg-light border-0">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center">
                                                    <FaUser className="text-muted me-3" />
                                                    <div>
                                                        <small className="text-muted d-block">ID de Usuario</small>
                                                        <span className="fw-semibold">{user?.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <p className="text-muted mb-0">
                                        <small>Miembro desde que te registraste en ELAIA</small>
                                    </p>
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
    