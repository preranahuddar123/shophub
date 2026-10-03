/**
 * ==============================================================================
 * FILE: app/api/brands/dropdown/route.ts
 * PURPOSE: Active Brands Dropdown Endpoint connecting to Spring Boot
 *          (GET /api/v1/brands/dropdown)
 * ==============================================================================
 */

import { NextResponse } from 'next/server';
import { fetchBrandDropdownFromBackend } from '@/lib/api/brand.service';
import { getHomesMerryDbPool } from '@/lib/db/homesmerry';

export async function GET() {
  try {
    // 1. Try Spring Boot backend
    const backendDropdown = await fetchBrandDropdownFromBackend();
    if (backendDropdown && backendDropdown.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'spring_boot_backend',
        brands: backendDropdown,
      });
    }

    // 2. DB fallback
    const pool = getHomesMerryDbPool();
    const [rows]: any = await pool.query(
      'SELECT id as brand_id, brand_name, code, logo_url, status FROM brands WHERE status = "ACTIVE" ORDER BY brand_name ASC'
    );

    return NextResponse.json({
      success: true,
      source: 'database_direct',
      brands: rows || [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
