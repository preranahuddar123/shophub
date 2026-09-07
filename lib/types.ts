export type OfferingType = 'Product' | 'Service';
export type OfferingStatus = 'Active' | 'Inactive' | 'Draft';
export type StockLevel = 'In Stock' | 'Low Stock' | 'Pre-order' | 'Unlimited';

export interface Offering {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  type: OfferingType;
  price: number;
  cost: number;
  margin: number;
  stock: number;
  stockLevel: StockLevel;
  status: OfferingStatus;
  vendor: string;
  updated: string;
  image: string;
}

export interface FilterState {
  category: string;
  type: string;
  status: string;
  vendor: string;
  stock: string;
  search: string;
}
