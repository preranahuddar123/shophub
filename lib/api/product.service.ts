<<<<<<< HEAD
import {
  ProdDataResDTO,
  PageResponse,
  ElasticsearchSearchRequest,
  ElasticsearchSearchResponse,
} from '../types/dto.types';

// Rich dummy products matching the application design and screenshots
export const DUMMY_PRODUCTS: ProdDataResDTO[] = [
  {
    prodId: 1,
    offering_name: 'Aero Suede Lounge',
    offering_type: 'PRODUCT',
    sku_id: 'AS-LX-2024-CH',
    category: 'FURNITURE',
    brand: 'Executive Series',
    pricing: {
      selling_price: 3450,
      cost_price: 2070,
      discount: 0,
      gst_rate: '18%',
      units: 'piece',
      margin_percentage: 40.0,
      desc: 'Executive Lounge Seating',
    },
    inventory: {
      sku_Id: 'AS-LX-2024-CH',
      current_stock: 50,
      minimum_stock_level: 15,
      reorder_quantity: 20,
      sourcingLogistics: {
        preferred_vendor: 'Nordic Design Collective (NDC)',
        lead_time: 28,
      },
    },
    internal: {
      visibility_status: {
        publishing_status: 'PUBLISHED',
        visibility: true,
      },
    },
    media: {
      primary_image: '/images/offerings/aero-suede-hero.jpg',
      gallery_images: [
        '/images/offerings/thumb-suede.jpg',
        '/images/offerings/thumb-side.jpg',
        '/images/offerings/thumb-room.jpg',
      ],
    },
    specifications: {
      material_finish: {
        primary_material: 'Aniline Suede (Grade A)',
        finish_type: 'Matte Carbon Aluminum',
      },
      physical_dimensions: {
        length: 820,
        width: 780,
        height: 940,
        weight: 24,
      },
      technical_properties: {
        load_capacity: 'Up to 150kg (330lbs)',
      },
    },
  },
  {
    prodId: 2,
    offering_name: 'Aura Executive Task Chair',
    offering_type: 'PRODUCT',
    sku_id: 'AU-EX-2024',
    category: 'FURNITURE',
    brand: 'Executive Series',
    pricing: {
      selling_price: 4800,
      cost_price: 2880,
      discount: 5,
      gst_rate: '18%',
      units: 'piece',
      margin_percentage: 40.0,
      desc: 'High ergonomic task chair',
    },
    inventory: {
      sku_Id: 'AU-EX-2024',
      current_stock: 25,
      minimum_stock_level: 10,
      reorder_quantity: 15,
      sourcingLogistics: {
        preferred_vendor: 'Nordic Design Collective (NDC)',
        lead_time: 14,
      },
    },
    internal: {
      visibility_status: {
        publishing_status: 'PUBLISHED',
        visibility: true,
      },
    },
    media: {
      primary_image: '/images/products/aura-chair.svg',
    },
  },
  {
    prodId: 3,
    offering_name: 'Lumina Architectural Desk Lamp',
    offering_type: 'PRODUCT',
    sku_id: 'LM-DK-2024',
    category: 'LIGHTING',
    brand: 'Lumina Series',
    pricing: {
      selling_price: 1850,
      cost_price: 1110,
      discount: 0,
      gst_rate: '18%',
      units: 'piece',
      margin_percentage: 40.0,
      desc: 'Precision balanced task lighting',
    },
    inventory: {
      sku_Id: 'LM-DK-2024',
      current_stock: 18,
      minimum_stock_level: 8,
      reorder_quantity: 10,
      sourcingLogistics: {
        preferred_vendor: 'Apex Studio Lighting',
        lead_time: 7,
      },
    },
    internal: {
      visibility_status: {
        publishing_status: 'PUBLISHED',
        visibility: true,
      },
    },
    media: {
      primary_image: '/images/products/lumina-desk.svg',
    },
  },
  {
    prodId: 4,
    offering_name: 'Elite Executive Workspace Bundle',
    offering_type: 'PRODUCT',
    sku_id: 'EW-MD-2024',
    category: 'FURNITURE',
    brand: 'Studio System',
    pricing: {
      selling_price: 12500,
      cost_price: 7500,
      discount: 10,
      gst_rate: '18%',
      units: 'set',
      margin_percentage: 40.0,
      desc: 'Full executive office setup',
    },
    inventory: {
      sku_Id: 'EW-MD-2024',
      current_stock: 6,
      minimum_stock_level: 5,
      reorder_quantity: 5,
      sourcingLogistics: {
        preferred_vendor: 'Nordic Design Collective (NDC)',
        lead_time: 30,
      },
    },
    internal: {
      visibility_status: {
        publishing_status: 'PUBLISHED',
        visibility: true,
      },
    },
    media: {
      primary_image: '/images/products/elite-workspace.svg',
    },
  },
  {
    prodId: 5,
    offering_name: 'Quantum Precision Workstation Setup',
    offering_type: 'SERVICE',
    sku_id: 'SRV-QNT-01',
    category: 'OTHER',
    brand: 'Pro Services',
    pricing: {
      selling_price: 2400,
      cost_price: 1200,
      discount: 0,
      gst_rate: '18%',
      units: 'service',
      margin_percentage: 50.0,
      desc: 'On-site ergonomic calibration',
    },
    inventory: {
      sku_Id: 'SRV-QNT-01',
      current_stock: 999,
      minimum_stock_level: 0,
      reorder_quantity: 0,
      sourcingLogistics: {
        preferred_vendor: 'ShopHub Engineering Services',
        lead_time: 1,
      },
    },
    internal: {
      visibility_status: {
        publishing_status: 'PUBLISHED',
        visibility: true,
      },
    },
    media: {
      primary_image: '/images/products/quantum-key-pro.svg',
    },
  },
];

