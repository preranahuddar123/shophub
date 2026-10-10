export type ImportFieldGroup = 'General' | 'Pricing' | 'Inventory' | 'Media' | 'Specifications' | 'SEO';

export type ImportField = {
  key: string;
  label: string;
  group: ImportFieldGroup;
  required?: boolean;
  aliases: string[];
};

/** Create Product field key → spreadsheet column header. */
export type ColumnMapping = Record<string, string>;

export const PRODUCT_IMPORT_FIELDS: ImportField[] = [
  { key: 'offering_name', label: 'Offering name', group: 'General', required: true, aliases: ['name', 'product_name', 'product', 'title', 'offering'] },
  { key: 'sku_id', label: 'SKU ID', group: 'General', required: true, aliases: ['sku', 'sku id', 'skuid'] },
  { key: 'offering_type', label: 'Offering type', group: 'General', aliases: ['type', 'product_type'] },
  { key: 'category', label: 'Category', group: 'General', aliases: ['primary_category'] },
  { key: 'brand', label: 'Brand', group: 'General', aliases: ['brand_name'] },
  { key: 'brand_id', label: 'Brand ID', group: 'General', aliases: [] },
  { key: 'tags', label: 'Tags', group: 'General', aliases: ['tag'] },
  { key: 'short_desc', label: 'Short description', group: 'General', aliases: ['short_description', 'description', 'desc'] },
  { key: 'long_desc', label: 'Long description', group: 'General', aliases: ['long_description'] },
  { key: 'featured_offer', label: 'Featured offer', group: 'General', aliases: ['featured'] },
  { key: 'is_published', label: 'Published', group: 'General', aliases: ['published', 'status'] },
  { key: 'selling_price', label: 'Selling price', group: 'Pricing', aliases: ['price', 'mrp', 'sale_price'] },
  { key: 'cost_price', label: 'Cost price', group: 'Pricing', aliases: ['cost'] },
  { key: 'discount', label: 'Discount', group: 'Pricing', aliases: [] },
  { key: 'gst_rate', label: 'GST rate', group: 'Pricing', aliases: ['gst'] },
  { key: 'units', label: 'Price unit', group: 'Pricing', aliases: ['price_unit', 'uom'] },
  { key: 'pricing_desc', label: 'Pricing notes', group: 'Pricing', aliases: [] },
  { key: 'barcode', label: 'Barcode', group: 'Inventory', aliases: [] },
  { key: 'current_stock', label: 'Current stock', group: 'Inventory', aliases: ['stock', 'qty', 'quantity'] },
  { key: 'minimum_stock_level', label: 'Minimum stock', group: 'Inventory', aliases: ['min_stock'] },
  { key: 'reorder_quantity', label: 'Reorder quantity', group: 'Inventory', aliases: ['reorder'] },
  { key: 'preferred_vendor', label: 'Preferred vendor', group: 'Inventory', aliases: ['vendor'] },
  { key: 'lead_time', label: 'Lead time', group: 'Inventory', aliases: [] },
  { key: 'primary_image', label: 'Primary image', group: 'Media', aliases: ['image', 'image_url', 'imageurl'] },
  { key: 'gallery_images', label: 'Gallery images', group: 'Media', aliases: ['gallery'] },
  { key: 'video_link', label: 'Video link', group: 'Media', aliases: ['video'] },
  { key: 'image_360', label: '360 image', group: 'Media', aliases: [] },
  { key: 'length', label: 'Length (cm)', group: 'Specifications', aliases: ['length_cm'] },
  { key: 'width', label: 'Width (cm)', group: 'Specifications', aliases: ['width_cm'] },
  { key: 'height', label: 'Height (cm)', group: 'Specifications', aliases: ['height_cm'] },
  { key: 'weight', label: 'Weight (kg)', group: 'Specifications', aliases: ['weight_kg'] },
  { key: 'primary_material', label: 'Primary material', group: 'Specifications', aliases: ['material'] },
  { key: 'secondary_material', label: 'Secondary material', group: 'Specifications', aliases: [] },
  { key: 'finish_type', label: 'Finish type', group: 'Specifications', aliases: ['finish'] },
  { key: 'load_capacity', label: 'Load capacity', group: 'Specifications', aliases: [] },
  { key: 'care_instructions', label: 'Care instructions', group: 'Specifications', aliases: [] },
  { key: 'page_title', label: 'SEO page title', group: 'SEO', aliases: ['seo_title'] },
  { key: 'meta_desc', label: 'SEO meta description', group: 'SEO', aliases: ['seo_description'] },
  { key: 'url_slug', label: 'URL slug', group: 'SEO', aliases: ['slug'] },
  { key: 'keywords', label: 'SEO keywords', group: 'SEO', aliases: ['seo_keywords'] },
];

export const PRODUCT_IMPORT_TEMPLATE_HEADERS = PRODUCT_IMPORT_FIELDS.map((field) => field.key);

export const IMPORT_FIELD_GROUPS: ImportFieldGroup[] = [
  'General',
  'Pricing',
  'Inventory',
  'Media',
  'Specifications',
  'SEO',
];

export function normKey(key: string) {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function headerMatchesField(header: string, field: ImportField) {
  const normalized = normKey(header);
  if (normalized === normKey(field.key)) return true;
  return field.aliases.some((alias) => normKey(alias) === normalized);
}

export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const used = new Set<string>();
  const mapping: ColumnMapping = {};

  for (const field of PRODUCT_IMPORT_FIELDS) {
    const match = headers.find((header) => !used.has(header) && headerMatchesField(header, field));
    if (match) {
      mapping[field.key] = match;
      used.add(match);
    }
  }

  return mapping;
}
