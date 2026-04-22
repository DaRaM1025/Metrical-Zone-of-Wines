-- ============================================================
-- Metrical Zone of Wines — DDL
-- Engine: MySQL 8.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS metrical_zone_of_wines
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE metrical_zone_of_wines;

-- ------------------------------------------------------------
-- countries
-- ------------------------------------------------------------
CREATE TABLE countries (
  id    INT          NOT NULL AUTO_INCREMENT,
  name  VARCHAR(100)  NOT NULL,
  code  CHAR(2)       NOT NULL COMMENT 'ISO 3166-1 alpha-2',
  PRIMARY KEY (id),
  UNIQUE KEY uq_countries_code (code)
) COMMENT 'Wine-producing countries registered in the system';

-- ------------------------------------------------------------
-- regions
-- ------------------------------------------------------------
CREATE TABLE regions (
  id                 INT           NOT NULL AUTO_INCREMENT,
  country_id         INT           NOT NULL,
  name               VARCHAR(100)  NOT NULL,
  description        TEXT,
  climate_type       ENUM(
                       'Continental',
                       'Mediterranean',
                       'Oceanic',
                       'Semi-arid',
                       'Tropical',
                       'Alpine'
                     ),
  wine_style_profile ENUM(
                       'Bold reds',
                       'Crisp whites',
                       'Elegant reds',
                       'Sparkling',
                       'Sweet & dessert',
                       'Rosé'
                     ),
  PRIMARY KEY (id),
  CONSTRAINT fk_regions_country
    FOREIGN KEY (country_id) REFERENCES countries (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) COMMENT 'Wine regions by country';

-- ------------------------------------------------------------
-- vineyards
-- ------------------------------------------------------------
CREATE TABLE vineyards (
  id               INT            NOT NULL AUTO_INCREMENT,
  region_id        INT            NOT NULL,
  name             VARCHAR(100)   NOT NULL,
  owner            VARCHAR(100),
  founded_year     YEAR,
  hectares         DECIMAL(8,2),
  altitude_avg_m   INT            COMMENT 'Average altitude in meters',
  soil_type        ENUM(
                     'Clay',
                     'Sandy',
                     'Limestone',
                     'Granite',
                     'Slate',
                     'Volcanic',
                     'Loam',
                     'Gravel'
                   ),
  irrigation_type  ENUM(
                     'Drip',
                     'Flood',
                     'Sprinkler',
                     'Dry farming'
                   ),
  harvest_season   ENUM(
                     'Spring',
                     'Summer',
                     'Autumn',
                     'Winter'
                   ),
  lat              DECIMAL(9,6)   COMMENT 'Geographical latitude',
  lng              DECIMAL(9,6)   COMMENT 'Geographical longitude',
  website          VARCHAR(255),
  label_image_url  VARCHAR(255),
  PRIMARY KEY (id),
  CONSTRAINT fk_vineyards_region
    FOREIGN KEY (region_id) REFERENCES regions (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) COMMENT 'Registered vineyards per region';

-- ------------------------------------------------------------
-- grape_varieties
-- ------------------------------------------------------------
CREATE TABLE grape_varieties (
  id             INT          NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100) NOT NULL,
  color          ENUM('Red', 'White', 'Rosé'),
  origin_country VARCHAR(100),
  PRIMARY KEY (id),
  UNIQUE KEY uq_grape_varieties_name (name)
) COMMENT 'Grape varieties available in the system';

-- ------------------------------------------------------------
-- wines
-- ------------------------------------------------------------
CREATE TABLE wines (
  id                 INT            NOT NULL AUTO_INCREMENT,
  vineyard_id        INT            NOT NULL,
  name               VARCHAR(150)   NOT NULL,
  vintage_year       YEAR,
  wine_type          ENUM(
                       'Red',
                       'White',
                       'Rosé',
                       'Sparkling',
                       'Dessert',
                       'Fortified'
                     ),
  alcohol_pct        DECIMAL(4,2)   COMMENT 'Alcohol percentage (e.g., 13.50)',
  avg_price_usd      DECIMAL(8,2),
  price_range        ENUM(
                       'Budget',
                       'Mid',
                       'Premium',
                       'Luxury'
                     ),
  production_bottles INT            COMMENT 'Bottles produced per vintage',
  aging_months       INT            COMMENT 'Aging months',
  aging_vessel       ENUM(
                       'French oak',
                       'American oak',
                       'Stainless steel',
                       'Concrete',
                       'Amphora',
                       'No aging'
                     ),
  natural_wine       TINYINT(1)     NOT NULL DEFAULT 0,
  tasting_notes      TEXT,
  food_pairing       TEXT,
  label_image_url    VARCHAR(255),
  description        TEXT,
  PRIMARY KEY (id),
  CONSTRAINT fk_wines_vineyard
    FOREIGN KEY (vineyard_id) REFERENCES vineyards (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) COMMENT 'Wines commercialized by each vineyard';

-- ------------------------------------------------------------
-- wine_grapes
-- ------------------------------------------------------------
CREATE TABLE wine_grapes (
  wine_id    INT          NOT NULL,
  grape_id   INT          NOT NULL,
  percentage DECIMAL(5,2) COMMENT 'Composition percentage (0.00 to 100.00)',
  PRIMARY KEY (wine_id, grape_id),
  CONSTRAINT fk_wine_grapes_wine
    FOREIGN KEY (wine_id) REFERENCES wines (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_wine_grapes_grape
    FOREIGN KEY (grape_id) REFERENCES grape_varieties (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) COMMENT 'Relationship between wines and grape varieties with composition percentage';

-- ------------------------------------------------------------
-- region_metrics
-- ------------------------------------------------------------
CREATE TABLE region_metrics (
  id                 INT           NOT NULL AUTO_INCREMENT,
  region_id          INT           NOT NULL,
  computed_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_vineyards    INT           NOT NULL DEFAULT 0,
  total_wines        INT           NOT NULL DEFAULT 0,
  total_reviews      INT           NOT NULL DEFAULT 0,
  avg_score          DECIMAL(5,2),
  top_score          DECIMAL(5,2),
  avg_expert_score   DECIMAL(5,2),
  avg_consumer_score DECIMAL(5,2),
  avg_price_usd      DECIMAL(8,2),
  price_range        ENUM(
                       'Budget',
                       'Mid',
                       'Premium',
                       'Luxury'
                     ),
  dominant_grape_id  INT,
  best_vintage_year  YEAR,
  prestige_index     ENUM(
                       'Emerging',
                       'Recognized',
                       'Acclaimed',
                       'Legendary'
                     ),
  medal_count        INT           NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT fk_region_metrics_region
    FOREIGN KEY (region_id) REFERENCES regions (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_region_metrics_grape
    FOREIGN KEY (dominant_grape_id) REFERENCES grape_varieties (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) COMMENT 'Historical aggregated metrics per region — insert only, never update';

-- ------------------------------------------------------------
-- vineyard_metrics
-- ------------------------------------------------------------
CREATE TABLE vineyard_metrics (
  id                 INT           NOT NULL AUTO_INCREMENT,
  vineyard_id        INT           NOT NULL,
  computed_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_wines        INT           NOT NULL DEFAULT 0,
  total_reviews      INT           NOT NULL DEFAULT 0,
  avg_score          DECIMAL(5,2),
  top_score          DECIMAL(5,2),
  avg_expert_score   DECIMAL(5,2),
  avg_consumer_score DECIMAL(5,2),
  avg_price_usd      DECIMAL(8,2),
  price_range        ENUM(
                       'Budget',
                       'Mid',
                       'Premium',
                       'Luxury'
                     ),
  dominant_grape_id  INT,
  prestige_index     ENUM(
                       'Emerging',
                       'Recognized',
                       'Acclaimed',
                       'Legendary'
                     ),
  medal_count        INT           NOT NULL DEFAULT 0,
  top_wine_type      ENUM(
                       'Red',
                       'White',
                       'Rosé',
                       'Sparkling',
                       'Dessert',
                       'Fortified'
                     ),
  avg_aging_months   DECIMAL(5,2),
  PRIMARY KEY (id),
  CONSTRAINT fk_vineyard_metrics_vineyard
    FOREIGN KEY (vineyard_id) REFERENCES vineyards (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_vineyard_metrics_grape
    FOREIGN KEY (dominant_grape_id) REFERENCES grape_varieties (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) COMMENT 'Historical aggregated metrics per vineyard — insert only, never update';

-- ------------------------------------------------------------
-- wine_metrics
-- ------------------------------------------------------------
CREATE TABLE wine_metrics (
  id                 INT           NOT NULL AUTO_INCREMENT,
  wine_id            INT           NOT NULL,
  computed_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total_reviews      INT           NOT NULL DEFAULT 0,
  avg_score          DECIMAL(5,2),
  top_score          DECIMAL(5,2),
  avg_expert_score   DECIMAL(5,2),
  avg_consumer_score DECIMAL(5,2),
  medal_count        INT           NOT NULL DEFAULT 0,
  prestige_index     ENUM(
                       'Emerging',
                       'Recognized',
                       'Acclaimed',
                       'Legendary'
                     ),
  PRIMARY KEY (id),
  CONSTRAINT fk_wine_metrics_wine
    FOREIGN KEY (wine_id) REFERENCES wines (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) COMMENT 'Historical aggregated metrics per wine — insert only, never update';