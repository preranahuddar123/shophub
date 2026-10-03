/**
 * ==============================================================================
 * FILE: app/api/brands/import/route.ts
 * PURPOSE: Bulk Catalog Importer API (CSV / JSON Batch Import)
 * ==============================================================================
 * WHY THIS FILE WAS CREATED:
 * Powers the "IMPORT" button in the Brands Master page:
 * 1. Accepts batch arrays of brand/catalog records parsed from CSV or JSON in the UI.
 * 2. Validates records, assigns default codes/categories/flags if missing.
 * 3. Uses MySQL `INSERT ... ON DUPLICATE KEY UPDATE` to safely upsert records into
 *    `homes_merry.brands`.
 * 4. Returns the total count of successfully imported records.
 * ==============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHomesMerryDbPool } from '@/lib/db/homesmerry';

export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const { items, type = 'brands' } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'items array is required and must not be empty' },
        { status: 400 }
      );
    }

    const pool = getHomesMerryDbPool();
    let importedCount = 0;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    for (const item of items) {
      const brandName = item.brand_name || item.brand;
      const code = item.code || item.sku_id || `${brandName?.slice(0, 3)?.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      if (!brandName) continue;

      const manufacturer = item.manufacturer || `${brandName} Manufacturing Co.`;
      const country = item.country || 'Italy';
      const countryCode = item.country_code || 'IT';
      const offeringsCount = Number(item.offerings_count || item.current_stock || 15);
      const categoriesJson = JSON.stringify(item.categories || [item.category || 'FURNITURE']);
      const status = (item.status || item.publishing_status || 'ACTIVE').toUpperCase();
      const logoUrl = item.logo_url || '/brands/default.svg';

      await pool.query(
        `INSERT INTO brands (brand_name, manufacturer, code, country, country_code, offerings_count, categories, status, logo_url, updated_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         offerings_count = offerings_count + VALUES(offerings_count),
         updated_date = VALUES(updated_date)`,
        [brandName, manufacturer, code, country, countryCode, offeringsCount, categoriesJson, status, logoUrl, formattedDate]
      );

      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      message: `Successfully imported ${importedCount} ${type} into the Master Catalog.`,
    });
  } catch (error: any) {
    console.error('[API /api/brands/import POST] Error importing:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import data' },
      { status: 500 }
    );
  }
}
