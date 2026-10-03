/**
 * ==============================================================================
 * FILE: app/api/offerings/route.ts
 * PURPOSE: Offering Creation Handler (Spring Boot + Apidog Integration)
 * ==============================================================================
 * WHY THIS FILE WAS CREATED:
 * Powers the "+ CREATE OFFERING" action modal in the top navigation header:
 * 1. Takes user input (offering name, SKU, category, brand, price, cost, stock, desc).
 * 2. Structures the exact JSON payload expected by the Spring Boot endpoint
 *    `POST /api/v1/products/createProduct` (Apidog: `ProductService_CreateProduct`).
 * 3. Dispatches the creation request to the live Spring Boot service on port 8080.
 * 4. Automatically increments the `offerings_count` of the chosen brand in MySQL
 *    `homes_merry.brands` so the table and stats reflect the new offering instantly.
 * ==============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHomesMerryDbPool } from '@/lib/db/homesmerry';

const SPRING_BOOT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const {
      offering_name,
      offering_type = 'PRODUCT',
      sku_id,
      category,
      brand,
      selling_price = 0,
      cost_price = 0,
      current_stock = 0,
      short_desc = '',
      publishing_status = 'PUBLISHED',
    } = body;

    if (!offering_name || !sku_id || !brand) {
      return NextResponse.json(
        { success: false, error: 'offering_name, sku_id, and brand are required.' },
        { status: 400 }
      );
    }

    // 1. First attempt to call the Spring Boot API (Apidog ProductService_CreateProduct)
    let springCreated = false;
    try {
      const springPayload = {
        offering_name,
        offering_type,
        sku_id,
        category: (category || 'FURNITURE').toUpperCase(),
        brand,
        tags: [category?.toLowerCase() || 'offering'],
        short_desc: short_desc || offering_name,
        long_desc: short_desc || offering_name,
        featured_offer: false,
        pricing: {
          cost_price: Number(cost_price) || 0,
          selling_price: Number(selling_price) || 0,
          discount: 0,
          gst_rate: 'GST_18',
          units: 'PER_PIECE',
          desc: 'Standard catalog pricing',
        },
        inventory: {
          sku_Id: sku_id,
          barcode: '890' + Math.floor(1000000000 + Math.random() * 9000000000),
          current_stock: Number(current_stock) || 0,
          minimum_stock_level: 5,
          reorder_quantity: 10,
          sourcingLogistics: {
            preferred_vendor: 'VENDOR_A',
            lead_time: 7,
          },
        },
        media: {
          primary_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
          gallery_images: [],
          video_link: '',
          image_360: '',
          product_brochure: '',
          upload_draw: '',
        },
        specifications: {
          physical_dimensions: { length: 100, width: 80, height: 75, weight: 25 },
          material_finish: { primary_material: 'SOLID_WOOD', secondary_material: 'METAL', finish_type: 'MATTE' },
          technical_properties: { assembly_required: false, load_capacity: 'UP_TO_200_KG', desc: '' },
          additional_attributes: [],
        },
        seo: {
          page_title: `${offering_name} - ${brand}`,
          meta_desc: short_desc || offering_name,
          url_slug: offering_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          keywords: [brand.toLowerCase(), category?.toLowerCase() || 'offering'],
        },
        internal: {
          visibility_status: {
            publishing_status,
            visibility: publishing_status === 'PUBLISHED',
            schedule_launch: null,
          },
          access_permissions: { allowed_users: ['admin@example.com'], restricted_region: 'NONE' },
          system_hooks_integration: {
            erp_module_integration: { sales_module: true, inventory_sync: true, procurement_pipeline: true, accounting_code: null },
          },
          audit_trail_notes: null,
        },
      };

      const res = await fetch(`${SPRING_BOOT_BASE_URL}/products/createProduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(springPayload),
      });

      if (res.ok) {
        springCreated = true;
      }
    } catch (err: any) {
      console.warn('[Offerings API] Spring Boot endpoint error, falling back to direct DB insert:', err.message);
    }

    // 2. Direct MySQL insert if Spring Boot failed or direct database persistence
    const pool = getHomesMerryDbPool();

    if (!springCreated) {
      await pool.query(
        `INSERT INTO product (
          offering_name, offering_type, sku_id, category, brand, current_stock,
          selling_price, cost_price, is_published, publishing_status,
          gallery_images, additional_attributes, allowed_users, seo_keywords,
          finish_type, load_capacity, preferred_vendor, primary_material, secondary_material,
          restricted_region, gst_rate, price_unit, discount, lead_time, minimum_stock_level, reorder_quantity,
          pricing_desc, short_desc, long_desc, inventory_sku_id, featured_offer, inventory_sync, procurement_pipeline, sales_module, visibility
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          '[]', '[]', '["admin@example.com"]', '[]',
          'MATTE', 'UP_TO_200_KG', 'VENDOR_A', 'SOLID_WOOD', 'METAL',
          'NONE', 'GST_18', 'PER_PIECE', 0, 7, 5, 10,
          'Standard pricing', ?, ?, ?, 0, 1, 1, 1, 1
        )`,
        [
          offering_name,
          offering_type,
          sku_id,
          (category || 'FURNITURE').toUpperCase(),
          brand,
          Number(current_stock) || 0,
          Number(selling_price) || 0,
          Number(cost_price) || 0,
          publishing_status === 'PUBLISHED' ? 1 : 0,
          publishing_status,
          short_desc || offering_name,
          short_desc || offering_name,
          sku_id,
        ]
      );
    }

    // 3. Increment offerings count for this brand in the brands table
    await pool.query(
      `UPDATE brands SET offerings_count = offerings_count + 1 WHERE brand_name = ?`,
      [brand]
    );

    return NextResponse.json({
      success: true,
      message: `Offering "${offering_name}" created successfully for ${brand}`,
    });
  } catch (error: any) {
    console.error('[API /api/offerings POST] Error creating offering:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create offering' },
      { status: 500 }
    );
  }
}
