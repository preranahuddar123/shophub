import apiClient from './axios-instance';

export interface CustomerResponse {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  [key: string]: any;
}

interface CustomersApiResponse {
  customers?: CustomerResponse[];
  data?: CustomerResponse[];
  [key: string]: any;
}

const extractCustomers = (data: any): CustomerResponse[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.customers)) return data.customers;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/**
 * GET /v1/customers
 */
export const getAllCustomers = async (): Promise<CustomerResponse[]> => {
  try {
    const response = await apiClient.get<CustomersApiResponse>('/customers');
    return extractCustomers(response.data);
  } catch (error: any) {
    return [];
  }
};

export const transformCustomer = (c: CustomerResponse) => ({
  id: typeof c.id === 'string' ? parseInt(c.id) : (c.id as number),
  name: c.name,
  email: c.email,
  phone: c.phone,
  company: c.company,
});

export const getCustomersForQuoteEngine = async () => {
  const customers = await getAllCustomers();
  return customers.map(transformCustomer);
};
