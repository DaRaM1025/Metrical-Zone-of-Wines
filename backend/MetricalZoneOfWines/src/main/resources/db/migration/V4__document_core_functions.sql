-- ============================================================
-- Metrical Zone of Wines — Core Functions (Documented)
-- Engine: MySQL 8.0
-- File: V4__document_core_functions.sql
-- ============================================================

DELIMITER $$

-- ------------------------------------------------------------
-- 1. Función: fn_get_price_range
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Categoriza un precio exacto en un segmento de mercado estándar.
-- Justificación de Negocio: Permite a los analistas de marketing agrupar ventas y
-- hacer reportes demográficos sin tener que hacer queries complejos con múltiples IFs.
-- Justificación Técnica: Centralizar esta regla de negocio en la BD evita tener código
-- "quemado" (hardcoded) en el backend (Java) o frontend. Si mañana la inflación obliga
-- a subir el rango "Budget" a $25, se cambia aquí y todas las plataformas se actualizan solas.
-- Es DETERMINISTIC porque un precio X siempre caerá en el mismo rango.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_get_price_range$$
CREATE FUNCTION fn_get_price_range(p_price DECIMAL(8,2))
    RETURNS VARCHAR(20)
    DETERMINISTIC
BEGIN
    IF p_price IS NULL THEN
        RETURN NULL;
    ELSEIF p_price < 20.00 THEN
        RETURN 'Budget';
    ELSEIF p_price < 50.00 THEN
        RETURN 'Mid';
    ELSEIF p_price < 150.00 THEN
        RETURN 'Premium';
ELSE
        RETURN 'Luxury';
END IF;
END$$

-- ------------------------------------------------------------
-- 2. Función: fn_determine_prestige_index
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Traduce el puntaje (escala 100 puntos, estándar de la industria
-- tipo Robert Parker) a un índice cualitativo de prestigio.
-- Justificación de Negocio: Facilita la lectura para usuarios no expertos. Un consumidor
-- promedio entiende más rápido "Legendary" que "95.5 puntos".
-- Justificación Técnica: Al ser una función modular, se puede invocar desde vistas (Views)
-- o triggers para alimentar tablas de métricas (Data Warehouse) en tiempo real, garantizando
-- integridad en la clasificación.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_determine_prestige_index$$
CREATE FUNCTION fn_determine_prestige_index(p_avg_score DECIMAL(5,2))
    RETURNS VARCHAR(20)
    DETERMINISTIC
BEGIN
    IF p_avg_score IS NULL THEN
        RETURN 'Emerging';
    ELSEIF p_avg_score >= 95.00 THEN
        RETURN 'Legendary';
    ELSEIF p_avg_score >= 90.00 THEN
        RETURN 'Acclaimed';
    ELSEIF p_avg_score >= 85.00 THEN
        RETURN 'Recognized';
ELSE
        RETURN 'Emerging';
END IF;
END$$

-- ------------------------------------------------------------
-- 3. Función: fn_calculate_vintage_age
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Calcula los años de añejamiento/existencia de la cosecha.
-- Justificación Técnica: OJO -> Se corrigió quitando el 'DETERMINISTIC' porque depende
-- de la función volátil CURDATE(). Guardar la "edad" estática en una tabla es un
-- anti-patrón de diseño de BD porque tocaría actualizar la tabla cada año. Al calcularlo
-- "al vuelo" con esta función, el dato siempre es exacto en el momento de la consulta.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_calculate_vintage_age$$
CREATE FUNCTION fn_calculate_vintage_age(p_vintage_year INT)
    RETURNS INT
-- NOT DETERMINISTIC implícito por uso de CURDATE()
BEGIN
    DECLARE v_current_year INT;

    IF p_vintage_year IS NULL THEN
        RETURN 0;
END IF;

    SET v_current_year = YEAR(CURDATE());

    -- Manejo de errores: previene edades negativas si ingresan años futuros
    IF p_vintage_year > v_current_year THEN
        RETURN 0;
