# Data Dictionary — Metrical Zone of Wines
**Database:** `metrical_zone_of_wines`
**Engine:** MySQL 8.0
**Encoding:** utf8mb4 / utf8mb4_unicode_ci

---

## Table Index

| Table | Description |
|---|---|
| [countries](#countries) | Wine-producing countries registered in the system |
| [regions](#regions) | Viticultural regions per country |
| [vineyards](#vineyards) | Vineyards registered per region |
| [grape_varieties](#grape_varieties) | Grape varieties available in the system |
| [wines](#wines) | Wines commercialized by each vineyard |
| [wine_grapes](#wine_grapes) | Relationship between wines and grape varieties |
| [region_metrics](#region_metrics) | Aggregated metrics history per region |
| [vineyard_metrics](#vineyard_metrics) | Aggregated metrics history per vineyard |
| [wine_metrics](#wine_metrics) | Aggregated metrics history per wine |

---

## countries

Stores the wine-producing countries available in the system. Acts as the top level of the geographic hierarchy.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Country name |
| `code` | CHAR(2) | NOT NULL, UNIQUE | ISO 3166-1 alpha-2 code (e.g. `FR`, `ES`, `CO`) |

**Relationships**
- One country has many regions → `regions.country_id`

---

## regions

Viticultural regions belonging to a country. Each region has a defined climate type and predominant wine style, which feed the country dashboard.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `country_id` | INT | FK, NOT NULL | Reference to `countries.id` |
| `name` | VARCHAR(100) | NOT NULL | Region name |
| `description` | TEXT | NULL | General description of the region |
| `climate_type` | ENUM | NULL | Predominant climate type. Values: `Continental`, `Mediterranean`, `Oceanic`, `Semi-arid`, `Tropical`, `Alpine` |
| `wine_style_profile` | ENUM | NULL | Predominant wine style produced in the region. Values: `Bold reds`, `Crisp whites`, `Elegant reds`, `Sparkling`, `Sweet & dessert`, `Rosé` |

**Relationships**
- Belongs to one country → `countries.id`
- One region has many vineyards → `vineyards.region_id`
- One region has many metric records → `region_metrics.region_id`

---

## vineyards

Vineyards registered within a region. Stores both general information and geographic characteristics used in the vineyard dashboard.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `region_id` | INT | FK, NOT NULL | Reference to `regions.id` |
| `name` | VARCHAR(100) | NOT NULL | Vineyard name |
| `owner` | VARCHAR(100) | NULL | Name of the vineyard owner or owning company |
| `founded_year` | YEAR | NULL | Year the vineyard was established |
| `hectares` | DECIMAL(8,2) | NULL | Total surface area in hectares |
| `altitude_avg_m` | INT | NULL | Average altitude in meters above sea level |
| `soil_type` | ENUM | NULL | Predominant soil type. Values: `Clay`, `Sandy`, `Limestone`, `Granite`, `Slate`, `Volcanic`, `Loam`, `Gravel` |
| `irrigation_type` | ENUM | NULL | Irrigation method used. Values: `Drip`, `Flood`, `Sprinkler`, `Dry farming` |
| `harvest_season` | ENUM | NULL | Season in which grapes are harvested. Values: `Spring`, `Summer`, `Autumn`, `Winter` |
| `lat` | DECIMAL(9,6) | NULL | Geographic latitude |
| `lng` | DECIMAL(9,6) | NULL | Geographic longitude |
| `website` | VARCHAR(255) | NULL | Vineyard's official website URL |
| `label_image_url` | VARCHAR(255) | NULL | URL of the vineyard's logo or representative image |

**Relationships**
- Belongs to one region → `regions.id`
- One vineyard produces many wines → `wines.vineyard_id`
- One vineyard has many metric records → `vineyard_metrics.vineyard_id`

---

## grape_varieties

Catalog of grape varieties referenced by wines and used in metric calculations for dominant grape identification.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Grape variety name (e.g. `Cabernet Sauvignon`, `Chardonnay`) |
| `color` | ENUM | NULL | Grape color. Values: `Red`, `White`, `Rosé` |
| `origin_country` | VARCHAR(100) | NULL | Country of origin of the grape variety |

**Relationships**
- Referenced by `wine_grapes.grape_id`
- Referenced by `region_metrics.dominant_grape_id`
- Referenced by `vineyard_metrics.dominant_grape_id`

---

## wines

Wines commercialized by a vineyard. A wine belongs exclusively to one vineyard. Stores all product details displayed on the wine dashboard.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `vineyard_id` | INT | FK, NOT NULL | Reference to `vineyards.id` |
| `name` | VARCHAR(150) | NOT NULL | Wine name |
| `vintage_year` | YEAR | NULL | Year the grapes were harvested |
| `wine_type` | ENUM | NULL | Wine classification. Values: `Red`, `White`, `Rosé`, `Sparkling`, `Dessert`, `Fortified` |
| `alcohol_pct` | DECIMAL(4,2) | NULL | Alcohol content percentage (e.g. `13.50`) |
| `avg_price_usd` | DECIMAL(8,2) | NULL | Average retail price in USD |
| `price_range` | ENUM | NULL | Price category derived from `avg_price_usd`. Values: `Budget`, `Mid`, `Premium`, `Luxury`. Thresholds defined in system configuration |
| `production_bottles` | INT | NULL | Number of bottles produced per harvest |
| `aging_months` | INT | NULL | Number of months the wine was aged |
| `aging_vessel` | ENUM | NULL | Type of container used for aging. Values: `French oak`, `American oak`, `Stainless steel`, `Concrete`, `Amphora`, `No aging` |
| `natural_wine` | TINYINT(1) | NOT NULL, DEFAULT 0 | Indicates whether the wine is produced using natural methods. `1` = yes, `0` = no |
| `tasting_notes` | TEXT | NULL | Sensory description of the wine's characteristics |
| `food_pairing` | TEXT | NULL | Recommended food pairings |
| `label_image_url` | VARCHAR(255) | NULL | URL of the wine label image |
| `description` | TEXT | NULL | General description of the wine |

**Relationships**
- Belongs to one vineyard → `vineyards.id`
- One wine has many grape compositions → `wine_grapes.wine_id`
- One wine has many metric records → `wine_metrics.wine_id`

---

## wine_grapes

Junction table that defines the grape variety composition of each wine, including the percentage of each variety used.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `wine_id` | INT | PK, FK, NOT NULL | Reference to `wines.id` |
| `grape_id` | INT | PK, FK, NOT NULL | Reference to `grape_varieties.id` |
| `percentage` | DECIMAL(5,2) | NULL | Percentage of this grape variety in the wine blend (0.00–100.00) |

**Notes**
- Composite primary key: (`wine_id`, `grape_id`)
- Deleting a wine cascades to its grape compositions (`ON DELETE CASCADE`)
- The sum of all `percentage` values for a given `wine_id` should equal 100.00 — enforced at the application layer

---

## region_metrics

Stores the aggregated metrics history for each region. Records are insert-only — never updated. The backend inserts a new row each time metrics are recalculated after receiving review data from MongoDB. The dashboard always consumes the most recent record by `computed_at`.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `region_id` | INT | FK, NOT NULL | Reference to `regions.id` |
| `computed_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of when this metrics snapshot was calculated |
| `total_vineyards` | INT | NOT NULL, DEFAULT 0 | Total number of vineyards in the region |
| `total_wines` | INT | NOT NULL, DEFAULT 0 | Total number of wines produced in the region |
| `total_reviews` | INT | NOT NULL, DEFAULT 0 | Total number of reviews received across all vineyards and wines in the region |
| `avg_score` | DECIMAL(5,2) | NULL | Average review score across all reviewer types (0.00–100.00) |
| `top_score` | DECIMAL(5,2) | NULL | Highest individual review score recorded in the region (0.00–100.00) |
| `avg_expert_score` | DECIMAL(5,2) | NULL | Average score from expert and organization reviewers only (0.00–100.00) |
| `avg_consumer_score` | DECIMAL(5,2) | NULL | Average score from enthusiast reviewers only (0.00–100.00) |
| `avg_price_usd` | DECIMAL(8,2) | NULL | Average wine price across all wines in the region |
| `price_range` | ENUM | NULL | Price category derived from `avg_price_usd`. Values: `Budget`, `Mid`, `Premium`, `Luxury` |
| `dominant_grape_id` | INT | FK, NULL | Reference to `grape_varieties.id` — most prevalent grape variety in the region |
| `best_vintage_year` | YEAR | NULL | Best-performing harvest year based on review scores |
| `prestige_index` | ENUM | NULL | Computed prestige level of the region. Values: `Emerging`, `Recognized`, `Acclaimed`, `Legendary` |
| `medal_count` | INT | NOT NULL, DEFAULT 0 | Total number of medals awarded to wines in the region |

---

## vineyard_metrics

Stores the aggregated metrics history for each vineyard. Records are insert-only — never updated. The backend inserts a new row each time metrics are recalculated after receiving a new vineyard review from MongoDB.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `vineyard_id` | INT | FK, NOT NULL | Reference to `vineyards.id` |
| `computed_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of when this metrics snapshot was calculated |
| `total_wines` | INT | NOT NULL, DEFAULT 0 | Total number of wines commercialized by the vineyard |
| `total_reviews` | INT | NOT NULL, DEFAULT 0 | Total number of reviews received by the vineyard as an entity |
| `avg_score` | DECIMAL(5,2) | NULL | Average review score across all reviewer types (0.00–100.00) |
| `top_score` | DECIMAL(5,2) | NULL | Highest individual review score recorded for the vineyard (0.00–100.00) |
| `avg_expert_score` | DECIMAL(5,2) | NULL | Average score from expert and organization reviewers only (0.00–100.00) |
| `avg_consumer_score` | DECIMAL(5,2) | NULL | Average score from enthusiast reviewers only (0.00–100.00) |
| `avg_price_usd` | DECIMAL(8,2) | NULL | Average price across all wines produced by the vineyard |
| `price_range` | ENUM | NULL | Price category derived from `avg_price_usd`. Values: `Budget`, `Mid`, `Premium`, `Luxury` |
| `dominant_grape_id` | INT | FK, NULL | Reference to `grape_varieties.id` — most prevalent grape variety across the vineyard's wines |
| `prestige_index` | ENUM | NULL | Computed prestige level of the vineyard. Values: `Emerging`, `Recognized`, `Acclaimed`, `Legendary` |
| `medal_count` | INT | NOT NULL, DEFAULT 0 | Total number of medals awarded to the vineyard's wines |
| `top_wine_type` | ENUM | NULL | Most produced wine type in the vineyard. Values: `Red`, `White`, `Rosé`, `Sparkling`, `Dessert`, `Fortified` |
| `avg_aging_months` | DECIMAL(5,2) | NULL | Average aging duration in months across all wines in the vineyard |

---

## wine_metrics

Stores the aggregated metrics history for each wine. Records are insert-only — never updated. The backend inserts a new row each time metrics are recalculated after receiving a new wine review from MongoDB.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PK, NOT NULL, AUTO_INCREMENT | Unique identifier |
| `wine_id` | INT | FK, NOT NULL | Reference to `wines.id` |
| `computed_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Timestamp of when this metrics snapshot was calculated |
| `total_reviews` | INT | NOT NULL, DEFAULT 0 | Total number of reviews received by the wine |
| `avg_score` | DECIMAL(5,2) | NULL | Average review score across all reviewer types (0.00–100.00) |
| `top_score` | DECIMAL(5,2) | NULL | Highest individual review score recorded for the wine (0.00–100.00) |
| `avg_expert_score` | DECIMAL(5,2) | NULL | Average score from expert and organization reviewers only (0.00–100.00) |
| `avg_consumer_score` | DECIMAL(5,2) | NULL | Average score from enthusiast reviewers only (0.00–100.00) |
| `medal_count` | INT | NOT NULL, DEFAULT 0 | Total number of medals awarded to the wine |
| `prestige_index` | ENUM | NULL | Computed prestige level of the wine. Values: `Emerging`, `Recognized`, `Acclaimed`, `Legendary` |

---

## ENUM Reference

| Table | Column | Values |
|---|---|---|
| `regions` | `climate_type` | `Continental`, `Mediterranean`, `Oceanic`, `Semi-arid`, `Tropical`, `Alpine` |
| `regions` | `wine_style_profile` | `Bold reds`, `Crisp whites`, `Elegant reds`, `Sparkling`, `Sweet & dessert`, `Rosé` |
| `vineyards` | `soil_type` | `Clay`, `Sandy`, `Limestone`, `Granite`, `Slate`, `Volcanic`, `Loam`, `Gravel` |
| `vineyards` | `irrigation_type` | `Drip`, `Flood`, `Sprinkler`, `Dry farming` |
| `vineyards` | `harvest_season` | `Spring`, `Summer`, `Autumn`, `Winter` |
| `wines` | `wine_type` | `Red`, `White`, `Rosé`, `Sparkling`, `Dessert`, `Fortified` |
| `wines` | `aging_vessel` | `French oak`, `American oak`, `Stainless steel`, `Concrete`, `Amphora`, `No aging` |
| `wines` | `price_range` | `Budget`, `Mid`, `Premium`, `Luxury` |
| `region_metrics` | `price_range` | `Budget`, `Mid`, `Premium`, `Luxury` |
| `region_metrics` | `prestige_index` | `Emerging`, `Recognized`, `Acclaimed`, `Legendary` |
| `vineyard_metrics` | `price_range` | `Budget`, `Mid`, `Premium`, `Luxury` |
| `vineyard_metrics` | `prestige_index` | `Emerging`, `Recognized`, `Acclaimed`, `Legendary` |
| `vineyard_metrics` | `top_wine_type` | `Red`, `White`, `Rosé`, `Sparkling`, `Dessert`, `Fortified` |
| `wine_metrics` | `prestige_index` | `Emerging`, `Recognized`, `Acclaimed`, `Legendary` |

---

## Foreign Key Reference

| Table | Column | References | On Update | On Delete |
|---|---|---|---|---|
| `regions` | `country_id` | `countries.id` | CASCADE | RESTRICT |
| `vineyards` | `region_id` | `regions.id` | CASCADE | RESTRICT |
| `wines` | `vineyard_id` | `vineyards.id` | CASCADE | RESTRICT |
| `wine_grapes` | `wine_id` | `wines.id` | CASCADE | CASCADE |
| `wine_grapes` | `grape_id` | `grape_varieties.id` | CASCADE | RESTRICT |
| `region_metrics` | `region_id` | `regions.id` | CASCADE | RESTRICT |
| `region_metrics` | `dominant_grape_id` | `grape_varieties.id` | CASCADE | SET NULL |
| `vineyard_metrics` | `vineyard_id` | `vineyards.id` | CASCADE | RESTRICT |
| `vineyard_metrics` | `dominant_grape_id` | `grape_varieties.id` | CASCADE | SET NULL |
| `wine_metrics` | `wine_id` | `wines.id` | CASCADE | RESTRICT |

---

## MongoDB Collections Reference

The following collections are managed in MongoDB and communicate with MySQL through the backend layer using the `wine_id` or `vineyard_id` fields as cross-database references.

### vineyard_reviews

Stores reviews made to a vineyard as an entity. Never references a specific wine.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | MongoDB document identifier |
| `reviewer_type` | String | Reviewer category: `enthusiast`, `expert` |
| `reviewer_name` | String | Full name of the reviewer |
| `occupation` | String | Reviewer's occupation — expert/organization only |
| `organization` | String | Reviewer's organization — expert/organization only |
| `years_experience` | Int | Years of experience — expert/organization only |
| `vineyard_id` | Int | Cross-reference to `vineyards.id` in MySQL |
| `visit_date` | Date | Date of the vineyard visit |
| `score_overall` | Decimal | Overall score on a unified 0–100 scale |
| `experience_description` | String | Free-text description of the experience — enthusiast only |
| `would_recommend` | Boolean | Whether the reviewer recommends the vineyard — enthusiast only |
| `tasting_notes` | String | Tasting notes — expert/organization only |
| `pairing_suggestions` | String | Food pairing suggestions — expert/organization only |
| `submitted_at` | ISODate | Timestamp generated by the backend at submission time |

### wine_reviews

Stores reviews made to a specific wine. Never references a vineyard directly.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | MongoDB document identifier |
| `reviewer_type` | String | Reviewer category: `enthusiast`, `expert` |
| `reviewer_name` | String | Full name of the reviewer |
| `occupation` | String | Reviewer's occupation — expert/organization only |
| `organization` | String | Reviewer's organization — expert/organization only |
| `years_experience` | Int | Years of experience — expert/organization only |
| `wine_id` | Int | Cross-reference to `wines.id` in MySQL |
| `score_overall` | Decimal | Overall score on a unified 0–100 scale |
| `review_year` | Int | Year in which the review was written — expert/organization only |
| `scores.color` | Decimal | Color score 0–10 — expert/organization only |
| `scores.aroma` | Decimal | Aroma score 0–10 — expert/organization only |
| `scores.taste` | Decimal | Taste score 0–10 — expert/organization only |
| `scores.finish` | Decimal | Finish score 0–10 — expert/organization only |
| `scores.structure` | Decimal | Structure score 0–10 — expert/organization only |
| `experience_description` | String | Free-text description of the wine experience — enthusiast only |
| `consumption_occasion` | String | Occasion of consumption — enthusiast only. Values: `celebration`, `food pairing`, `casual drinking`, `tasting`, `gift` |
| `would_recommend` | Boolean | Whether the reviewer recommends the wine — enthusiast only |
| `tasting_notes` | String | Tasting notes — expert/organization only |
| `pairing_suggestions` | String | Food pairing suggestions — expert/organization only |
| `submitted_at` | ISODate | Timestamp generated by the backend at submission time |