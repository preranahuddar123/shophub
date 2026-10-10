import type { CreateProductPayload } from './offering-save';

function normKey(key: string) {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function pick(row: Record<string, unknown>, aliases: string[]) {
  const map: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    map[normKey(key)] = value;
  }
  for (const alias of aliases) {
    const value = map[normKey(alias)];
    if (value != null && String(value).trim() !== '') return value;
  }
  return '';
}

function asString(value: unknown) {
  return String(value ?? '').trim();
}

function asNumber(value: unknown) {
  if (value == null || value === '') return 0;
  const n = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function asBool(value: unknown) {
  const text = asString(value).toLowerCase();
  return ['1', 'true', 'yes', 'y', 'published', 'active'].includes(text);
}

function asList(value: unknown) {
  if (Array.isArray(value)) return value.map(asString).filter(Boolean);
  return asString(value)
    .split(/[,|;]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function excelRowToProduct(row: Record<string, unknown>): CreateProductPayload | null {
  const offering_name = asString(pick(row, ['offering_name', 'name', 'product_name', 'product', 'title', 'offering']));
  const sku_id = asString(pick(row, ['sku_id', 'sku', 'sku id', 'skuid']));
  if (!offering_name || !sku_id) return null;

  const category = asString(pick(row, ['category', 'primary_category'])).toUpperCase() || 'FURNITURE';
  const brand = asString(pick(row, ['brand', 'brand_name']));
  const brandIdRaw = pick(row, ['brand_id']);
  const tags = asList(pick(row, ['tags', 'tag']));
  const keywords = asList(pick(row, ['keywords', 'seo_keywords'])) || tags;
  const short_desc = asString(pick(row, ['short_desc', 'short_description', 'description', 'desc'])) || offering_name;
  const long_desc = asString(pick(row, ['long_desc', 'long_description'])) || short_desc;
  const selling_price = asNumber(pick(row, ['selling_price', 'price', 'mrp', 'sale_price']));
  const cost_price = asNumber(pick(row, ['cost_price', 'cost']));
  const discount = asNumber(pick(row, ['discount']));
  const current_stock = asNumber(pick(row, ['current_stock', 'stock', 'qty', 'quantity']));
  const is_published = asBool(pick(row, ['is_published', 'published', 'status']));

  return {
    offering_name,
    offering_type: asString(pick(row, ['offering_type', 'type'])) || 'PRODUCT',
    sku_id,
    category,
    brand,
    brand_id: brandIdRaw === '' ? undefined : asNumber(brandIdRaw) || undefined,
    tags,
    short_desc,
    long_desc,
    featured_offer: asBool(pick(row, ['featured_offer', 'featured'])),
    is_published,
    pricing: {
      cost_price,
      selling_price,
      discount,
      gst_rate: asString(pick(row, ['gst_rate', 'gst'])) || 'GST_18',
      units: asString(pick(row, ['units', 'price_unit', 'uom'])) || 'PER_PIECE',
      desc: asString(pick(row, ['pricing_desc'])) || undefined,
    },
    inventory: {
      sku_Id: sku_id,
      barcode: asString(pick(row, ['barcode'])),
      current_stock,
      minimum_stock_level: asNumber(pick(row, ['minimum_stock_level', 'min_stock'])),
      reorder_quantity: asNumber(pick(row, ['reorder_quantity', 'reorder'])),
      sourcingLogistics: {
        preferred_vendor: asString(pick(row, ['preferred_vendor', 'vendor'])) || 'IN_HOUSE',
        lead_time: asNumber(pick(row, ['lead_time'])),
      },
    },
    media: {
      primary_image: asString(pick(row, ['primary_image', 'image', 'image_url', 'imageurl'])),
      gallery_images: asList(pick(row, ['gallery_images', 'gallery'])),
      video_link: asString(pick(row, ['video_link', 'video'])),
      image_360: asString(pick(row, ['image_360'])),
    },
    specifications: {
      physical_dimensions: {
        length: asNumber(pick(row, ['length', 'length_cm'])),
        width: asNumber(pick(row, ['width', 'width_cm'])),
        height: asNumber(pick(row, ['height', 'height_cm'])),
        weight: asNumber(pick(row, ['weight', 'weight_kg'])),
      },
      material_finish: {
        primary_material: asString(pick(row, ['primary_material', 'material'])) || 'SOLID_WOOD',
        secondary_material: asString(pick(row, ['secondary_material'])),
        finish_type: asString(pick(row, ['finish_type', 'finish'])) || 'MATTE',
      },
      technical_properties: {
        load_capacity: asString(pick(row, ['load_capacity'])) || 'UP_TO_200_KG',
        desc: asString(pick(row, ['care_instructions'])),
      },
    },
    seo: {
      page_title: asString(pick(row, ['page_title', 'seo_title'])) || offering_name,
      meta_desc: asString(pick(row, ['meta_desc', 'seo_description'])) || short_desc,
      url_slug: asString(pick(row, ['url_slug', 'slug'])) || slugify(offering_name),
      keywords,
    },
    internal: {
      visibility_status: {
        publishing_status: is_published ? 'PUBLISHED' : 'DRAFT',
        visibility: true,
      },
    },
  };
}

export const PRODUCT_IMPORT_TEMPLATE_HEADERS = [
  'offering_name',
  'sku_id',
  'offering_type',
  'category',
  'brand',
  'brand_id',
  'tags',
  'short_desc',
  'long_desc',
  'selling_price',
  'cost_price',
  'discount',
  'gst_rate',
  'units',
  'current_stock',
  'minimum_stock_level',
  'reorder_quantity',
  'preferred_vendor',
  'lead_time',
  'primary_image',
  'length',
  'width',
  'height',
  'weight',
  'primary_material',
  'finish_type',
  'page_title',
  'meta_desc',
  'url_slug',
  'keywords',
  'is_published',
  'featured_offer',
];