/**
 * Fetch all products with pagination - uses standalone dummy data for UI testing
=======
import apiClient from './axios-instance';
import { ApiError } from '../types/api.types';
import { OfferingResponseDto } from '../types/dto.types';

/**
 * Fetch all products with backend pagination
 * GET /api/v1/products/getAllProducts?page={page}&size={size}&sort={sort}
 * 
 * @deprecated Use Elasticsearch service instead (lib/api/elasticsearch.service.ts)
>>>>>>> origin/feature/offerings-ui
 */
export const getAllProducts = async (
  page = 0,
  size = 10,
<<<<<<< HEAD
  _sort = 'prodId,asc'
): Promise<PageResponse<ProdDataResDTO>> => {
  const start = page * size;
  const paginatedItems = DUMMY_PRODUCTS.slice(start, start + size);

  return {
    content: paginatedItems,
    pageable: {
      pageNumber: page,
      pageSize: size,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
=======
  sort = 'prodId,asc'
): Promise<any> => {
  try {
    const response = await apiClient.get<any>('/products/getAllProducts', {
      params: {
        page,
        size,
        sort,
>>>>>>> origin/feature/offerings-ui
      },
      offset: start,
      paged: true,
      unpaged: false,
    },
    totalElements: DUMMY_PRODUCTS.length,
    totalPages: Math.ceil(DUMMY_PRODUCTS.length / size),
    size,
    number: page,
    first: page === 0,
    last: start + size >= DUMMY_PRODUCTS.length,
    numberOfElements: paginatedItems.length,
    empty: paginatedItems.length === 0,
  };
};

/**
<<<<<<< HEAD
 * Fetch one product by ID - uses standalone dummy data
 */
export const getProductById = async (prodId: number | string): Promise<ProdDataResDTO> => {
  const product =
    DUMMY_PRODUCTS.find(
      (p) => String(p.prodId) === String(prodId) || p.sku_id === String(prodId)
    ) || DUMMY_PRODUCTS[0];

  return product;
};

/**
 * Typed Elasticsearch search/filter execution using dummy data
 */
export const searchProductsWithElasticsearch = async (
  request: ElasticsearchSearchRequest
): Promise<ElasticsearchSearchResponse<ProdDataResDTO>> => {
  const page = request.from ? Math.floor(request.from / (request.size || 10)) : 0;
  const size = request.size || 10;
  const pageData = await getAllProducts(page, size);

  return {
    took: 10,
    timed_out: false,
    hits: {
      total: {
        value: pageData.totalElements,
        relation: 'eq',
      },
      max_score: 1.0,
      hits: pageData.content.map((prod) => ({
        _index: 'products',
        _id: String(prod.prodId),
        _score: 1.0,
        _source: prod,
      })),
    },
  };
};
=======
 * Fetch one product by ID
 * GET /api/v1/products/getProduct/{prodId}
 * 
 * @deprecated Use Elasticsearch service instead (lib/api/elasticsearch.service.ts)
 */
export const getProductById = async (prodId: number | string): Promise<OfferingResponseDto> => {
  try {
    const response = await apiClient.get<OfferingResponseDto>(`/products/getProduct/${prodId}`);
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to fetch product details',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

>>>>>>> origin/feature/offerings-ui