END IF;

RETURN v_current_year - p_vintage_year;
END$$

-- ------------------------------------------------------------
-- 4. Función: fn_get_dominant_grape_for_wine
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Identifica la uva principal en un blend (mezcla) de vino.
-- Justificación de Negocio: Cumplimiento legal. En muchas regiones, para que un vino
-- se llame "Malbec", esa uva debe ser la dominante (ej. más del 85%). Esta función
-- extrae esa métrica clave automáticamente para auditorías o etiquetas.
-- Justificación Técnica: Se usa 'READS SQL DATA' porque hace un query a otra tabla.
-- Abstrae un JOIN complejo con agrupaciones, permitiendo a los desarrolladores backend
-- obtener este dato vital con un simple llamado escalar.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_get_dominant_grape_for_wine$$
CREATE FUNCTION fn_get_dominant_grape_for_wine(p_wine_id INT)
    RETURNS INT
    READS SQL DATA
BEGIN
    DECLARE v_dominant_grape_id INT;

SELECT grape_id INTO v_dominant_grape_id
FROM wine_grapes
WHERE wine_id = p_wine_id
ORDER BY percentage DESC
    LIMIT 1;

RETURN v_dominant_grape_id;
END$$

-- ------------------------------------------------------------
-- 5. Función: fn_calculate_estimated_revenue
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Proyecta los ingresos brutos totales de un lote de vino.
-- Justificación de Negocio: KPI financiero fundamental para el dashboard de la gerencia.
-- Permite evaluar rápidamente el peso económico de una cosecha específica.
-- Justificación Técnica: Realiza cálculos matemáticos directamente en el motor de BD.
-- Es muchísimo más eficiente que traer miles de registros a la RAM de Spring Boot
-- para multiplicarlos allá. Reducimos latencia y uso de memoria en el servidor web.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_calculate_estimated_revenue$$
CREATE FUNCTION fn_calculate_estimated_revenue(p_wine_id INT)
    RETURNS DECIMAL(15,2)
    READS SQL DATA
BEGIN
    DECLARE v_bottles INT;
    DECLARE v_price DECIMAL(8,2);
    DECLARE v_revenue DECIMAL(15,2);

SELECT production_bottles, avg_price_usd
INTO v_bottles, v_price
FROM wines
WHERE id = p_wine_id;

IF v_bottles IS NULL OR v_price IS NULL THEN
        RETURN 0.00;
END IF;

    SET v_revenue = v_bottles * v_price;
RETURN v_revenue;
END$$

-- ------------------------------------------------------------
-- 6. Función: fn_get_vineyard_age
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Retorna los años de tradición de un viñedo.
-- Justificación de Negocio: En la industria vinícola, la antigüedad aporta prestigio.
-- Útil para filtros de búsqueda (ej. "Mostrar viñedos con más de 100 años").
-- Justificación Técnica: Al igual que con el vino, no se guarda la edad en la tabla
-- para evitar inconsistencias con el paso del tiempo. Se calcula dinámicamente.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_get_vineyard_age$$
CREATE FUNCTION fn_get_vineyard_age(p_founded_year INT)
    RETURNS INT
-- NOT DETERMINISTIC implícito por uso de CURDATE()
BEGIN
    DECLARE v_current_year INT;

    IF p_founded_year IS NULL THEN
        RETURN 0;
END IF;

    SET v_current_year = YEAR(CURDATE());
RETURN v_current_year - p_founded_year;
END$$

