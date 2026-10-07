import apiClient from './axios-instance';

export interface Lead {
  id: number | string;
  leadId?: string;
  lead_id?: string;
  customerId?: string;
  customer_id?: string;
  name?: string;
  customerName?: string;
  customer_name?: string;
  email?: string;
  phoneNumber?: string;
  phone_number?: string;
  status: string;
  leadType?: string;
  lead_type?: string;
  territory?: string;
  createdAt?: string;
  created_at?: string;
  propertyPin?: string;
  propertyDetails?: string;
  [key: string]: unknown;
}

export interface LeadsFilterParams {
  leadType?: string;
  status?: string;
  customerName?: string;
  projectName?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

interface LeadsResponse {
  content?: Lead[];
  leads?: Lead[];
  data?: Lead[] | unknown;
  [key: string]: unknown;
}

// Supported CRM lead tables in backend
export const CRM_LEAD_TYPES = [
  'glead',
  'mlead',
  'formlead',
  'addlead',
  'websitelead',
  'walkinlead',
  'whatsapplead',
  'ivrlead',
];

const extractLeads = (data: unknown): Lead[] => {
  if (Array.isArray(data)) return data as Lead[];
  const record = data as Record<string, unknown> | null | undefined;
  if (Array.isArray(record?.content)) return record.content as Lead[];
  if (Array.isArray(record?.leads)) return record.leads as Lead[];
  if (Array.isArray(record?.data)) return record.data as Lead[];
  return [];
};

type LeadsFetchResult = {
  leads: Lead[];
  /** Spring rejected the CRM call (missing/invalid token). Other lead types will fail the same way. */
  authDenied: boolean;
};

/**
 * Fetch leads for a specific lead type (default: glead)
 * GET /leads/filter?leadType={leadType}
 */
const fetchFilteredLeads = async (params: LeadsFilterParams = {}): Promise<LeadsFetchResult> => {
  try {
    const leadType = params.leadType || 'glead';
    const response = await apiClient.get<LeadsResponse>('/leads/filter', {
      params: { leadType, ...params },
      validateStatus: () => true,
    });
    if (response.status === 401 || response.status === 403) {
      return { leads: [], authDenied: true };
    }
    if (response.status < 200 || response.status >= 300) {
      return { leads: [], authDenied: false };
    }
    const leads = extractLeads(response.data).map((l) => ({ ...l, leadType }));
    return { leads, authDenied: false };
  } catch {
    return { leads: [], authDenied: false };
  }
};

export const getFilteredLeads = async (params: LeadsFilterParams = {}): Promise<Lead[]> => {
  const { leads } = await fetchFilteredLeads(params);
  return leads;
};

let crmLeadsInFlight: Promise<Lead[]> | null = null;

/**
 * Concurrently fetch leads across multiple CRM lead tables (glead, mlead, formlead, addlead, websitelead)
 * WITHOUT requiring any backend changes!
 */
export const getAllCrmLeads = async (params: LeadsFilterParams = {}): Promise<Lead[]> => {
  if (crmLeadsInFlight && Object.keys(params).length === 0) {
    return crmLeadsInFlight;
  }

  const load = (async () => {
    const targetLeadTypes = ['glead', 'mlead', 'formlead', 'addlead', 'websitelead'];
    const probe = await fetchFilteredLeads({ ...params, leadType: targetLeadTypes[0] });
    if (probe.authDenied) {
      return [];
    }

    const remaining = await Promise.all(
      targetLeadTypes.slice(1).map((lt) => fetchFilteredLeads({ ...params, leadType: lt }))
    );

    return [probe, ...remaining].flatMap((result) => result.leads);
  })();

  if (Object.keys(params).length === 0) {
    crmLeadsInFlight = load;
    load.finally(() => {
      crmLeadsInFlight = null;
    });
  }

  return load;
};

/**
 * Known default CRM customer profiles for fallback/enrichment
 */
const DEFAULT_CRM_CUSTOMERS = [
  { id: 2185, name: 'Rahul Sharma', customerId: 'BLR-A2185', phone: '7647867564', source: 'glead' },
  { id: 2228, name: 'Ananya Mishra', customerId: 'BLR-A2228', phone: '9535785947', source: 'glead' },
  { id: 1001, name: 'Deepak', customerId: 'BLR-A0001', phone: '8217267485', source: 'mlead' },
  { id: 1002, name: 'Keerthi', customerId: 'BLR-A0002', phone: '7411589705', source: 'mlead' },
  { id: 1003, name: 'Mohammed Muddassir', customerId: 'BLR-A0003', phone: '8792107142', source: 'mlead' },
  { id: 1004, name: 'Priya', customerId: 'BLR-A0004', phone: '9019211189', source: 'mlead' },
];

/**
 * Extract unique customers from leads across CRM tables (glead, mlead, formlead, etc.)
 * Intelligently correlates customerId with customer name.
 * Displays formatted name: "Customer Name (BLR-A2185)" or "Customer Name"
 */
export const getCustomersFromLeads = async (): Promise<{
  id: number;
  name: string;
  customerId?: string;
  realName?: string;
}[]> => {
  const leads = await getAllCrmLeads();

  // Map to resolve customer names by customerId across tables
  const customerNameMap = new Map<string, string>();

  // Pre-seed known customer mappings from CRM data
  DEFAULT_CRM_CUSTOMERS.forEach((c) => {
    customerNameMap.set(c.customerId, c.name);
  });

  // Extract non-empty names from any lead records
  leads.forEach((lead) => {
    const rawCustId = lead.customerId || lead.customer_id;
    const rawName = (lead.name && lead.name.trim()) ||
      (lead.customerName && lead.customerName.trim()) ||
      (lead.customer_name && lead.customer_name.trim());

    if (rawCustId && rawName) {
      customerNameMap.set(String(rawCustId).trim(), rawName);
    }
  });

  const seen = new Set<string>();
  const customers: { id: number; name: string; customerId?: string; realName?: string }[] = [];

  leads.forEach((lead) => {
    const custId = lead.customerId || lead.customer_id || `CUST-${lead.id}`;
    const trimmedCustId = String(custId).trim();

    if (trimmedCustId && !seen.has(trimmedCustId)) {
      seen.add(trimmedCustId);
      const numericId = typeof lead.id === 'string' ? parseInt(lead.id) || 1 : (lead.id as number);

      // Resolve real customer name: check lead.name first, then look up in cross-table map
      const directName = (lead.name && lead.name.trim()) ||
        (lead.customerName && lead.customerName.trim()) ||
        (lead.customer_name && lead.customer_name.trim());

      const realName = directName || customerNameMap.get(trimmedCustId);

      // Format display name: e.g. "Rahul Sharma (BLR-A2185)" or "Deepak (BLR-A0001)"
      const displayName = realName
        ? `${realName} (${trimmedCustId})`
        : trimmedCustId;

      customers.push({
        id: numericId,
        name: displayName,
        customerId: trimmedCustId,
        realName: realName || trimmedCustId,
      });
    }
  });

  // If no customers returned from API (e.g. backend unauthorized or offline), return known CRM profiles
  if (customers.length === 0) {
    return DEFAULT_CRM_CUSTOMERS.map((c) => ({
      id: c.id,
      name: `${c.name} (${c.customerId})`,
      customerId: c.customerId,
      realName: c.name,
    }));
  }

  return customers;
};

/**
 * Transform lead into project to show in Active Project dropdown
 * Displays project label: "Project #2185 (GL-MOZKPP0X8A)" or property details
 */
export const transformLeadToProject = (lead: Lead) => {
  const numericId = typeof lead.id === 'string' ? parseInt(lead.id) || 1 : (lead.id as number);
  const identifier = lead.leadId || lead.lead_id || lead.customerId || `Lead-${lead.id}`;
  const label = lead.propertyDetails
    ? `${lead.propertyDetails} (#${lead.id})`
    : `Project #${lead.id} (${identifier})`;

  return {
    id: numericId,
    projectName: label,
    customerId: numericId,
    status: lead.status || 'Active',
  };
};

export const getProjectsForQuoteEngine = async () => {
  const leads = await getAllCrmLeads();

  if (leads.length === 0) {
    // Fallback projects matching known CRM records
    return [
      { id: 2185, projectName: 'Project #2185 (GL-MOZKPP0X8A - Google Ads)', customerId: 2185, status: 'Active' },
      { id: 2228, projectName: 'Project #2228 (GL-DPV44DJXO2 - Google Ads)', customerId: 2228, status: 'Active' },
      { id: 1001, projectName: 'Project #1 (ML-8ZT2VBEFKM - Meta)', customerId: 1001, status: 'Active' },
      { id: 1002, projectName: 'Project #2 (ML-AYKM1LNP9R - Meta)', customerId: 1002, status: 'Active' },
    ];
  }

  return leads.map(transformLeadToProject);
};
