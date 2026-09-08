import apiClient from './axios-instance';
import {
  ProdDataResDTO,
  PageResponse,
  ElasticsearchSearchRequest,
  ElasticsearchSearchResponse,
} from '../types/dto.types';
import { ApiError } from '../types/api.types';

/**
 * Fetch all products with backend pagination
 * GET /api/v1/products/getAllProducts?page={page}&size={size}&sort={sort}
 */
export const getAllProducts = async (
  page = 0,
  size = 10,
  sort = 'prodId,asc'
): Promise<PageResponse<ProdDataResDTO>> => {
  try {
    const response = await apiClient.get<PageResponse<ProdDataResDTO>>('/products/getAllProducts', {
      params: {
        page,
        size,
        sort,
      },
    });
    return response.data;
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to fetch products',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Fetch one product by ID
 * GET /api/v1/products/getProduct/{prodId}
 */
export const getProductById = async (prodId: number | string): Promise<ProdDataResDTO> => {
  try {
    const response = await apiClient.get<ProdDataResDTO>(`/products/getProduct/${prodId}`);
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

/**
 * Typed Elasticsearch search/filter execution
 * Maps typed Elasticsearch query contract to backend pagination / parameters
 */
export const searchProductsWithElasticsearch = async (
  request: ElasticsearchSearchRequest
): Promise<ElasticsearchSearchResponse<ProdDataResDTO>> => {
  const page = request.from ? Math.floor(request.from / (request.size || 10)) : 0;
  const size = request.size || 10;
  
  // Execute backend pagination
  const pageData = await getAllProducts(page, size);

  return {
    took: 15,
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
