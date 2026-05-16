-- ============================================================
-- Metrical Zone of Wines — Database Maintenance, Archiving & Events
-- Engine: MySQL 8.0
-- File: V7__create_maintenance_events_and_archiving.sql
-- ============================================================

/*
   NOTA ARQUITECTÓNICA SOBRE BACKUPS Y EVENTOS:
   Los respaldos físicos o lógicos (Disaster Recovery) deben gestionarse externamente
   vía scripts de shell (ej. mysqldump) orquestados en el sistema operativo.

   Lo que implementa esta versión V7 es el "Ciclo de Vida del Dato" (Data Lifecycle Management)
   a nivel interno del motor:
   1. Snapshots: Capturas de estado acumulativas para análisis histórico de BI.
   2. Data Archiving: Traslado de auditorías viejas a tablas de almacenamiento frío (Cold Storage).
   3. Maintenance: Reconstrucción de índices para evitar la fragmentación.
*/

-- ------------------------------------------------------------
-- 0. HABILITAR EL PLANIFICADOR DE EVENTOS (Event Scheduler)
-- ------------------------------------------------------------
-- Justificación Técnica: En MySQL, los eventos programados no corren si el
-- hilo del planificador está apagado. Esto garantiza que las rutinas autónomas funcionen.
-- ------------------------------------------------------------
-- SET GLOBAL event_scheduler = ON;

-- ============================================================
-- BLOQUE 1: ESTRUCTURAS DE ALMACENAMIENTO HISTÓRICO Y FRÍO
-- ============================================================

-- ------------------------------------------------------------
-- 1.1 Tabla: metrics_snapshot_history (Acumulativo Mensual/Diario)
-- ------------------------------------------------------------
-- Justificación de Negocio (Cumulative BI): Las tablas `region_metrics` y `vineyard_metrics`
-- muestran la "foto de hoy". Si gerencia quiere ver cómo estaba el prestigio de un viñedo
-- hace 6 meses (Time-Series Analysis), se requiere una tabla de snapshots que acumule la historia.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS metrics_snapshot_history (
    snapshot_id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('REGION', 'VINEYARD', 'WINE') NOT NULL,
    entity_id INT NOT NULL,
    snapshot_date DATE NOT NULL,
    avg_score DECIMAL(5,2),
    prestige_index VARCHAR(20),
    medal_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_snapshot_lookup (entity_type, entity_id, snapshot_date)
    ) COMMENT 'Histórico acumulativo para análisis de series de tiempo (Time-Series).';

-- ------------------------------------------------------------
-- 1.2 Tabla: audit_archive_log (Almacenamiento Frío)
-- ------------------------------------------------------------
-- Justificación de Arquitectura (Cold Storage): La tabla `audit_master_log` (V6)
-- crecerá de forma masiva. Para no degradar el rendimiento de las inserciones diarias,
-- los registros de más de 1 año se trasladan a esta tabla de archivo.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_archive_log (
    archive_id INT AUTO_INCREMENT PRIMARY KEY,
    original_log_id INT NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action_type VARCHAR(15) NOT NULL,
    payload JSON NOT NULL,
    logged_at TIMESTAMP NOT NULL,
    logged_by_user VARCHAR(100) NOT NULL,
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) COMMENT 'Almacenamiento frío para registros de auditoría antiguos (Compliance).';

DELIMITER $$

-- ============================================================
-- BLOQUE 2: PROCEDIMIENTOS ALMACENADOS DE MANTENIMIENTO (Sps)
-- ============================================================

-- ------------------------------------------------------------
-- 2.1 Procedimiento: sp_take_metrics_snapshot
-- ------------------------------------------------------------
-- Funcionalidad: Captura el estado actual de las métricas principales.
-- Justificación: Aisla la lógica de captura para que pueda ser invocada
-- por un Evento programado o manualmente por un Data Engineer a fin de mes.
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_take_metrics_snapshot$$

CREATE PROCEDURE sp_take_metrics_snapshot()
BEGIN
    DECLARE v_snapshot_date DATE DEFAULT CURDATE();

    -- Captura de Viñedos
INSERT INTO metrics_snapshot_history (entity_type, entity_id, snapshot_date, avg_score, prestige_index, medal_count)
SELECT 'VINEYARD', vineyard_id, v_snapshot_date, avg_score, prestige_index, medal_count
FROM vineyard_metrics;

-- Captura de Vinos
INSERT INTO metrics_snapshot_history (entity_type, entity_id, snapshot_date, avg_score, prestige_index, medal_count)
SELECT 'WINE', wine_id, v_snapshot_date, avg_score, prestige_index, medal_count
FROM wine_metrics;

SELECT CONCAT('Snapshot acumulativo generado para la fecha: ', v_snapshot_date) AS Result;
END$$

