-- ============================================================
-- Metrical Zone of Wines — DML (Robust Seed Data)
-- Engine: MySQL 8.0
-- ============================================================
-- ------------------------------------------------------------
-- 1. COUNTRIES
-- ------------------------------------------------------------
INSERT INTO countries (name, code) VALUES 
('France', 'FR'),
('Italy', 'IT'),
('Spain', 'ES'),
('Argentina', 'AR'),
('Chile', 'CL'),
('United States', 'US'),
('Australia', 'AU');

-- ------------------------------------------------------------
-- 2. REGIONS
-- ------------------------------------------------------------
INSERT INTO regions (country_id, name, description, climate_type, wine_style_profile) VALUES 
(1, 'Bordeaux', 'Cuna de los blends tintos más famosos del mundo.', 'Oceanic', 'Bold reds'),
(1, 'Burgundy', 'Famosa por sus Pinot Noir y Chardonnay de terruño.', 'Continental', 'Elegant reds'),
(2, 'Tuscany', 'Hogar del Chianti y los Súper Toscanos.', 'Mediterranean', 'Bold reds'),
(2, 'Piedmont', 'Reconocida por el Barolo y la uva Nebbiolo.', 'Continental', 'Elegant reds'),
(3, 'Rioja', 'Vinos con mucho roble, basados en Tempranillo.', 'Semi-arid', 'Bold reds'),
(4, 'Mendoza', 'El paraíso del Malbec de gran altitud.', 'Semi-arid', 'Bold reds'),
(5, 'Maipo Valley', 'Clima ideal para Cabernet Sauvignon en Sudamérica.', 'Mediterranean', 'Elegant reds'),
(6, 'Napa Valley', 'Cabernet y Chardonnay potentes y de lujo.', 'Mediterranean', 'Bold reds'),
(7, 'Barossa Valley', 'Shiraz muy potentes y con mucho cuerpo.', 'Semi-arid', 'Bold reds');

-- ------------------------------------------------------------
-- 3. GRAPE VARIETIES
-- ------------------------------------------------------------
INSERT INTO grape_varieties (name, color, origin_country) VALUES 
('Cabernet Sauvignon', 'Red', 'France'),
('Merlot', 'Red', 'France'),
('Pinot Noir', 'Red', 'France'),
('Chardonnay', 'White', 'France'),
('Sauvignon Blanc', 'White', 'France'),
('Sangiovese', 'Red', 'Italy'),
('Nebbiolo', 'Red', 'Italy'),
('Tempranillo', 'Red', 'Spain'),
('Malbec', 'Red', 'France'),
('Syrah', 'Red', 'France'),
('Carmenere', 'Red', 'France');

-- ------------------------------------------------------------
-- 4. VINEYARDS
-- ------------------------------------------------------------
INSERT INTO vineyards (region_id, name, owner, founded_year, hectares, altitude_avg_m, soil_type, irrigation_type, harvest_season, lat, lng) VALUES 
(1, 'Château Margaux', 'Corinne Mentzelopoulos', 1590, 82.00, 15, 'Gravel', 'Dry farming', 'Autumn', 45.0444, -0.6694),
(1, 'Château Latour', 'François Pinault', 1331, 78.00, 16, 'Gravel', 'Dry farming', 'Autumn', 45.1923, -0.7486),
(2, 'Domaine de la Romanée-Conti', 'Familia de Villaine', 1232, 25.00, 250, 'Limestone', 'Dry farming', 'Autumn', 47.1605, 4.9547),
(3, 'Marchesi Antinori', 'Familia Antinori', 1385, 200.00, 300, 'Clay', 'Drip', 'Autumn', 43.5658, 11.1963),
(4, 'Gaja', 'Angelo Gaja', 1859, 100.00, 280, 'Limestone', 'Dry farming', 'Autumn', 44.7266, 8.0827),
(5, 'Marqués de Riscal', 'Familia Hurtado', 1858, 500.00, 450, 'Clay', 'Drip', 'Autumn', 42.5113, -2.6186),
(6, 'Catena Zapata', 'Nicolás Catena', 1902, 120.50, 1500, 'Limestone', 'Drip', 'Autumn', -33.1234, -68.8456),
(6, 'Bodega Norton', 'Gernot Langes-Swarovski', 1895, 680.00, 900, 'Sandy', 'Drip', 'Autumn', -33.0298, -68.8821),
(7, 'Concha y Toro', 'Familia Guilisasti', 1883, 300.00, 600, 'Clay', 'Drip', 'Autumn', -33.6425, -70.5758),
(8, 'Opus One Winery', 'Rothschild & Mondavi', 1979, 68.00, 45, 'Loam', 'Drip', 'Autumn', 38.4239, -122.4042),
(9, 'Penfolds', 'Treasury Wine Estates', 1844, 400.00, 250, 'Loam', 'Drip', 'Autumn', -34.4828, 138.9959);

