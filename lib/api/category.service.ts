import apiClient from './axios-instance';
import {
  PrimaryCategoryResponse,
  SecondaryCategoryResponse,
  PrimaryCategory,
  SecondaryCategory,
  ApiError,
} from '../types/api.types';

/**
 * Safely parse JSON that may contain infinite circular references or trailing error messages
 * from backend streaming responses.
 */
const sanitizeAndParseJson = (raw: any): any => {
  if (typeof raw !== 'string') return raw;
  const trimmed = raw.trim();
  if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
    return raw;
  }

  // 1. Try standard JSON parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // 2. Try handling circular reference recursion cutoff
    const circularMarkers = [
      ',"primaryCategory":{"primaryCategoryId"',
      ',"primaryCategory":{',
    ];
    for (const marker of circularMarkers) {
      const idx = trimmed.indexOf(marker);
      if (idx !== -1) {
        const candidate = trimmed.slice(0, idx);
        const stack: string[] = [];
        let inString = false;
        let escaped = false;

        for (let i = 0; i < candidate.length; i++) {
          const c = candidate[i];
          if (escaped) {
            escaped = false;
            continue;
          }
          if (c === '\\') {
            escaped = true;
            continue;
          }
          if (c === '"') {
            inString = !inString;
            continue;
          }
          if (!inString) {
            if (c === '{') stack.push('}');
            else if (c === '[') stack.push(']');
            else if (c === '}' || c === ']') stack.pop();
          }
        }

        const closer = stack.reverse().join('');
        try {
          return JSON.parse(candidate + closer);
        } catch {
          // continue to next marker if parse fails
        }
      }
    }
    return raw;
  }
};

/**
 * Normalize category response from API
 * Handles various structures:
 * 1. Array of category wrappers: [{ audit_trail_notes: ..., primaryCategory: { ... } }]
 * 2. Array of categories directly: [{ primaryCategoryId: ..., products: [...] }]
 * 3. Object with primaryCategory/secondaryCategory wrapper: { primaryCategory: { ... } }
 * 4. Object with data/categories array: { data: [...] } or { categories: [...] }
 */
export const normalizeCategoryResponse = <T>(
  responseData: any,
  wrapperKey: 'primaryCategory' | 'secondaryCategory'
): T[] => {
  if (!responseData) return [];
  responseData = sanitizeAndParseJson(responseData);
  if (!responseData || typeof responseData === 'string') return [];

  // Helper to extract category object from an item
  const extractCategory = (item: any): any => {
    if (!item || typeof item !== 'object') return item;
    if (item[wrapperKey]) {
      return {
        ...item[wrapperKey],
        audit_trail_notes: item.audit_trail_notes,
      };
    }
    if (wrapperKey === 'primaryCategory' && item.primaryCategory) {
      return item.primaryCategory;
    }
    if (wrapperKey === 'secondaryCategory' && item.secondaryCategory) {
      return item.secondaryCategory;
    }
    return item;
  };

  // 1. Direct Array
  if (Array.isArray(responseData)) {
    return responseData.map(extractCategory);
  }

  // 2. Object with nested array
  if (Array.isArray(responseData.data)) {
    return responseData.data.map(extractCategory);
  }
  if (Array.isArray(responseData.categories)) {
    return responseData.categories.map(extractCategory);
  }
  if (Array.isArray(responseData.primaryCategories)) {
    return responseData.primaryCategories.map(extractCategory);
  }
  if (Array.isArray(responseData.secondaryCategories)) {
    return responseData.secondaryCategories.map(extractCategory);
  }

  // 3. Object with single category wrapper
  if (responseData[wrapperKey]) {
    return [
      {
        ...responseData[wrapperKey],
        audit_trail_notes: responseData.audit_trail_notes,
      },
    ];
  }
  if (wrapperKey === 'primaryCategory' && responseData.primaryCategory) {
    return [responseData.primaryCategory];
  }
  if (wrapperKey === 'secondaryCategory' && responseData.secondaryCategory) {
    return [responseData.secondaryCategory];
  }

  // 4. Object that is directly a category
  if (
    responseData.primaryCategoryId !== undefined ||
    responseData.secondaryCategoryId !== undefined ||
    responseData.products !== undefined
  ) {
    return [responseData];
  }

  return [];
};

/**
 * Fetch all primary categories
 * GET /categories/getAllCategories
 */