-- ------------------------------------------------------------
-- 2.2 Procedimiento: sp_archive_audit_logs
-- ------------------------------------------------------------
-- Funcionalidad: Mueve registros viejos de la auditoría activa al archivo.
-- Justificación de Negocio (Data Retention Policy): Cumple con normativas
-- de retención donde la data operativa debe ser rápida, pero la data
-- histórica no puede borrarse por temas legales.
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_archive_audit_logs$$

CREATE PROCEDURE sp_archive_audit_logs(IN p_months_retention INT)
BEGIN
    DECLARE v_cutoff_date TIMESTAMP;
    SET v_cutoff_date = DATE_SUB(NOW(), INTERVAL p_months_retention MONTH);

    -- 1. Copiar a la tabla de archivo en frío
INSERT INTO audit_archive_log (original_log_id, table_name, record_id, action_type, payload, logged_at, logged_by_user)
SELECT log_id, table_name, record_id, action_type, payload, logged_at, logged_by_user
FROM audit_master_log
WHERE logged_at < v_cutoff_date;

-- 2. Eliminar de la tabla caliente operativa
DELETE FROM audit_master_log
WHERE logged_at < v_cutoff_date;

SELECT CONCAT('Auditorías anteriores a ', v_cutoff_date, ' han sido archivadas.') AS Result;
END$$

-- ------------------------------------------------------------
-- 2.3 Procedimiento: sp_optimize_core_tables
-- ------------------------------------------------------------
-- Funcionalidad: Reorganiza el almacenamiento físico y recalcula estadísticas.
-- Justificación Técnica (Storage Engine Optimization): Las tablas con muchos
-- DELETEs e UPDATEs (como las métricas) sufren fragmentación. OPTIMIZE TABLE
-- desfragmenta el archivo de datos (.ibd) mejorando la velocidad de lectura.
-- ------------------------------------------------------------
DROP PROCEDURE IF EXISTS sp_optimize_core_tables$$

CREATE PROCEDURE sp_optimize_core_tables()
BEGIN
    -- Nota: OPTIMIZE TABLE bloquea la tabla, por eso se programa en horas valle
    OPTIMIZE TABLE wines, vineyards, wine_metrics, vineyard_metrics, audit_master_log;

SELECT 'Mantenimiento y desfragmentación de tablas core completado.' AS Result;
END$$

DELIMITER ;

-- ============================================================
-- BLOQUE 3: EVENTOS PROGRAMADOS (Scheduled Tasks)
-- ============================================================

-- ------------------------------------------------------------
-- 3.1 Evento: evt_monthly_metrics_snapshot
-- ------------------------------------------------------------
-- Ejecución: El día 1 de cada mes a las 01:00 AM.
-- Propósito: Generar la foto mensual de métricas para reportes gerenciales.
-- ------------------------------------------------------------
DROP EVENT IF EXISTS evt_monthly_metrics_snapshot;

CREATE EVENT evt_monthly_metrics_snapshot
ON SCHEDULE EVERY 1 MONTH
STARTS CURRENT_DATE + INTERVAL 1 MONTH + INTERVAL 1 HOUR -- Próximo día 1 a la 1 AM
DO
    CALL sp_take_metrics_snapshot();

-- ------------------------------------------------------------
-- 3.2 Evento: evt_quarterly_audit_archiving
-- ------------------------------------------------------------
-- Ejecución: Cada 3 meses (Trimestral) a las 02:00 AM los domingos.
-- Propósito: Mantener la tabla de auditoría maestra ligera. Retiene 6 meses.
-- ------------------------------------------------------------
DROP EVENT IF EXISTS evt_quarterly_audit_archiving;

CREATE EVENT evt_quarterly_audit_archiving
ON SCHEDULE EVERY 3 MONTH
STARTS CURRENT_DATE + INTERVAL 3 MONTH + INTERVAL 2 HOUR
DO
    -- Mueve al archivo los logs que tengan más de 6 meses de antigüedad
    CALL sp_archive_audit_logs(6);

-- ------------------------------------------------------------
-- 3.3 Evento: evt_weekly_db_optimization
-- ------------------------------------------------------------
-- Ejecución: Todos los domingos a las 03:00 AM (Hora Valle).
-- Propósito: Desfragmentar índices para mantener el rendimiento al tope.
-- ------------------------------------------------------------
DROP EVENT IF EXISTS evt_weekly_db_optimization;

CREATE EVENT evt_weekly_db_optimization
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_DATE + INTERVAL (7 - WEEKDAY(CURRENT_DATE)) DAY + INTERVAL 3 HOUR -- Próximo domingo a las 3 AM
DO
    CALL sp_optimize_core_tables();