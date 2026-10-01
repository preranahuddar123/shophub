-- ==============================================================================
-- FILE: scripts/seed_brands.sql
-- PURPOSE: Initial DDL & Seed for `homes_merry.brands` Master Table
-- ==============================================================================
-- WHY THIS FILE WAS CREATED:
-- The `homes_merry` database only contained a `product` table and had no `brands` table.
-- To make the Brands Master UI page completely dynamic instead of hardcoded/static,
-- this script created the `brands` table and inserted the first 15 initial brands
-- (including Lumina Italica, Nordic Structure, Terra & Form, and Lux Aeterna).
--
-- NOTE: For the complete 36-brand dataset with all 32 countries and screenshot matches,
-- see `scripts/seed_full_brands.sql`.
-- ==============================================================================

USE homes_merry;

-- Create the master brands table if it does not already exist
CREATE TABLE IF NOT EXISTS brands (
    id BIGINT NOT NULL AUTO_INCREMENT,
    brand_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    offerings_count INT NOT NULL DEFAULT 0,
    categories JSON NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    logo_url VARCHAR(500) NULL,
    updated_date VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO brands (id, brand_name, manufacturer, code, country, country_code, offerings_count, categories, status, logo_url, updated_date)
VALUES 
(1, 'Lumina Italica', 'Milan Manufacturing Group', 'LUM-IT-02', 'Italy', 'IT', 1402, '["LIGHTING", "FURNITURE", "DECOR", "BEDDING"]', 'ACTIVE', '/brands/lumina.svg', 'Oct 24, 2023'),
(2, 'Nordic Structure', 'Stockholm Design Lab', 'NOR-ST-99', 'Sweden', 'SE', 843, '["BEDDING", "FURNITURE"]', 'ACTIVE', '/brands/nordic.svg', 'Oct 21, 2023'),
(3, 'Terra & Form', 'Eco-Living Cooperative', 'TER-FR-14', 'Spain', 'ES', 212, '["DECOR"]', 'DRAFT', '/brands/terra.svg', 'Sep 30, 2023'),
(4, 'Lux Aeterna', 'Berlin Optical Systems', 'LUX-DE-88', 'Germany', 'DE', 3120, '["LIGHTING", "WALL_ART"]', 'ACTIVE', '/brands/lux.svg', 'Aug 12, 2023'),
(5, 'Hub Homes Royale', 'Hub Interior Manufacturing Ltd', 'HUB-ROY-01', 'India', 'IN', 1850, '["FURNITURE", "DECOR"]', 'ACTIVE', '/brands/hub.svg', 'Nov 15, 2023'),
(6, 'Hub Homes Artisan', 'Hub Craft Guild', 'HUB-ART-05', 'India', 'IN', 940, '["FURNITURE", "STORAGE"]', 'ACTIVE', '/brands/hub-art.svg', 'Nov 02, 2023'),
(7, 'Kvadrat Textiles', 'Ebeltoft Design Labs', 'KVA-DK-11', 'Denmark', 'DK', 1120, '["BEDDING", "DECOR", "RUGS"]', 'ACTIVE', '/brands/kvadrat.svg', 'Oct 18, 2023'),
(8, 'Atelier Vénitien', 'Venice Glass & Mirror Works', 'ATV-IT-33', 'Italy', 'IT', 480, '["LIGHTING", "DECOR"]', 'ACTIVE', '/brands/venitien.svg', 'Oct 10, 2023'),
(9, 'Kyoto Woodworks', 'Kansai Traditional Crafts Corp', 'KYO-JP-08', 'Japan', 'JP', 620, '["FURNITURE", "KITCHEN"]', 'ACTIVE', '/brands/kyoto.svg', 'Sep 25, 2023'),
(10, 'Forma Studio', 'Barcelona Modern Living', 'FOR-ES-22', 'Spain', 'ES', 730, '["FURNITURE", "LIGHTING"]', 'ACTIVE', '/brands/forma.svg', 'Sep 14, 2023'),
(11, 'Vitra Bauhaus', 'Weil am Rhein Crafting Works', 'VIT-CH-04', 'Switzerland', 'CH', 2210, '["FURNITURE", "STORAGE"]', 'ACTIVE', '/brands/vitra.svg', 'Sep 08, 2023'),
(12, 'Muuto Elements', 'Copenhagen Nordic Collective', 'MUU-DK-90', 'Denmark', 'DK', 1340, '["LIGHTING", "DECOR"]', 'ACTIVE', '/brands/muuto.svg', 'Aug 29, 2023'),
(13, 'Flos Illuminazione', 'Brescia Industrial Group', 'FLO-IT-77', 'Italy', 'IT', 1890, '["LIGHTING"]', 'ACTIVE', '/brands/flos.svg', 'Aug 20, 2023'),
(14, 'Marset Barcelona', 'Catalonia Precision Lighting', 'MAR-ES-15', 'Spain', 'ES', 510, '["LIGHTING", "DECOR"]', 'DRAFT', '/brands/marset.svg', 'Aug 15, 2023'),
(15, 'Hay Contemporary', 'Horsens Danish Design Corp', 'HAY-DK-44', 'Denmark', 'DK', 1670, '["FURNITURE", "KITCHEN", "DECOR"]', 'ACTIVE', '/brands/hay.svg', 'Jul 30, 2023')
ON DUPLICATE KEY UPDATE 
brand_name = VALUES(brand_name),
manufacturer = VALUES(manufacturer),
country = VALUES(country),
country_code = VALUES(country_code),
offerings_count = VALUES(offerings_count),
categories = VALUES(categories),
status = VALUES(status),
logo_url = VALUES(logo_url),
updated_date = VALUES(updated_date);
