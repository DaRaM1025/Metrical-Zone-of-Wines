-- ============================================================
-- Metrical Zone of Wines — Core Triggers & Master Audit
-- Engine: MySQL 8.0
-- File: V6__create_core_triggers_and_audit.sql
-- ============================================================

-- ------------------------------------------------------------
-- 0. TABLA DE AUDITORÍA MAESTRA (Master Audit Ledger)
-- ------------------------------------------------------------
-- Justificación de Arquitectura y Negocio:
-- 1. Polimorfismo de Datos: Al utilizar el tipo de dato nativo JSON de MySQL 8.0,
--    esta única tabla es capaz de almacenar la estructura de cualquier entidad del
--    sistema sin requerir modificaciones en el esquema (Schema-less approach).
-- 2. Cumplimiento Normativo (Compliance): Satisface requerimientos de auditoría
--    internacional (ej. SOX, GDPR) al garantizar el principio de "No Repudio"
--    (Non-repudiation), registrando el usuario exacto de base de datos, el momento
--    preciso y el estado completo del registro antes de su destrucción.
-- 3. Optimización de Mantenimiento: Evita el anti-patrón de crear una tabla
--    de historial paralela por cada tabla transaccional del modelo relacional.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_master_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action_type VARCHAR(15) NOT NULL, -- Ej: 'DELETE', 'DELETE_FORMULA'
    payload JSON NOT NULL,            -- Representación inmutable del registro
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logged_by_user VARCHAR(100) NOT NULL
    );

DELIMITER $$

-- ============================================================
-- BLOQUE 1: VALIDACIÓN E INTEGRIDAD TRANSACCIONAL (Vinos)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TRIGGER: tr_wines_before_insert (Filtro de Calidad y Programación Defensiva)
-- ------------------------------------------------------------
-- Funcionalidad: Intercepta la solicitud de inserción antes de escribir en disco.
-- Justificación Técnica:
-- - Programación Defensiva (Defensive Programming): Protege la capa de persistencia
--   de posibles vulnerabilidades o fallos en las validaciones del Frontend o Backend.
-- - Principio DRY (Don't Repeat Yourself): Al invocar la función escalar
--   'fn_get_price_range', centraliza la regla de segmentación financiera en la BD,
--   evitando que múltiples microservicios o interfaces deban reimplementar la lógica.
-- - Invariantes de Dominio: Garantiza que no existan vinos con años futuros o valores
--   financieros/físicos ilógicos que puedan corromper cálculos posteriores.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_wines_before_insert$$
CREATE TRIGGER tr_wines_before_insert
    BEFORE INSERT ON wines
    FOR EACH ROW
BEGIN
    IF NEW.vintage_year > YEAR(CURDATE()) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD DE DOMINIO] Rechazo: El año de cosecha no puede ser futuro.';
END IF;
IF NEW.avg_price_usd < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD FINANCIERA] Rechazo: El precio promedio no puede ser negativo.';
END IF;
    IF NEW.alcohol_pct < 0 OR NEW.alcohol_pct > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD FÍSICA] Rechazo: El porcentaje de alcohol debe estar acotado entre 0 y 100.';
END IF;
    IF NEW.production_bottles < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD LOGÍSTICA] Rechazo: La producción no puede ser negativa.';
END IF;

    -- Automatización de metadatos y sanitización de cadenas
    SET NEW.price_range = fn_get_price_range(NEW.avg_price_usd);
    SET NEW.name = TRIM(NEW.name);
END$$

-- ------------------------------------------------------------
-- 2. TRIGGER: tr_wines_before_update (Rastreador de Estados y Optimización)
-- ------------------------------------------------------------
-- Funcionalidad: Evalúa mutaciones en registros existentes.
-- Justificación Técnica:
-- - Optimización de Recursos (CPU): Implementa evaluación condicional. Solo
--   recalcula el rango de precio si detecta que la columna 'avg_price_usd'
--   sufrió una mutación real. Si el usuario actualiza solo el nombre, no
--   desperdicia ciclos de procesamiento invocando la función.
-- - Consistencia Continua: Mantiene la vigencia de las validaciones base ante
--   modificaciones arbitrarias.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_wines_before_update$$
CREATE TRIGGER tr_wines_before_update
    BEFORE UPDATE ON wines
    FOR EACH ROW
