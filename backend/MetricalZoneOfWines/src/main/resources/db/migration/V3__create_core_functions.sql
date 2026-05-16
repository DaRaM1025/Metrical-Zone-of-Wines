-- ============================================================
-- Metrical Zone of Wines — Core Functions
-- Engine: MySQL 8.0
-- File: V3__create_core_functions.sql
-- ============================================================


DELIMITER $$

-- ------------------------------------------------------------
-- 1. Function: fn_get_price_range
-- Purpose: Categorizes a specific USD price into standard ranges.
-- ------------------------------------------------------------
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
-- 2. Function: fn_determine_prestige_index
-- Purpose: Translates a 100-point scale score into a Prestige Index.
-- ------------------------------------------------------------
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
-- 3. Function: fn_calculate_vintage_age
-- Purpose: Calculates the age of a wine based on its vintage year.
-- ------------------------------------------------------------
CREATE FUNCTION fn_calculate_vintage_age(p_vintage_year INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_current_year INT;
    
    IF p_vintage_year IS NULL THEN 
        RETURN 0;
    END IF;
    
    SET v_current_year = YEAR(CURDATE());
    
    -- Si por alguna razón el año de cosecha es en el futuro, retorna 0
    IF p_vintage_year > v_current_year THEN
        RETURN 0;
    END IF;
    
    RETURN v_current_year - p_vintage_year;
END$$

-- ------------------------------------------------------------
-- 4. Function: fn_get_dominant_grape_for_wine
-- Purpose: Finds the ID of the grape with the highest percentage in a blend.
-- ------------------------------------------------------------
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
-- 5. Function: fn_calculate_estimated_revenue
-- Purpose: Calculates the potential gross revenue of a specific wine.
-- ------------------------------------------------------------
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
-- 6. Function: fn_get_vineyard_age
-- Purpose: Calculates how many years a vineyard has been operating.
-- ------------------------------------------------------------
CREATE FUNCTION fn_get_vineyard_age(p_founded_year INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_current_year INT;
    
    IF p_founded_year IS NULL THEN 
        RETURN 0;
    END IF;
    
    SET v_current_year = YEAR(CURDATE());
    RETURN v_current_year - p_founded_year;
END$$

-- ------------------------------------------------------------
-- 7. Function: fn_format_wine_label
-- Purpose: Generates a clean, formatted string for frontend display.
-- Example output: "Opus One (2018) - 14.50% Vol."
-- ------------------------------------------------------------
CREATE FUNCTION fn_format_wine_label(p_name VARCHAR(150), p_vintage INT, p_alcohol DECIMAL(4,2))
RETURNS VARCHAR(255)
DETERMINISTIC
BEGIN
    DECLARE v_vintage_str VARCHAR(10);
    DECLARE v_alcohol_str VARCHAR(10);
    
    SET v_vintage_str = IFNULL(CAST(p_vintage AS CHAR), 'NV'); -- NV = Non-Vintage
    SET v_alcohol_str = IFNULL(CAST(p_alcohol AS CHAR), 'N/A');
    
    RETURN CONCAT(p_name, ' (', v_vintage_str, ') - ', v_alcohol_str, '% Vol.');
END$$

-- ------------------------------------------------------------
-- 8. Function: fn_get_total_bottles_by_vineyard
-- Purpose: Sums the total production of all wines for a given vineyard.
-- ------------------------------------------------------------
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
-- 9. Function: fn_convert_hectares_to_acres
-- Purpose: Converts hectares to acres for international display.
-- ------------------------------------------------------------
CREATE FUNCTION fn_convert_hectares_to_acres(p_hectares DECIMAL(8,2)) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    IF p_hectares IS NULL THEN 
        RETURN 0.00;
    END IF;
    
    -- 1 Hectare = 2.47105 Acres
    RETURN ROUND(p_hectares * 2.47105, 2);
END$$

-- ------------------------------------------------------------
-- 10. Function: fn_check_needs_decanting
-- Purpose: Business rule to determine if a wine should be decanted 
-- based on its type and aging months. Returns 1 (True) or 0 (False).
-- ------------------------------------------------------------
CREATE FUNCTION fn_check_needs_decanting(p_wine_type VARCHAR(20), p_aging_months INT) 
RETURNS TINYINT(1)
DETERMINISTIC
BEGIN
    -- Only red wines heavily aged usually need mandatory decanting
    IF p_wine_type = 'Red' AND p_aging_months >= 18 THEN
        RETURN 1;
    END IF;
    
    RETURN 0;
END$$

DELIMITER ;