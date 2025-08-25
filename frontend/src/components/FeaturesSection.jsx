import React from 'react';
import FeatureCard from './FeatureCard.jsx';
import { BRAND_COLORS } from '../constants/colors';

export default function FeaturesSection({ title, features, className = '' }) {
    return (
        <section className={`py-5 ${className}`}>
            <div className="container">
                <h2 className="text-center mb-5" style={{ color: BRAND_COLORS.dark }}>{title}</h2>
                <div className="row">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 