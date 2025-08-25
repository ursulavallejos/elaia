import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { BRAND_COLORS } from '../constants/colors';

export default function Register() {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const { register, loading, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = () => {
        const errors = {};

        if (!formData.nombre.trim()) {
            errors.nombre = 'El nombre es requerido';
        }

        if (!formData.apellido.trim()) {
            errors.apellido = 'El apellido es requerido';
        }

        if (!formData.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El email no es válido';
        }

        if (!formData.password) {
            errors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirma tu contraseña';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        if (error) clearError();
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        const result = await register({
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            password: formData.password
        });

        if (result.success) {
            navigate('/');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold mb-2" style={{ color: BRAND_COLORS.primary }}>
                                        Únete a ELAIA
                                    </h2>
                                    <p className="text-muted">Crea tu cuenta y descubre nuestros productos</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                        {error}
                                        <button 
                                            type="button" 
                                            className="btn-close" 
                                            onClick={clearError}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nombre" className="form-label fw-semibold">
                                                Nombre
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <FaUser className="text-muted" />
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control border-start-0 ps-0 ${validationErrors.nombre ? 'is-invalid' : ''}`}
                                                    id="nombre"
                                                    name="nombre"
                                                    value={formData.nombre}
                                                    onChange={handleChange}
                                                    placeholder="Tu nombre"
                                                    required
                                                />
                                            </div>
                                            {validationErrors.nombre && (
                                                <div className="invalid-feedback d-block">
                                                    {validationErrors.nombre}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="apellido" className="form-label fw-semibold">
                                                Apellido
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">
                                                    <FaUser className="text-muted" />
                                                </span>
                                                <input
                                                    type="text"
                                                    className={`form-control border-start-0 ps-0 ${validationErrors.apellido ? 'is-invalid' : ''}`}
                                                    id="apellido"
                                                    name="apellido"
                                                    value={formData.apellido}
                                                    onChange={handleChange}
                                                    placeholder="Tu apellido"
                                                    required
                                                />
                                            </div>
                                            {validationErrors.apellido && (
                                                <div className="invalid-feedback d-block">
                                                    {validationErrors.apellido}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-semibold">
                                            Email
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <FaEnvelope className="text-muted" />
                                            </span>
                                            <input
                                                type="email"
                                                className={`form-control border-start-0 ps-0 ${validationErrors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </div>
                                        {validationErrors.email && (
                                            <div className="invalid-feedback d-block">
                                                {validationErrors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-semibold">
                                            Contraseña
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <FaLock className="text-muted" />
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control border-start-0 border-end-0 ps-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Mínimo 6 caracteres"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary border-start-0"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {validationErrors.password && (
                                            <div className="invalid-feedback d-block">
                                                {validationErrors.password}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label fw-semibold">
                                            Confirmar Contraseña
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <FaLock className="text-muted" />
                                            </span>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`form-control border-start-0 border-end-0 ps-0 ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Repite tu contraseña"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary border-start-0"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {validationErrors.confirmPassword && (
                                            <div className="invalid-feedback d-block">
                                                {validationErrors.confirmPassword}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 text-white fw-semibold py-3 rounded-3"
                                        style={{ backgroundColor: BRAND_COLORS.primary }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creando cuenta...
                                            </>
                                        ) : (
                                            <>
                                                <FaUserPlus className="me-2" />
                                                Crear Cuenta
                                            </>
                                        )}
                                    </button>
                                </form>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <p className="mb-0 text-muted">
                                        ¿Ya tienes una cuenta?{' '}
                                        <Link 
                                            to="/login" 
                                            className="text-decoration-none fw-semibold"
                                            style={{ color: BRAND_COLORS.primary }}
                                        >
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
