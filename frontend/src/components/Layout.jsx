/**
 * Layout Principal - ELAIA E-commerce
 * 
 * Componente que proporciona la estructura base para todas las páginas públicas.
 * Incluye el navbar principal y el contenido de la página.
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
