-- ==============================================================================
-- FILE: scripts/fix_products.sql
-- PURPOSE: Fix/Sanitize MySQL product data for Spring Boot JPA entity compatibility
-- ==============================================================================
-- WHY THIS FILE WAS CREATED:
-- When testing the dynamic Spring Boot API (GET /api/v1/products/getAllProducts),
-- the backend threw a "500 Internal Server Error" (IllegalArgumentException).
-- The root cause was that several records in `homes_merry.product` had NULL in 
-- columns where the Java entity expects non-null JSON strings (e.g., gallery_images,
-- additional_attributes, allowed_users) or non-null numbers/strings.
--
-- WHAT DATA IS MODIFIED:
-- 1. gallery_images, additional_attributes, seo_keywords -> Set to empty JSON arrays '[]'
-- 2. allowed_users -> Set to '["admin@example.com"]'
-- 3. discount, lead_time, minimum_stock_level, reorder_quantity -> Default numeric fallbacks
-- 4. short_desc, long_desc, inventory_sku_id -> Populated from existing offering_name and sku_id
-- ==============================================================================

USE homes_merry;

UPDATE product SET 
    gallery_images = '[]',
    additional_attributes = '[]',
    allowed_users = '["admin@example.com"]',
    seo_keywords = '[]',
    discount = 0,
    lead_time = 7,
    minimum_stock_level = 5,
    reorder_quantity = 10,
    pricing_desc = 'Standard pricing',
    short_desc = COALESCE(short_desc, offering_name),
    long_desc = COALESCE(long_desc, offering_name),
    inventory_sku_id = COALESCE(inventory_sku_id, sku_id)
WHERE gallery_images IS NULL;

