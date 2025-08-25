import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { BRAND_COLORS } from '../constants/colors';

export default function LegalPageLayout({ 
    icon: Icon, 
    title, 
    subtitle, 
    children
}) {
    return (
        <div>
            <Navbar />
            <div className="container mt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="text-center mb-4">
                        <h1 className="mb-2">
                            <Icon className="me-3" style={{ color: BRAND_COLORS.primary }} />
                            {title}
                        </h1>
                        {subtitle && <p className="text-muted">{subtitle}</p>}
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    );
} 