-- ------------------------------------------------------------
-- 7. Función: fn_format_wine_label
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Estandariza cómo se debe leer el nombre comercial de un vino.
-- Justificación de Negocio: Asegura consistencia de marca. Da igual si el cliente entra
-- desde iOS, Android o la Web, el nombre del vino siempre se presentará con el mismo formato.
-- Justificación Técnica: Delega la responsabilidad de presentación a la BD (Data Layer).
-- Maneja nulos (NV = Non-Vintage) de forma segura en C. Concatena campos sin obligar
-- al DTO en Java a procesar la lógica de negocio visual.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_format_wine_label$$
CREATE FUNCTION fn_format_wine_label(p_name VARCHAR(150), p_vintage INT, p_alcohol DECIMAL(4,2))
    RETURNS VARCHAR(255)
    DETERMINISTIC
BEGIN
    DECLARE v_vintage_str VARCHAR(10);
    DECLARE v_alcohol_str VARCHAR(10);

    SET v_vintage_str = IFNULL(CAST(p_vintage AS CHAR), 'NV');
    SET v_alcohol_str = IFNULL(CAST(p_alcohol AS CHAR), 'N/A');

RETURN CONCAT(p_name, ' (', v_vintage_str, ') - ', v_alcohol_str, '% Vol.');
END$$

-- ------------------------------------------------------------
-- 8. Función: fn_get_total_bottles_by_vineyard
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Suma la producción histórica total de un viñedo específico.
-- Justificación de Negocio: Permite clasificar a los viñedos por tamaño de operación
-- (productor boutique vs. productor masivo industrial).
-- Justificación Técnica: Encapsula una función de agregación (SUM). Ideal para usarse
-- en la generación de la tabla 'vineyard_metrics' sin tener que escribir la subconsulta
-- repetitivamente en los procedimientos almacenados de ETL.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_get_total_bottles_by_vineyard$$
CREATE FUNCTION fn_get_total_bottles_by_vineyard(p_vineyard_id INT)
    RETURNS INT
    READS SQL DATA
BEGIN
    DECLARE v_total_bottles INT;

SELECT SUM(production_bottles) INTO v_total_bottles
FROM wines
WHERE vineyard_id = p_vineyard_id;

RETURN IFNULL(v_total_bottles, 0);
END$$

-- ------------------------------------------------------------
-- 9. Función: fn_convert_hectares_to_acres
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Convierte el área del viñedo a acres.
-- Justificación de Negocio: Expansión de mercado. Si la plataforma se abre al público
-- norteamericano o británico, el sistema ya expone las métricas en su sistema imperial.
-- Justificación Técnica: DETERMINISTIC. Aisla la constante de conversión (2.47105).
-- Si se requiere un redondeo diferente en el futuro, se cambia en un solo punto y
-- no afecta el diseño de la tabla base que debe mantener el sistema métrico internacional.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_convert_hectares_to_acres$$
CREATE FUNCTION fn_convert_hectares_to_acres(p_hectares DECIMAL(8,2))
    RETURNS DECIMAL(10,2)
    DETERMINISTIC
BEGIN
    IF p_hectares IS NULL THEN
        RETURN 0.00;
END IF;

RETURN ROUND(p_hectares * 2.47105, 2);
END$$

-- ------------------------------------------------------------
-- 10. Función: fn_check_needs_decanting
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Indica si un vino específico requiere decantación antes de servirse.
-- Justificación de Negocio: Añade valor a la experiencia de usuario (UX) en el frontend.
-- Puede usarse para mostrar un icono de recomendación ("Decantar") en el perfil del vino.
-- Justificación Técnica: Implementa un motor de reglas muy básico (Rule Engine) a nivel
-- de SQL. Devuelve un TINYINT(1) que JPA/Hibernate mapeará directamente a un Booleano
-- en el DTO de respuesta.
-- ------------------------------------------------------------
DROP FUNCTION IF EXISTS fn_check_needs_decanting$$
CREATE FUNCTION fn_check_needs_decanting(p_wine_type VARCHAR(20), p_aging_months INT)
    RETURNS TINYINT(1)
                   DETERMINISTIC
BEGIN
    IF p_wine_type = 'Red' AND p_aging_months >= 18 THEN
        RETURN 1;
END IF;

RETURN 0;
END$$

DELIMITER ;