-- ------------------------------------------------------------
-- 5. WINES
-- ------------------------------------------------------------
INSERT INTO wines (vineyard_id, name, vintage_year, wine_type, alcohol_pct, avg_price_usd, price_range, production_bottles, aging_months, aging_vessel, natural_wine) VALUES 
(1, 'Château Margaux Grand Vin', 2015, 'Red', 13.50, 850.00, 'Luxury', 130000, 24, 'French oak', 0),
(1, 'Pavillon Blanc', 2018, 'White', 14.00, 250.00, 'Premium', 10000, 8, 'French oak', 0),
(2, 'Grand Vin de Château Latour', 2010, 'Red', 14.00, 1100.00, 'Luxury', 100000, 18, 'French oak', 0),
(3, 'Romanée-Conti Grand Cru', 2018, 'Red', 13.50, 20000.00, 'Luxury', 6000, 18, 'French oak', 1),
(4, 'Tignanello', 2019, 'Red', 14.00, 150.00, 'Premium', 300000, 14, 'French oak', 0),
(5, 'Barolo Sperss', 2016, 'Red', 14.50, 280.00, 'Luxury', 20000, 30, 'French oak', 0),
(6, 'Reserva Tempranillo', 2017, 'Red', 14.00, 25.00, 'Mid', 500000, 24, 'American oak', 0),
(7, 'Malbec Argentino', 2019, 'Red', 14.20, 120.00, 'Premium', 50000, 18, 'French oak', 0),
(8, 'Norton Reserva Malbec', 2021, 'Red', 14.00, 18.00, 'Budget', 800000, 12, 'French oak', 0),
(9, 'Don Melchor Cabernet Sauvignon', 2020, 'Red', 14.50, 130.00, 'Premium', 120000, 15, 'French oak', 0),
(9, 'Casillero del Diablo Reserva', 2021, 'Red', 13.50, 15.00, 'Budget', 1000000, 6, 'Stainless steel', 0),
(10, 'Opus One', 2018, 'Red', 14.50, 380.00, 'Luxury', 250000, 18, 'French oak', 0),
(11, 'Grange', 2017, 'Red', 14.50, 800.00, 'Luxury', 50000, 20, 'American oak', 0);

-- ------------------------------------------------------------
-- 6. WINE_GRAPES (Pivote - Relaciones M:M)
-- ------------------------------------------------------------
-- Margaux Grand Vin (Blend: 87% Cab, 13% Merlot)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (1, 1, 87.00), (1, 2, 13.00);
-- Pavillon Blanc (100% Sauvignon Blanc)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (2, 5, 100.00);
-- Latour (Blend: 90% Cab, 9% Merlot, 1% Pinot Noir para molestar)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (3, 1, 90.00), (3, 2, 9.00), (3, 3, 1.00);
-- Romanée-Conti (100% Pinot Noir)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (4, 3, 100.00);
-- Tignanello (Blend: 80% Sangiovese, 15% Cab, 5% Cab Franc - pero usamos lo que hay)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (5, 6, 80.00), (5, 1, 20.00);
-- Barolo Gaja (100% Nebbiolo)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (6, 7, 100.00);
-- Marqués de Riscal (100% Tempranillo)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (7, 8, 100.00);
-- Catena Malbec Argentino (100% Malbec)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (8, 9, 100.00);
-- Norton Malbec (100% Malbec)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (9, 9, 100.00);
-- Don Melchor (100% Cabernet Sauvignon)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (10, 1, 100.00);
-- Casillero del Diablo (100% Carmenere)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (11, 11, 100.00);
-- Opus One (Blend: 85% Cab, 15% Merlot)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (12, 1, 85.00), (12, 2, 15.00);
-- Grange (Blend: 96% Syrah, 4% Cab)
INSERT INTO wine_grapes (wine_id, grape_id, percentage) VALUES (13, 10, 96.00), (13, 1, 4.00);

-- ------------------------------------------------------------
-- 7. METRICS (Datos de relleno para que las vistas no queden en blanco)
-- ------------------------------------------------------------
-- Metricas de un par de regiones
INSERT INTO region_metrics (region_id, total_vineyards, total_wines, total_reviews, avg_score, avg_price_usd, price_range, dominant_grape_id, prestige_index) VALUES 
(1, 2, 3, 15000, 96.50, 733.33, 'Luxury', 1, 'Legendary'),
(6, 2, 2, 8500, 92.00, 69.00, 'Mid', 9, 'Acclaimed');

-- Metricas de viñedos
INSERT INTO vineyard_metrics (vineyard_id, total_wines, total_reviews, avg_score, avg_price_usd, price_range, prestige_index, dominant_grape_id) VALUES 
(1, 2, 8000, 97.00, 550.00, 'Luxury', 'Legendary', 1),
(3, 1, 1200, 99.50, 20000.00, 'Luxury', 'Legendary', 3);

-- Metricas de Vinos
INSERT INTO wine_metrics (wine_id, total_reviews, avg_score, avg_expert_score, avg_consumer_score, prestige_index) VALUES 
(1, 5000, 98.00, 99.00, 97.50, 'Legendary'),
(4, 1200, 99.50, 100.00, 99.00, 'Legendary'),
(11, 15000, 88.00, 85.00, 89.00, 'Recognized');