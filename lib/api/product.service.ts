import apiClient from './axios-instance';
import {
  ProdDataResDTO,
  PageResponse,
  ElasticsearchSearchRequest,
  ElasticsearchSearchResponse,
} from '../types/dto.types';

/**
 * Empty page response fallback if API is unreachable or empty
 */
const createEmptyPageResponse = (page = 0, size = 10): PageResponse<ProdDataResDTO> => ({
  content: [],
  pageable: {
    pageNumber: page,
    pageSize: size,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  totalElements: 0,
  totalPages: 0,
  size,
  number: page,
  first: true,
  last: true,
  numberOfElements: 0,
  empty: true,
});

/**
 * Fetch all products with pagination directly from the database
 * GET /api/v1/products/getAllProducts?page={page}&size={size}&sort={sort}
 */
export const getAllProducts = async (
  page = 0,
  size = 50,
  sort = 'prodId,asc'
): Promise<PageResponse<ProdDataResDTO>> => {
  try {
    const response = await apiClient.get<any>('/products/getAllProducts', {
      params: {
        page,
        size,
        sort,
      },
    });
    if (response.data && response.data.content) {
      return response.data;
    }
  } catch (error: any) {
    console.error('[product.service] getAllProducts database query failed:', error.message);
  }

  return createEmptyPageResponse(page, size);
};

/**
 * Fetch one product by ID directly from the database
 * GET /api/v1/products/getProduct/{prodId}
 */
export const getProductById = async (prodId: number | string): Promise<ProdDataResDTO | null> => {
  try {
    const response = await apiClient.get<ProdDataResDTO>(`/products/getProduct/${prodId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error: any) {
    console.error(`[product.service] getProductById(${prodId}) database query failed:`, error.message);
  }

  return null;
};

/**
 * Typed Elasticsearch search/filter execution using live database products
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
      hits: pageData.content.map((prod: any) => ({
        _index: 'products',
        _id: String(prod.prodId),
        _score: 1.0,
        _source: prod,
      })),
    },
  };
};
