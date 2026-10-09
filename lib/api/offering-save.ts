export type OfferingSection = 'PRICING' | 'INVENTORY' | 'MEDIA' | 'SEO' | 'SPECIFICATIONS' | 'INTERNAL';

export interface CreateProductPayload {
  offering_name: string;
  offering_type: string;
  sku_id: string;
  category: string;
  brand_id?: number;
  brand?: string;
  tags?: string[];
  short_desc?: string;
  long_desc?: string;
  featured_offer?: boolean;
  is_published?: boolean;
  pricing?: Record<string, unknown>;
  inventory?: Record<string, unknown>;
  media?: Record<string, unknown>;
  specifications?: Record<string, unknown>;
  seo?: Record<string, unknown>;
  internal?: Record<string, unknown>;
}

export async function createProduct(payload: CreateProductPayload, prodId?: number | string | null) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const response = await fetch(`${origin}/api/offerings`, {
    method: prodId ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(prodId ? { ...payload, prodId } : payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || data?.message || 'Failed to save offering');
  }
  return data;
}

export async function updateOfferingSection(input: {
  prodId: number | string;
  section: OfferingSection;
  sku_id?: string;
  url_slug?: string;
  payload: Record<string, unknown>;
}) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const response = await fetch(`${origin}/api/offerings/section`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data?.error || data?.message || `Failed to update ${input.section.toLowerCase()}`);
  }
  return data;
}