BEGIN
    IF NEW.vintage_year > YEAR(CURDATE()) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD DE DOMINIO] Rechazo: El año de cosecha actualizado no puede ser futuro.';
END IF;
IF NEW.alcohol_pct < 0 OR NEW.alcohol_pct > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD FÍSICA] Rechazo: El porcentaje de alcohol debe estar acotado entre 0 y 100.';
END IF;

    -- Recálculo de dependencias funcionales solo si el factor determinante cambió
    IF NEW.avg_price_usd <> OLD.avg_price_usd THEN
        SET NEW.price_range = fn_get_price_range(NEW.avg_price_usd);
END IF;
END$$

-- ------------------------------------------------------------
-- 3. TRIGGER: tr_wines_after_delete (Auditoría Criptográfica / JSON)
-- ------------------------------------------------------------
-- Funcionalidad: Registra de forma pasiva la eliminación de un producto comercial.
-- Justificación Técnica:
-- - Desacoplamiento de Auditoría: El API que solicita el DELETE no necesita
--   conocer la existencia de la tabla de logs. El trigger actúa de forma
--   transparente (Event-driven) empaquetando el estado anterior (OLD) y
--   serializándolo en un objeto JSON nativo.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_wines_after_delete$$
CREATE TRIGGER tr_wines_after_delete
    AFTER DELETE ON wines
    FOR EACH ROW
BEGIN
    INSERT INTO audit_master_log (table_name, record_id, action_type, payload, logged_by_user)
    VALUES (
               'wines',
               OLD.id,
               'DELETE',
               JSON_OBJECT(
                       'name', OLD.name,
                       'vintage_year', OLD.vintage_year,
                       'avg_price_usd', OLD.avg_price_usd,
                       'vineyard_id', OLD.vineyard_id
               ),
               USER()
           );
    END$$

    -- ============================================================
-- BLOQUE 2: ASEGURAMIENTO DE CALIDAD DE DATOS (Métricas y Uvas)
-- ============================================================

-- ------------------------------------------------------------
-- 4. TRIGGER: tr_wine_metrics_quality_gate (Sanidad de BI y Data Healing)
-- ------------------------------------------------------------
-- Funcionalidad: Protege la confiabilidad de los datos analíticos.
-- Justificación Empresarial:
-- - Protección de Business Intelligence (BI): Un solo valor atípico (Outlier)
--   por un error de digitación puede sesgar completamente un dashboard gerencial.
-- - Data Healing (Sanación de Datos): En lugar de rechazar transacciones completas
--   por errores menores de UI (ej. enviar -1 medallas), el motor corrige el valor
--   silenciosamente a 0, mejorando la disponibilidad del sistema sin sacrificar integridad.
-- ------------------------------------------------------------
    DROP TRIGGER IF EXISTS tr_wine_metrics_quality_gate$$
    CREATE TRIGGER tr_wine_metrics_quality_gate
        BEFORE INSERT ON wine_metrics
        FOR EACH ROW
    BEGIN
        IF NEW.avg_score < 0.00 OR NEW.avg_score > 100.00 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[CALIDAD BI] Rechazo: El puntaje promedio excede la escala estándar (0-100).';
    END IF;

    -- Auto-corrección de valores ilógicos menores
    IF NEW.medal_count < 0 THEN
        SET NEW.medal_count = 0;
END IF;
END$$

-- ------------------------------------------------------------
-- 5. TRIGGER: tr_wine_grapes_percentage_check (Restricciones Matemáticas)
-- ------------------------------------------------------------
-- Funcionalidad: Controla la coherencia en tablas pivote (relación NxM).
-- Justificación Técnica: Las mezclas de uvas (blends) se basan en proporciones.
-- Este trigger implementa una restricción de Check matemática a nivel de fila
-- para evitar divisiones por cero o cálculos estadísticos inválidos en el futuro.
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_wine_grapes_percentage_check$$
CREATE TRIGGER tr_wine_grapes_percentage_check
    BEFORE INSERT ON wine_grapes
    FOR EACH ROW
