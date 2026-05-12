-- ============================================================
-- Metrical Zone of Wines — Core Stored Procedures
-- Engine: MySQL 8.0
-- File: V5__create_core_stored_procedures.sql
-- ============================================================

/*
   NOTA ARQUITECTÓNICA DE SEGURIDAD Y DISEÑO:
   Estos procedimientos almacenados NO están destinados a ser expuestos como endpoints en el API de Spring Boot.

   Justificación:
   1. Seguridad (DoS): Operaciones pesadas de cálculo masivo no deben ser disparadas por usuarios finales
      para evitar ataques de denegación de servicio por agotamiento de CPU/RAM.
   2. Integridad Administrativa: Estos procesos representan tareas de mantenimiento de datos (ETL interna).
      Deben ser ejecutados manualmente por un administrador de BD o programados mediante eventos (Cron Jobs).
   3. Separación de Responsabilidades: El API debe ser liviano (REST). La lógica de procesamiento masivo
      se queda en el motor de datos donde es más eficiente.
*/

DELIMITER $$

-- ------------------------------------------------------------
-- 1. Procedimiento: sp_generate_region_report_metrics
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Recorre todas las regiones y genera una foto
-- (snapshot) de sus métricas actuales en la tabla region_metrics.
--
-- CONCEPTOS CLAVE PARA ARQUITECTURA:
--
-- 1. ¿Por qué usamos un CURSOR EXPLÍCITO y NO uno Implícito?
--    - El Cursor Implícito (un simple 'INSERT INTO ... SELECT ...') es excelente
--      para mover datos masivos rápidamente en bloque (operaciones basadas en conjuntos o Set-Based).
--    - SIN EMBARGO, no se usó aquí porque requerimos ejecutar lógica imperativa
--      multi-paso por cada región: contar viñedos, luego hacer JOINs complejos
--      para promedios de vinos, y finalmente pasar esos datos por funciones
--      nativas (fn_get_price_range). Hacer todo esto en un solo query implícito
--      resultaría en un "Frankenstein" de SQL (sub-queries anidados ilegibles),
--      imposible de debugear y mantener. El cursor explícito nos da control
--      fila por fila (Row-By-Agonizing-Row) para procesar reglas de negocio estructuradas.
--
-- 2. ¿Para qué sirve el CONTINUE HANDLER FOR NOT FOUND?
--    - En MySQL, cuando un cursor hace un FETCH y ya no hay más filas que leer,
--      el motor lanza una excepción interna (SQLSTATE '02000' - No Data).
--      Si no atrapamos esto, el procedimiento almacenado hace "crash" y se detiene abruptamente.
--    - El HANDLER actúa como un bloque 'try-catch' específico. Le dice a MySQL:
--      "Cuando intentes leer y no encuentres más datos, no estalles; simplemente
--      cambia la variable v_done a TRUE y continúa". Así, nuestro LOOP evalúa esa
--      variable y sale del ciclo limpiamente (LEAVE read_loop).
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_generate_region_report_metrics$$

CREATE PROCEDURE sp_generate_region_report_metrics()
BEGIN
    -- Declaración de variables para el cursor
    DECLARE v_region_id INT;
    DECLARE v_done INT DEFAULT FALSE;

    -- Variables para cálculos
    DECLARE v_total_vineyards INT;
    DECLARE v_total_wines INT;
    DECLARE v_avg_score DECIMAL(5,2);
    DECLARE v_avg_price DECIMAL(8,2);

    -- 1. DECLARACIÓN DEL CURSOR EXPLÍCITO
    DECLARE cur_regions CURSOR FOR
SELECT id FROM regions;

-- 2. HANDLER para saber cuándo terminar el recorrido
DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;

    -- 3. APERTURA DEL CURSOR
OPEN cur_regions;

read_loop: LOOP
        -- 4. CAPTURA DE DATOS (FETCH)
        FETCH cur_regions INTO v_region_id;

        IF v_done THEN
            LEAVE read_loop;
END IF;

        -- Lógica de negocio: Cálculo de métricas por región
        -- Contamos viñedos asociados
