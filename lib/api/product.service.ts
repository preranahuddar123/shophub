import apiClient from './axios-instance';
import { ApiError } from '../types/api.types';
import { OfferingResponseDto } from '../types/dto.types';

/**
 * Fetch all products with backend pagination
 * GET /api/v1/products/getAllProducts?page={page}&size={size}&sort={sort}
 */
export const getAllProducts = async (
  page = 0,
  size = 50,
  sort = 'prodId,asc'
): Promise<any> => {
  try {
    const response = await apiClient.get<any>('/products/getAllProducts', {
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
 * Convenience helper to return flat array of products from the Page response
 */
export const fetchCatalogProducts = async (): Promise<any[]> => {
  try {
    const data = await getAllProducts(0, 100);
    if (data && Array.isArray(data.content)) {
      return data.content;
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch catalog products:', err);
    return [];
  }
};

/**
 * Fetch one product by ID
 * GET /api/v1/products/getProduct/{prodId}
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
