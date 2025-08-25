import React from 'react';
import { BRAND_COLORS } from '../constants/colors';

export default function FeatureCard({ icon: Icon, title, description, className = '' }) {
    return (
        <div className={`col-lg-3 col-md-6 text-center mb-4 ${className}`}>
            <div className="feature-icon mb-3">
                <Icon size={48} style={{ color: BRAND_COLORS.primary }} />
            </div>
            <h5 style={{ color: BRAND_COLORS.dark }}>{title}</h5>
            <p className="text-muted">{description}</p>
        </div>
    );
} 