SELECT COUNT(*) INTO v_total_vineyards
FROM vineyards
WHERE region_id = v_region_id;

-- Calculamos promedios de los vinos en esa región
SELECT
    COUNT(w.id),
    AVG(w.avg_price_usd),
    AVG(wm.avg_score)
INTO v_total_wines, v_avg_price, v_avg_score
FROM wines w
         JOIN vineyards v ON w.vineyard_id = v.id
         LEFT JOIN wine_metrics wm ON w.id = wm.wine_id
WHERE v.region_id = v_region_id;

-- 5. INSERCIÓN DE RESULTADOS
-- Usamos las funciones de la V4 para determinar el rango de precio y el prestigio
INSERT INTO region_metrics (
    region_id,
    total_vineyards,
    total_wines,
    avg_score,
    avg_price_usd,
    price_range,
    prestige_index,
    computed_at
) VALUES (
             v_region_id,
             v_total_vineyards,
             v_total_wines,
             v_avg_score,
             v_avg_price,
             fn_get_price_range(v_avg_price),
             fn_determine_prestige_index(v_avg_score),
             NOW()
         );

END LOOP;

    -- 6. CIERRE DEL CURSOR
CLOSE cur_regions;

SELECT 'Métricas de regiones generadas exitosamente' AS Message;
END$$

-- ------------------------------------------------------------
-- 2. Procedimiento: sp_adjust_regional_pricing
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Ajusta los precios de todos los vinos de una
-- región específica por un porcentaje (inflación, cambio de temporada).
-- Justificación de Negocio: Permite actualizaciones masivas de precios
-- con una sola instrucción, garantizando que el cambio sea ATÓMICO
-- (o se cambian todos o ninguno).
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_adjust_regional_pricing$$

CREATE PROCEDURE sp_adjust_regional_pricing(
    IN p_region_id INT,
    IN p_percentage_increase DECIMAL(5,2)
)
BEGIN
    -- Validamos que la región exista
    IF NOT EXISTS (SELECT 1 FROM regions WHERE id = p_region_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La región especificada no existe.';
END IF;

    -- Actualización masiva de precios
UPDATE wines w
    JOIN vineyards v ON w.vineyard_id = v.id
    SET w.avg_price_usd = w.avg_price_usd * (1 + (p_percentage_increase / 100))
WHERE v.region_id = p_region_id;

SELECT CONCAT('Precios actualizados para la región ', p_region_id) AS Result;
END$$


-- ------------------------------------------------------------
-- 3. Procedimiento: sp_revalue_old_vintages
-- ------------------------------------------------------------
-- ¿Para qué sirve?: Revalúa el precio de los vinos antiguos. Si una
-- cosecha tiene más de X años, aumenta su precio en un porcentaje
-- y recalcula automáticamente su categoría de mercado (price_range).
-- Justificación de Negocio: Simula el mercado secundario y la revalorización
-- de productos en bodega por añejamiento.
-- Justificación Técnica: Demuestra el re-uso de componentes. El SP no
-- calcula la categoría a mano, sino que invoca la función escalar
-- 'fn_get_price_range' que creamos en la V4, manteniendo el principio DRY (Don't Repeat Yourself).
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_revalue_old_vintages$$

CREATE PROCEDURE sp_revalue_old_vintages(
    IN p_years_old INT,
    IN p_appreciation_pct DECIMAL(5,2)
)
BEGIN
    DECLARE v_current_year INT;
    SET v_current_year = YEAR(CURDATE());

    -- Actualización masiva con lógica condicional y re-uso de funciones
UPDATE wines
SET
    avg_price_usd = avg_price_usd * (1 + (p_appreciation_pct / 100)),
    -- Recalculamos la etiqueta de rango de precio dinámicamente con el nuevo valor
    price_range = fn_get_price_range(avg_price_usd * (1 + (p_appreciation_pct / 100)))
WHERE
    vintage_year IS NOT NULL
  AND (v_current_year - vintage_year) >= p_years_old;

SELECT CONCAT('Revalorización completada para vinos con más de ', p_years_old, ' años.') AS Result;
END$$


DELIMITER ;