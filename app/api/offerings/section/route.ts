import { NextRequest, NextResponse } from 'next/server';
import { getHomesMerryDbPool } from '@/lib/db/homesmerry';
import { getSessionFromRequest } from '@/lib/auth/account';
import { ensureAuthSchema } from '@/lib/auth/ensure';
import { trySpring } from '@/lib/api/spring';

const SECTIONS = ['PRICING', 'INVENTORY', 'MEDIA', 'SEO', 'SPECIFICATIONS', 'INTERNAL'] as const;
type Section = (typeof SECTIONS)[number];

function requireCatalogUser(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || (session.role !== 'enterprise' && session.role !== 'admin')) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Only admin or enterprise users can manage offerings.' },
        { status: 403 }
      ),
    };
  }
  return { session };
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireCatalogUser(request);
    if ('error' in auth && auth.error) return auth.error;
    const session = auth.session!;

    const body = await request.json();
    const prodId = Number(body.prodId);
    const section = String(body.section || '').toUpperCase() as Section;
    if (!prodId) {
      return NextResponse.json({ success: false, error: 'prodId is required.' }, { status: 400 });
    }
    if (!SECTIONS.includes(section)) {
      return NextResponse.json({ success: false, error: 'Unknown offering section.' }, { status: 400 });
    }

    await ensureAuthSchema();
    const pool = getHomesMerryDbPool();
    const ownerSql = session.role === 'admin' ? 'prod_id = ?' : 'prod_id = ? AND created_by = ?';
    const ownerParams = session.role === 'admin' ? [prodId] : [prodId, session.id];
    const [existing]: any = await pool.query(
      `SELECT prod_id, sku_id, url_slug FROM product WHERE ${ownerSql} LIMIT 1`,
      ownerParams
    );
    if (!Array.isArray(existing) || !existing[0]) {
      return NextResponse.json({ success: false, error: 'Offering not found.' }, { status: 404 });
    }

    const sku = String(body.sku_id || existing[0].sku_id || '');
    const slug = String(body.url_slug || existing[0].url_slug || '');
    const payload = body.payload || {};

    let springPath = '';
    if (section === 'PRICING') springPath = `/pricing/updatePricing/${prodId}`;
    if (section === 'INVENTORY') {
      if (!sku) {
        return NextResponse.json({ success: false, error: 'sku_id is required to update inventory.' }, { status: 400 });
      }
      springPath = `/inventory/updateInventory/${encodeURIComponent(sku)}`;
    }
    if (section === 'MEDIA') springPath = `/media/updateMedia/${prodId}`;
    if (section === 'SEO') {
      if (!slug) {
        return NextResponse.json({ success: false, error: 'url_slug is required to update SEO.' }, { status: 400 });
      }
      springPath = `/seo/updateSEO/${encodeURIComponent(slug)}`;
    }
    if (section === 'SPECIFICATIONS') springPath = `/specifications/updateSpecifications/${prodId}`;
    if (section === 'INTERNAL') springPath = `/internal/updateInternal/${prodId}`;

    const spring = await trySpring(springPath, payload, 'PUT');
    await persistSection(pool, prodId, section, payload);

    return NextResponse.json({
      success: true,
      message: `${section.charAt(0)}${section.slice(1).toLowerCase()} updated`,
      prodId,
      section,
      spring,
    });
  } catch (error: any) {
    console.error('[API /api/offerings/section PUT]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update offering section' },
      { status: 500 }
    );
  }
}

async function persistSection(pool: ReturnType<typeof getHomesMerryDbPool>, prodId: number, section: Section, payload: any) {
  if (section === 'PRICING') {
    await pool.query(
      `UPDATE product SET cost_price=?, selling_price=?, discount=?, gst_rate=?, price_unit=?, pricing_desc=? WHERE prod_id=?`,
      [
        Number(payload.cost_price) || 0,
        Number(payload.selling_price) || 0,
        Number(payload.discount) || 0,
        payload.gst_rate || 'GST_18',
        payload.units || 'PER_PIECE',
        payload.desc || '',
        prodId,
      ]
    );
    return;
  }

  if (section === 'INVENTORY') {
    await pool.query(
      `UPDATE product SET current_stock=?, minimum_stock_level=?, reorder_quantity=?, preferred_vendor=?, lead_time=?, inventory_sku_id=? WHERE prod_id=?`,
      [
        Number(payload.current_stock) || 0,
        Number(payload.minimum_stock_level) || 0,
        Number(payload.reorder_quantity) || 0,
        payload.sourcingLogistics?.preferred_vendor || '',
        Number(payload.sourcingLogistics?.lead_time) || 0,
        payload.sku_Id || '',
        prodId,
      ]
    );
    if (payload.barcode != null) {
      await pool.query(`UPDATE product SET barcode=? WHERE prod_id=?`, [payload.barcode, prodId]).catch(() => undefined);
    }
    return;
  }

  if (section === 'MEDIA') {
    await pool.query(
      `UPDATE product SET primary_image=?, gallery_images=?, video_link=? WHERE prod_id=?`,
      [
        payload.primary_image || '',
        JSON.stringify(payload.gallery_images || []),
        payload.video_link || '',
        prodId,
      ]
    );
    return;
  }

  if (section === 'SEO') {
    await pool.query(
      `UPDATE product SET page_title=?, meta_desc=?, url_slug=?, seo_keywords=? WHERE prod_id=?`,
      [
        payload.page_title || '',
        payload.meta_desc || '',
        payload.url_slug || '',
        JSON.stringify(payload.keywords || []),
        prodId,
      ]
    );
    return;
  }

  if (section === 'SPECIFICATIONS') {
    const dims = payload.physical_dimensions || {};
    const finish = payload.material_finish || {};
    await pool.query(
      `UPDATE product SET length_cm=?, width_cm=?, height_cm=?, weight_kg=?, primary_material=?, secondary_material=?, finish_type=? WHERE prod_id=?`,
      [
        Number(dims.length) || 0,
        Number(dims.width) || 0,
        Number(dims.height) || 0,
        Number(dims.weight) || 0,
        finish.primary_material || '',
        finish.secondary_material || '',
        finish.finish_type || '',
        prodId,
      ]
    );
    return;
  }

  const vis = payload.visibility_status || {};
  const access = payload.access_permissions || {};
  const published = String(vis.publishing_status || '').toUpperCase() === 'PUBLISHED';
  await pool.query(
    `UPDATE product SET publishing_status=?, is_published=?, visibility=?, restricted_region=?, allowed_users=? WHERE prod_id=?`,
    [
      vis.publishing_status || 'DRAFT',
      published ? 1 : 0,
      vis.visibility === false ? 0 : 1,
      access.restricted_region || 'NONE',
      JSON.stringify(access.allowed_users || []),
      prodId,
    ]
  );
}
