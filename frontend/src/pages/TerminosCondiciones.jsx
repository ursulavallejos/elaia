import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract } from 'react-icons/fa';
import { BRAND_COLORS } from '../constants/colors';
import LegalPageLayout from '../components/LegalPageLayout.jsx';

export default function TerminosCondiciones() {
    return (
        <LegalPageLayout
            icon={FaFileContract}
            title="Términos y Condiciones"
            subtitle="Última actualización: Enero 2025"
        >
            <h2 className="h4 mb-3" style={{ color: BRAND_COLORS.primary }}>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar el sitio web de Elaia, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>2. Descripción del Servicio</h2>
            <p>Elaia es una plataforma de comercio electrónico que ofrece batas y cosmetiqueros de alta calidad. Nuestros productos cuentan con diseños únicos y materiales premium cuidadosamente seleccionados.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>3. Cuenta de Usuario</h2>
            <p>Para realizar compras, debe crear una cuenta proporcionando información veraz y actualizada. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>4. Productos y Disponibilidad</h2>
            <p>Los productos mostrados en nuestro sitio web están sujetos a disponibilidad. Ofrecemos una cuidadosa selección de batas y cosmetiqueros de alta calidad con diseños únicos y exclusivos.</p>
            <p>Cada producto cuenta con especificaciones detalladas y fotografías que muestran fielmente las características del artículo.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>5. Precios y Pagos</h2>
            <p>Todos los precios están expresados en pesos chilenos e incluyen IVA. Nos reservamos el derecho de modificar los precios en cualquier momento. Los pagos se procesan de forma segura a través de nuestros proveedores autorizados.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>6. Envíos</h2>
            <p>Realizamos envíos a todo Chile continental. Los tiempos de entrega varían según la ubicación y el tipo de envío seleccionado. Los costos de envío se calculan automáticamente al finalizar su compra.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>7. Política de Cambios y Devoluciones</h2>
            <p>Consulte nuestra <Link to="/politicas-cambio" className="text-decoration-none" style={{ color: BRAND_COLORS.accent }}>Política de Cambios</Link> para obtener información detallada sobre devoluciones y cambios de productos.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>8. Propiedad Intelectual</h2>
            <p>Todos los contenidos del sitio web, incluyendo diseños, logos, textos e imágenes, son propiedad exclusiva de Elaia y están protegidos por las leyes de propiedad intelectual.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>9. Limitación de Responsabilidad</h2>
            <p>Elaia no será responsable por daños indirectos, incidentales o consecuentes que puedan resultar del uso de nuestros productos o servicios.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>10. Modificaciones</h2>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>11. Ley Aplicable</h2>
            <p>Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa será resuelta en los tribunales competentes de Santiago, Chile.</p>

            <h2 className="h4 mb-3 mt-4" style={{ color: BRAND_COLORS.primary }}>12. Contacto</h2>
            <p>Si tiene alguna pregunta sobre estos términos, puede contactarnos en:</p>
            <ul>
                <li><strong>Email:</strong> legal@elaia.cl</li>
                <li><strong>Teléfono:</strong> +56 2 2345 6789</li>
                <li><strong>Dirección:</strong> Av. Providencia 1234, Providencia, Santiago</li>
            </ul>

            <div className="alert alert-info mt-4" style={{ 
                backgroundColor: BRAND_COLORS.light, 
                borderColor: BRAND_COLORS.secondary,
                color: BRAND_COLORS.dark
            }}>
                <strong>Nota:</strong> Estos términos y condiciones están disponibles en español y son los únicos términos aplicables a su relación con Elaia.
            </div>
        </LegalPageLayout>
    );
} 