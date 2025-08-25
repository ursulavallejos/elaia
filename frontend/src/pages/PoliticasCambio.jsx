import React from 'react';
import { FaExchangeAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BRAND_COLORS } from '../constants/colors';
import LegalPageLayout from '../components/LegalPageLayout.jsx';

export default function PoliticasCambio() {
    return (
        <LegalPageLayout
            icon={FaExchangeAlt}
            title="Políticas de Cambio"
            subtitle="Última actualización: Enero 2025"
        >
            <div className="alert alert-info" style={{ 
                backgroundColor: BRAND_COLORS.light, 
                borderColor: BRAND_COLORS.secondary,
                color: BRAND_COLORS.dark
            }}>
                <h5 className="alert-heading">
                    <FaClock className="me-2" style={{ color: BRAND_COLORS.primary }} />
                    Plazos de Cambio
                </h5>
                <p className="mb-0">Dispones de <strong>30 días</strong> desde la recepción del producto para solicitar un cambio o devolución.</p>
            </div>

            <h2 className="h4 mb-3" style={{ color: BRAND_COLORS.primary }}>1. Condiciones para Cambios y Devoluciones</h2>
            <p>Para que un producto sea elegible para cambio o devolución, debe cumplir con las siguientes condiciones:</p>
            <ul>
                <li>El producto debe estar en su estado original</li>
                <li>No debe haber sido usado, lavado o alterado</li>
                <li>Debe conservar todas las etiquetas y empaques originales</li>
                <li>Debe estar dentro del plazo de 30 días</li>
            </ul>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>2. Productos Personalizados</h2>
            <div className="alert alert-warning" style={{ 
                backgroundColor: '#fff3cd', 
                borderColor: BRAND_COLORS.secondary,
                color: '#856404'
            }}>
                <h6 className="alert-heading">
                    <FaTimesCircle className="me-2" style={{ color: BRAND_COLORS.accent }} />
                    Importante
                </h6>
                <p className="mb-0">Los productos personalizados (con bordados o diseños específicos) <strong>NO son elegibles para devolución</strong> a menos que presenten defectos de fabricación.</p>
            </div>
            <p>Si recibiste un producto personalizado con defectos, contáctanos inmediatamente para evaluar el caso.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>3. Proceso de Cambio</h2>
            <p>Para solicitar un cambio, sigue estos pasos:</p>
            <ol>
                <li>Contacta a nuestro servicio al cliente dentro de los 30 días</li>
                <li>Proporciona el número de orden y motivo del cambio</li>
                <li>Envía fotos del producto si es necesario</li>
                <li>Recibe la autorización de cambio</li>
                <li>Envía el producto de vuelta en su empaque original</li>
                <li>Recibe el nuevo producto o reembolso</li>
            </ol>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>4. Proceso de Devolución</h2>
            <p>Si prefieres una devolución en lugar de un cambio:</p>
            <ul>
                <li>Se procesará un reembolso del valor del producto</li>
                <li>Los costos de envío no son reembolsables</li>
                <li>El reembolso se procesa en un plazo de 5-10 días hábiles</li>
                <li>Se realizará al mismo método de pago utilizado</li>
            </ul>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>5. Productos No Elegibles</h2>
            <p>Los siguientes productos <strong>NO pueden ser cambiados ni devueltos</strong>:</p>
            <ul>
                <li>Productos personalizados con bordados específicos</li>
                <li>Productos en oferta o liquidación</li>
                <li>Productos de higiene personal (por razones sanitarias)</li>
                <li>Productos que hayan sido alterados o dañados por el cliente</li>
            </ul>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>6. Defectos de Fabricación</h2>
            <div className="alert alert-success" style={{ 
                backgroundColor: '#d1edff', 
                borderColor: BRAND_COLORS.primary,
                color: BRAND_COLORS.dark
            }}>
                <h6 className="alert-heading">
                    <FaCheckCircle className="me-2" style={{ color: BRAND_COLORS.primary }} />
                    Garantía
                </h6>
                <p className="mb-0">Todos nuestros productos tienen <strong>garantía de 6 meses</strong> contra defectos de fabricación.</p>
            </div>
            <p>Si detectas un defecto de fabricación:</p>
            <ul>
                <li>Contacta a nuestro servicio al cliente inmediatamente</li>
                <li>Proporciona fotos detalladas del defecto</li>
                <li>Recibirás un producto de reemplazo o reembolso completo</li>
                <li>Los costos de envío corren por nuestra cuenta</li>
            </ul>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>7. Costos de Envío</h2>
            <p>Para cambios y devoluciones:</p>
            <ul>
                <li><strong>Defectos de fabricación:</strong> Sin costo para el cliente</li>
                <li><strong>Cambios por preferencia:</strong> El cliente paga el envío de vuelta</li>
                <li><strong>Devoluciones:</strong> El cliente paga el envío de vuelta</li>
            </ul>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>8. Tiempos de Procesamiento</h2>
            <p>Una vez recibido el producto:</p>
            <ul>
                <li><strong>Evaluación:</strong> 1-2 días hábiles</li>
                <li><strong>Procesamiento de cambio:</strong> 3-5 días hábiles</li>
                <li><strong>Envío del nuevo producto:</strong> 1-3 días hábiles</li>
                <li><strong>Reembolso:</strong> 5-10 días hábiles</li>
            </ul>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>9. Contacto para Cambios y Devoluciones</h2>
            <p>Para solicitar un cambio o devolución, contáctanos en:</p>
            <ul>
                <li><strong>Email:</strong> cambios@elaia.cl</li>
                <li><strong>WhatsApp:</strong> +56 9 8765 4321</li>
                <li><strong>Teléfono:</strong> +56 2 2345 6789</li>
                <li><strong>Horario:</strong> Lunes a Viernes 9:00 - 18:00</li>
            </ul>

            <div className="alert alert-primary mt-4" style={{ 
                backgroundColor: BRAND_COLORS.light, 
                borderColor: BRAND_COLORS.primary,
                color: BRAND_COLORS.dark
            }}>
                <h6 className="alert-heading">¿Necesitas ayuda?</h6>
                <p className="mb-0">Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier consulta sobre cambios o devoluciones.</p>
            </div>
        </LegalPageLayout>
    );
} 