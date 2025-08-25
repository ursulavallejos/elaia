import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { BRAND_COLORS } from '../constants/colors';

export default function BackButton({ to = "/", text = "Volver al inicio", className = "" }) {
    return (
        <Link 
            to={to} 
            className={`btn btn-outline-secondary me-3 ${className}`}
            style={{ 
                borderColor: BRAND_COLORS.secondary,
                color: BRAND_COLORS.secondary
            }}
        >
            <FaArrowLeft className="me-2" />
            {text}
        </Link>
    );
} 