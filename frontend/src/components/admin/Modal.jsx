/**
 * Componente Modal Reutilizable - ELAIA E-commerce Admin
 * 
 * Modal genérico para mostrar formularios, confirmaciones y contenido dinámico.
 * Incluye overlay, animaciones suaves y manejo de teclado.
 * 
 * Características:
 * - Overlay con cierre al hacer clic fuera
 * - Animaciones de entrada y salida
 * - Soporte para diferentes tamaños
 * - Manejo de tecla Escape
 * - Header, body y footer configurables
 * - Diseño responsivo
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen = false,
  onClose = () => {},
  title = '',
  children,
  footer,
  size = 'medium', // small, medium, large, full
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
}) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Manejar clic en overlay
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === overlayRef.current) {
      onClose();
    }
  };

  // Focus trap - mantener el foco dentro del modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = 
    size === 'small' ? 'modal-sm' :
    size === 'large' ? 'modal-lg' :
    size === 'full' ? 'modal-xl' :
    '';

  const modalContent = (
    <div
      ref={overlayRef}
      className={`modal fade ${isOpen ? 'show' : ''} ${className}`}
      style={{display: isOpen ? 'block' : 'none', zIndex: 2050}}
      onClick={handleOverlayClick}
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={`modal-dialog ${sizeClass}`} role="document">
        <div
          ref={modalRef}
          className="modal-content"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && (
                <h5 id="modal-title" className="modal-title">
                  {title}
                </h5>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                ></button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="modal-body">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Renderizar en portal para evitar problemas de z-index
  return createPortal(modalContent, document.body);
};

/**
 * Componente ConfirmModal para confirmaciones rápidas
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // danger, warning, info, success
  loading = false,
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  const footer = (
    <div className="d-flex justify-content-end gap-2">
      <button
        className="btn btn-secondary"
        onClick={onClose}
        disabled={loading}
        type="button"
      >
        {cancelText}
      </button>
      <button
        className={`btn btn-${variant}`}
        onClick={handleConfirm}
        disabled={loading}
        type="button"
      >
        {loading ? (
          <span className="d-flex align-items-center">
            <span className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </span>
            Procesando...
          </span>
        ) : (
          confirmText
        )}
      </button>
    </div>
  );

  const iconColorClass = 
    variant === 'danger' ? 'text-danger' :
    variant === 'warning' ? 'text-warning' :
    variant === 'info' ? 'text-info' :
    variant === 'success' ? 'text-success' :
    'text-primary';

  const backgroundClass = 
    variant === 'danger' ? 'bg-danger bg-opacity-10' :
    variant === 'warning' ? 'bg-warning bg-opacity-10' :
    variant === 'info' ? 'bg-info bg-opacity-10' :
    variant === 'success' ? 'bg-success bg-opacity-10' :
    'bg-primary bg-opacity-10';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      footer={footer}
    >
      <div className="text-center">
        <div className={`d-inline-flex align-items-center justify-content-center rounded-circle ${backgroundClass} ${iconColorClass}`} 
             style={{width: '80px', height: '80px', fontSize: '2rem'}}>
          {variant === 'danger' && '⚠️'}
          {variant === 'warning' && '⚡'}
          {variant === 'info' && 'ℹ️'}
          {variant === 'success' && '✅'}
        </div>
        <p className="mt-3 mb-0">{message}</p>
      </div>
    </Modal>
  );
};

/**
 * Componente FormModal para formularios
 */
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  size = 'medium',
}) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (onSubmit) {
      await onSubmit(event);
    }
  };

  const footer = (
    <div className="d-flex justify-content-end gap-2">
      <button
        className="btn btn-secondary"
        onClick={onClose}
        disabled={loading}
        type="button"
      >
        {cancelText}
      </button>
      <button
        className="btn btn-primary"
        type="submit"
        form="modal-form"
        disabled={loading}
      >
        {loading ? (
          <span className="d-flex align-items-center">
            <span className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Cargando...</span>
            </span>
            Guardando...
          </span>
        ) : (
          submitText
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={footer}
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export default Modal;
