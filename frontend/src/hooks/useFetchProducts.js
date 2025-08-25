/**
 * Hook Personalizado para Obtener Datos de Productos desde API Backend
 * 
 * Este hook personalizado de React proporciona una forma reutilizable de obtener datos de productos
 * desde la API del backend de ELAIA. Maneja estados de carga, manejo de errores,
 * y re-fetching automático cuando el tipo de producto cambia.
 * 
 * Características:
 * - Llamada API automática al montar y cuando productType cambia
 * - Gestión de estado de carga para feedback de UI
 * - Manejo de errores con logging en consola
 * - Gestión limpia de estado usando hooks de React
 * - Reutilizable en diferentes categorías de productos
 * - Filtra productos por categoría desde la API backend real
 * 
 * @author Equipo de Desarrollo ELAIA
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { apiRequest } from '../config/api';

/**
 * Hook personalizado para obtener productos desde la API backend de ELAIA
 * 
 * Este hook obtiene datos de productos desde el backend de ELAIA filtrados por categoría.
 * Re-obtiene automáticamente los datos cuando el parámetro productType cambia,
 * haciéndolo perfecto para páginas de productos basadas en categorías.
 * 
 * Endpoint API: /api/productos (con filtro por categoría)
 * 
 * @param {string} productType - Tipo de productos a obtener (por defecto: 'batas')
 *                              Valores comunes: 'batas', 'cosmetiqueros'
 * @returns {Object} Objeto de retorno del hook
 * @returns {Array} returns.data - Array de objetos de productos desde la API backend
 * @returns {boolean} returns.loading - Estado de carga (true mientras obtiene, false cuando completa)
 * 
 * @example
 * // Uso básico para obtener batas (por defecto)
 * function BatasPage() {
 *     const { data, loading } = useFetchProducts();
 *     
 *     if (loading) return <div>Cargando...</div>;
 *     
 *     return (
 *         <div>
 *             {data.map(product => (
 *                 <ProductCard key={product.id} product={product} />
 *             ))}
 *         </div>
 *     );
 * }
 * 
 * @example
 * // Uso para tipo de producto específico
 * function CosmetiquerosPage() {
 *     const { data, loading } = useFetchProducts('cosmetiqueros');
 *     
 *     return (
 *         <div>
 *             {loading ? (
 *                 <div>Cargando cosmetiqueros...</div>
 *             ) : (
 *                 data.map(product => <ProductCard key={product.id} product={product} />)
 *             )}
 *         </div>
 *     );
 * }
 */
export default function useFetchProducts(productType = 'batas') {
    // Estado para almacenar los datos de productos obtenidos
    const [data, setData] = useState([]);
    
    // Estado para rastrear el status de carga para feedback de UI
    const [loading, setLoading] = useState(true);

    // Efecto para obtener datos cuando el componente se monta o productType cambia
    useEffect(() => {
        // Resetear estado de carga cuando se inicia una nueva obtención
        setLoading(true);
        
        // Hacer petición API al backend de ELAIA
        // Obtenemos todos los productos y luego filtramos por categoría
        apiRequest('/productos')
        .then(data => {
            // La API devuelve un objeto con productos, total y filtros
            // Extraer el array de productos de la respuesta
            const allProducts = data.productos || [];
            
            // Validar que tenemos un array
            if (!Array.isArray(allProducts)) {
                console.error('La respuesta de la API no contiene un array de productos:', data);
                setData([]);
                return;
            }
            
            // Mapear nombres de categorías (productType) a nombres de base de datos
            let filteredProducts = [];
            if (productType === 'batas') {
                filteredProducts = allProducts.filter(product => 
                    product.Categoria?.some(cat => cat.nombre.toLowerCase() === 'batas')
                );
            } else if (productType === 'cosmetiqueros') {
                filteredProducts = allProducts.filter(product => 
                    product.Categoria?.some(cat => cat.nombre.toLowerCase() === 'cosmetiqueros')
                );
            } else {
                // Si no es una categoría específica, devolver todos los productos
                filteredProducts = allProducts;
            }
            
            // Agregar productType a cada producto para identificación
            const productsWithType = filteredProducts.map(product => ({
                ...product,
                productType: productType,
                imagenUrl: product.imagen_url // Mapear campo de imagen
            }));
            
            // En respuesta exitosa, actualizar el estado de datos
            setData(productsWithType);
        })
        .catch(err => {
            // Loggear cualquier error en la consola para debugging
            // En producción, podrías querer establecer un estado de error en su lugar
            console.error('Error obteniendo productos:', err);
            
            // Establecer data como array vacío en error
            setData([]);
        })
        .finally(() => {
            // Siempre establecer loading a false cuando la petición se completa (éxito o error)
            setLoading(false);
        });
    }, [productType]); // Array de dependencias: re-ejecutar efecto cuando productType cambia

    // Retornar los datos y estado de carga para que los componentes los usen
    return { data, loading };
}
