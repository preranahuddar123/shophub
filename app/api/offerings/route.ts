import { NextRequest, NextResponse } from 'next/server';
import { getHomesMerryDbPool } from '@/lib/db/homesmerry';

const SPRING_BOOT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

function toSpringPayload(body: any) {
  return {
    offering_name: body.offering_name,
    offering_type: body.offering_type || 'PRODUCT',
    sku_id: body.sku_id,
    category: String(body.category || 'FURNITURE').toUpperCase(),
    brand: body.brand,
    brand_id: body.brand_id != null ? Number(body.brand_id) : undefined,
    tags: Array.isArray(body.tags) ? body.tags : [],
    short_desc: body.short_desc || body.offering_name,
    long_desc: body.long_desc || body.short_desc || body.offering_name,
    featured_offer: Boolean(body.featured_offer),
    is_published: Boolean(body.is_published),
    pricing: body.pricing,
    inventory: body.inventory,
    media: body.media,
    specifications: body.specifications,
    seo: body.seo,
    internal: body.internal,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = toSpringPayload(body);

    if (!payload.offering_name || !payload.sku_id) {
      return NextResponse.json(
        { success: false, error: 'offering_name and sku_id are required.' },
        { status: 400 }
      );
    }

    let springRes: Response;
    try {
      springRes = await fetch(`${SPRING_BOOT_BASE_URL}/products/createProduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot reach ${SPRING_BOOT_BASE_URL}/products/createProduct (${err?.cause?.code || err.message}). Start Spring Boot on port 8080.`,
        },
        { status: 502 }
      );
    }

    const springText = await springRes.text();
    let springJson: any = null;
    try {
      springJson = springText ? JSON.parse(springText) : null;
    } catch {
      springJson = { raw: springText };
    }

    if (!springRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            springJson?.message ||
            springJson?.error ||
            `Spring createProduct failed (${springRes.status})`,
          status: springRes.status,
          details: springJson,
        },
        { status: springRes.status }
      );
    }

    try {
      const pool = getHomesMerryDbPool();
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
          ?, '[]', '["admin@example.com"]', ?,
          ?, ?, ?, ?, ?,
          'NONE', ?, ?, ?, ?, ?, ?,
          'Standard pricing', ?, ?, ?, ?, 1, 1, 1, 1
        )`,
        [
          payload.offering_name,
          payload.offering_type,
          payload.sku_id,
          payload.category,
          payload.brand || '',
          Number(payload.inventory?.current_stock) || 0,
          Number(payload.pricing?.selling_price) || 0,
          Number(payload.pricing?.cost_price) || 0,
          payload.is_published ? 1 : 0,
          payload.is_published ? 'PUBLISHED' : 'DRAFT',
          JSON.stringify(payload.media?.gallery_images || []),
          JSON.stringify(payload.seo?.keywords || payload.tags || []),
          payload.specifications?.material_finish?.finish_type || 'MATTE',
          payload.specifications?.technical_properties?.load_capacity || 'UP_TO_200_KG',
          payload.inventory?.sourcingLogistics?.preferred_vendor || '',
          payload.specifications?.material_finish?.primary_material || 'SOLID_WOOD',
          payload.specifications?.material_finish?.secondary_material || '',
          payload.pricing?.gst_rate || 'GST_18',
          payload.pricing?.units || 'PER_PIECE',
          Number(payload.pricing?.discount) || 0,
          Number(payload.inventory?.sourcingLogistics?.lead_time) || 0,
          Number(payload.inventory?.minimum_stock_level) || 0,
          Number(payload.inventory?.reorder_quantity) || 0,
          payload.short_desc,
          payload.long_desc,
          payload.sku_id,
          payload.featured_offer ? 1 : 0,
        ]
      );

      if (payload.brand) {
        await pool.query(
          `UPDATE brands SET offerings_count = offerings_count + 1 WHERE brand_name = ?`,
          [payload.brand]
        );
      }
    } catch (dbErr: any) {
      console.warn('[API /api/offerings POST] Local catalog insert skipped:', dbErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: `Offering "${payload.offering_name}" created`,
      product: springJson,
    });
  } catch (error: any) {
    console.error('[API /api/offerings POST] Error creating offering:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create offering' },
      { status: 500 }
    );
  }
}
