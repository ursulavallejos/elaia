import React from 'react';

export default function HeroSection({ 
    className = ''
}) {
    return (
        <section 
            className={`hero-section ${className}`}
            style={{ 
                backgroundImage: `url('/hero2.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                backgroundRepeat: 'no-repeat',
                height: '60vh',
                minHeight: '500px' // Altura mínima para pantallas muy pequeñas
            }}
        >
        </section>
    );
} 