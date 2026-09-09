export * from '@/types/offerings/offering.types';
export * from '@/types/api/request.types';
export * from '@/types/api/response.types';
export * from '@/types/api/pagination.types';

export type CategoryType = 'all' | 'primary' | 'secondary';

export interface FilterState {
  category: CategoryType;
  offeringCategory: string;
  type: string;
  status: string;
  vendor: string;
  stock: string;
  search: string;
}