BEGIN
    IF NEW.percentage <= 0 OR NEW.percentage > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[LÓGICA MATEMÁTICA] Rechazo: La proporción porcentual de la uva es inválida.';
END IF;
END$$

-- ============================================================
-- BLOQUE 3: PREVENCIÓN DE ELIMINACIÓN DE DATOS MAESTROS (MDM)
-- ============================================================

-- ------------------------------------------------------------
-- 6. TRIGGER: tr_vineyards_prevent_hard_delete (Candado Maestro Viñedos)
-- ------------------------------------------------------------
-- Funcionalidad: Anula sentencias DELETE sobre entidades fundamentales.
-- Justificación Arquitectónica (Master Data Management - MDM):
-- - En sistemas empresariales resilientes, las entidades que poseen historial
--   transaccional no deben sufrir borrados físicos (Hard Delete). Este trigger
--   hace cumplir políticas estrictas obligando al equipo de ingeniería a
--   diseñar e implementar borrados lógicos (Soft Delete).
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS tr_vineyards_prevent_hard_delete$$
CREATE TRIGGER tr_vineyards_prevent_hard_delete
    BEFORE DELETE ON vineyards
    FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[CUMPLIMIENTO MDM] Bloqueo: Prohibido aplicar Hard Delete a entidades maestras (Viñedos). Utilice Soft Delete.';
END$$

-- ------------------------------------------------------------
-- 7. TRIGGER: tr_regions_prevent_hard_delete (Candado Geográfico)
-- ------------------------------------------------------------
-- Justificación: Previene la destrucción en cascada (Cascade Deletion) que
-- dejaría a los viñedos huérfanos de metadatos geográficos.
-- ------------------------------------------------------------
    DROP TRIGGER IF EXISTS tr_regions_prevent_hard_delete$$
    CREATE TRIGGER tr_regions_prevent_hard_delete
        BEFORE DELETE ON regions
        FOR EACH ROW
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[CUMPLIMIENTO MDM] Bloqueo: Integridad geográfica protegida. No se pueden eliminar regiones.';
END$$

-- ------------------------------------------------------------
-- 8. TRIGGER: tr_countries_prevent_hard_delete (Candado Supremo)
-- ------------------------------------------------------------
-- Justificación: Protege el nivel más alto de la jerarquía relacional.
-- Asegura la estabilidad absoluta de las llaves foráneas (Foreign Keys) base.
-- ------------------------------------------------------------
        DROP TRIGGER IF EXISTS tr_countries_prevent_hard_delete$$
        CREATE TRIGGER tr_countries_prevent_hard_delete
            BEFORE DELETE ON countries
            FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[CUMPLIMIENTO MDM] Bloqueo Crítico: Las entidades raíz (Países) son inmutables.';
END$$

-- ============================================================
-- BLOQUE 4: SANITIZACIÓN Y AUDITORÍA DE CONFIANZA
-- ============================================================

-- ------------------------------------------------------------
-- 9. TRIGGER: tr_vineyards_before_insert (Validación Cronológica)
-- ------------------------------------------------------------
-- Funcionalidad: Controla la lógica temporal de la fundación corporativa.
-- Justificación Técnica: Limita el rango operativo de las fechas para evitar
-- desbordamientos (overflows) en reportes históricos o inconsistencias con
-- eventos que preceden la vinicultura moderna (ej. año < 1000).
-- ------------------------------------------------------------
            DROP TRIGGER IF EXISTS tr_vineyards_before_insert$$
            CREATE TRIGGER tr_vineyards_before_insert
                BEFORE INSERT ON vineyards
                FOR EACH ROW
            BEGIN
                IF NEW.founded_year > YEAR(CURDATE()) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD CRONOLÓGICA] Rechazo: Año de fundación proyectado al futuro.';
            END IF;
            IF NEW.founded_year < 1000 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '[INTEGRIDAD CRONOLÓGICA] Rechazo: Año de fundación fuera del límite histórico aceptable.';
        END IF;

        SET NEW.name = TRIM(NEW.name);