export const getAllPrimaryCategories = async (): Promise<PrimaryCategory[]> => {
  try {
    const response = await apiClient.get<PrimaryCategoryResponse>('/categories/getAllCategories');
    return normalizeCategoryResponse<PrimaryCategory>(response.data, 'primaryCategory');
  } catch (error: any) {
    if (error.response?.data) {
      const recovered = normalizeCategoryResponse<PrimaryCategory>(error.response.data, 'primaryCategory');
      if (recovered.length > 0) {
        return recovered;
      }
    }
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to fetch primary categories',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Fetch one primary category by ID
 * GET /categories/getCategory/{primaryCategoryId}
 */
export const getPrimaryCategoryById = async (
  primaryCategoryId: string | number
): Promise<PrimaryCategory | null> => {
  try {
    const response = await apiClient.get<PrimaryCategory>(`/categories/getCategory/${primaryCategoryId}`);
    const normalized = normalizeCategoryResponse<PrimaryCategory>(response.data, 'primaryCategory');
    return normalized.length > 0 ? normalized[0] : null;
  } catch (error: any) {
    if (error.response?.data) {
      const recovered = normalizeCategoryResponse<PrimaryCategory>(error.response.data, 'primaryCategory');
      if (recovered.length > 0) {
        return recovered[0];
      }
    }
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to fetch primary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Fetch all secondary categories
 * GET /secondary-categories/getAllCategories
 */
export const getAllSecondaryCategories = async (): Promise<SecondaryCategory[]> => {
  try {
    const response = await apiClient.get<SecondaryCategoryResponse>('/secondary-categories/getAllCategories');
    return normalizeCategoryResponse<SecondaryCategory>(response.data, 'secondaryCategory');
  } catch (error: any) {
    if (error.response?.data) {
      const recovered = normalizeCategoryResponse<SecondaryCategory>(error.response.data, 'secondaryCategory');
      if (recovered.length > 0) {
        return recovered;
      }
    }
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to fetch secondary categories',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Fetch all secondary categories belonging to the selected primary category
 * GET /secondary-categories/getCategoriesByPrimary/{primaryCategoryId}
 */
export const getCategoriesByPrimary = async (
  primaryCategoryId: string | number
): Promise<SecondaryCategory[]> => {
  try {
    const response = await apiClient.get<SecondaryCategoryResponse>(
      `/secondary-categories/getCategoriesByPrimary/${primaryCategoryId}`
    );
    return normalizeCategoryResponse<SecondaryCategory>(response.data, 'secondaryCategory');
  } catch (error: any) {
    if (error.response?.data) {
      const recovered = normalizeCategoryResponse<SecondaryCategory>(error.response.data, 'secondaryCategory');
      if (recovered.length > 0) {
        return recovered;
      }
    }
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch secondary categories for primary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Fetch one secondary category by ID
 * GET /secondary-categories/getCategory/{secondaryCategoryId}
 */
export const getSecondaryCategoryById = async (
  secondaryCategoryId: string | number
): Promise<SecondaryCategory | null> => {
  try {
    const response = await apiClient.get<SecondaryCategory>(
      `/secondary-categories/getCategory/${secondaryCategoryId}`
    );
    const normalized = normalizeCategoryResponse<SecondaryCategory>(response.data, 'secondaryCategory');
    return normalized.length > 0 ? normalized[0] : null;
  } catch (error: any) {
    if (error.response?.data) {
      const recovered = normalizeCategoryResponse<SecondaryCategory>(error.response.data, 'secondaryCategory');
      if (recovered.length > 0) {
        return recovered[0];
      }
    }
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to fetch secondary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Delete a primary category by ID
 * DELETE /categories/deleteCategory/{id}
 */
export const deletePrimaryCategory = async (primaryCategoryId: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/categories/deleteCategory/${primaryCategoryId}`);
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to delete primary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};

/**
 * Delete a secondary category by ID
 * DELETE /secondary-categories/deleteCategory/{id}
 */
export const deleteSecondaryCategory = async (secondaryCategoryId: string | number): Promise<void> => {
  try {
    await apiClient.delete(`/secondary-categories/deleteCategory/${secondaryCategoryId}`);
  } catch (error: any) {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Failed to delete secondary category',
      status: error.response?.status,
      code: error.response?.data?.code,
    };
    throw apiError;
  }
};