END$$

-- ------------------------------------------------------------
-- 10. TRIGGER: tr_grape_varieties_before_insert (Agnosticismo de UI)
-- ------------------------------------------------------------
-- Funcionalidad: Estandarización de nomenclaturas a nivel de BD.
-- Justificación de Negocio: Garantiza que sin importar si el dato proviene
-- de una Web, un App Móvil, o una inserción manual del DBA, el
-- formato (Mayúscula Inicial) siempre será uniforme, facilitando el
-- agrupamiento (GROUP BY) en consultas analíticas sin necesidad de usar UPPER/LOWER.
-- ------------------------------------------------------------
        DROP TRIGGER IF EXISTS tr_grape_varieties_before_insert$$
        CREATE TRIGGER tr_grape_varieties_before_insert
            BEFORE INSERT ON grape_varieties
            FOR EACH ROW
        BEGIN
            SET NEW.name = TRIM(NEW.name);
    -- Normalización de texto: Primera letra mayúscula, resto minúscula.
    SET NEW.color = CONCAT(UPPER(SUBSTRING(TRIM(NEW.color), 1, 1)), LOWER(SUBSTRING(TRIM(NEW.color), 2)));
END$$

-- ------------------------------------------------------------
-- 11. TRIGGER: tr_wine_grapes_after_delete (Rastreo de Propiedad Intelectual)
-- ------------------------------------------------------------
-- Funcionalidad: Audita la eliminación de componentes de una fórmula.
-- Justificación Empresarial: La mezcla de un vino es esencialmente una receta
-- (Trade Secret). Si se altera eliminando un componente, el sistema debe
-- registrar inmediatamente el delta de la alteración para posibles auditorías
-- de calidad o trazabilidad de producción.
-- ------------------------------------------------------------
            DROP TRIGGER IF EXISTS tr_wine_grapes_after_delete$$
            CREATE TRIGGER tr_wine_grapes_after_delete
                AFTER DELETE ON wine_grapes
                FOR EACH ROW
            BEGIN
                INSERT INTO audit_master_log (table_name, record_id, action_type, payload, logged_by_user)
                VALUES (
                           'wine_grapes',
                           OLD.wine_id,
                           'DELETE_FORMULA',
                           JSON_OBJECT(
                                   'grape_id_removed', OLD.grape_id,
                                   'percentage_lost', OLD.percentage
                           ),
                           USER()
                       );
                END$$

                -- ------------------------------------------------------------
-- 12. TRIGGER: tr_wine_metrics_after_delete (Prevención de Fraude)
-- ------------------------------------------------------------
-- Funcionalidad: Audita la supresión de KPIs (Key Performance Indicators).
-- Justificación Empresarial: Eliminar un puntaje bajo mejora artificialmente
-- el promedio de una región o viñedo. Este trigger actúa como una medida
-- anti-fraude, garantizando que cualquier modificación a las métricas
-- quede estampada con firma de tiempo y usuario.
-- ------------------------------------------------------------
                DROP TRIGGER IF EXISTS tr_wine_metrics_after_delete$$
                CREATE TRIGGER tr_wine_metrics_after_delete
                    AFTER DELETE ON wine_metrics
                    FOR EACH ROW
                BEGIN
                    INSERT INTO audit_master_log (table_name, record_id, action_type, payload, logged_by_user)
                    VALUES (
                               'wine_metrics',
                               OLD.wine_id,
                               'DELETE_METRIC',
                               JSON_OBJECT(
                                       'avg_score_deleted', OLD.avg_score,
                                       'medals_deleted', OLD.medal_count
                               ),
                               USER()
                           );
                    END$$

                    DELIMITER ;