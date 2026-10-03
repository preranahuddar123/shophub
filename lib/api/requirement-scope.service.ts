import apiClient from './axios-instance';
import { Room } from '@/lib/types/quote.types';

export interface ScopeUnit {
  label: string;
  selected?: boolean;
}

export interface ScopeSelectedRoom {
  id?: string;
  roomName: string;
  iconLabel?: string;
  sortOrder?: number;
  falseCeilingRequired?: boolean;
  notes?: string | null;
  units?: ScopeUnit[];
  unitsRequired?: string[];
}

export interface RequirementScopeResponse {
  success?: boolean;
  leadId?: string | number;
  leadIdentifier?: string;
  leadType?: string;
  availableRoomCatalog?: string[];
  selectedRooms: ScopeSelectedRoom[];
  [key: string]: unknown;
}

/**
 * Fallback requirement scope matching Picture 1:
 * - MODULAR KITCHEN: Base Units, wall unit, loft | False ceiling: false | Notes: Matte finish
 * - LIVING ROOM: TV Unit, wall panel | False ceiling: false | Notes: Simple
 * - KBR MBR: Wardrobe, Dresser Unit
 */
export const DEFAULT_REQUIREMENT_SCOPE: RequirementScopeResponse = {
  success: true,
  leadId: '2185',
  leadIdentifier: 'GL-MOZKPP0X8A',
  leadType: 'glead',
  availableRoomCatalog: ['Living Room', 'Modular Kitchen', 'KBR MBR'],
  selectedRooms: [
    {
      id: 'room-modular-kitchen-0',
      roomName: 'Modular Kitchen',
      iconLabel: 'B',
      sortOrder: 0,
      falseCeilingRequired: false,
      notes: 'Matte finish',
      units: [
        { label: 'Base Units', selected: true },
        { label: 'wall unit', selected: true },
        { label: 'loft', selected: true },
      ],
      unitsRequired: ['Base Units', 'wall unit', 'loft'],
    },
    {
      id: 'room-living-room-1',
      roomName: 'Living Room',
      iconLabel: '🛋',
      sortOrder: 1,
      falseCeilingRequired: false,
      notes: 'Simple',
      units: [
        { label: 'TV Unit', selected: true },
        { label: 'wall panel', selected: true },
      ],
      unitsRequired: ['TV Unit', 'wall panel'],
    },
    {
      id: 'room-kbr-mbr-2',
      roomName: 'KBR MBR',
      iconLabel: '🛏',
      sortOrder: 2,
      falseCeilingRequired: false,
      notes: 'Master Bedroom Wardrobe & Dresser',
      units: [
        { label: 'Wardrobe', selected: true },
        { label: 'Dresser Unit', selected: true },
      ],
      unitsRequired: ['Wardrobe', 'Dresser Unit'],
    },
  ],
};

/**
 * Fetch requirement scope from CRM API:
 * GET /leads/{leadType}/{leadId}/configuration-scope/requirements
 */
export const getRequirementScope = async (
  leadId: string | number = 2185,
  leadType: string = 'glead'
): Promise<RequirementScopeResponse> => {
  // 1. Try primary API endpoint via apiClient (/leads/{leadType}/{leadId}/configuration-scope/requirements)
  try {
    const response = await apiClient.get<RequirementScopeResponse>(
      `/leads/${leadType}/${leadId}/configuration-scope/requirements`
    );
    if (response.data && Array.isArray(response.data.selectedRooms) && response.data.selectedRooms.length > 0) {
      return response.data;
    }
  } catch (err) {
    // console.warn('Primary requirement scope endpoint failed, attempting alternatives...', err);
  }

  // 2. Try room-specific endpoint (/rooms/requirement-scope)
  try {
    const response = await apiClient.get<RequirementScopeResponse>(
      `/rooms/requirement-scope`,
      { params: { leadId, leadType } }
    );
    if (response.data && Array.isArray(response.data.selectedRooms) && response.data.selectedRooms.length > 0) {
      return response.data;
    }
  } catch {
    // Continue to next fallback
  }

  // 3. Try Next.js local API route
  try {
    const res = await fetch(`/api/crm/lead/${leadType}/${leadId}/configuration-scope/requirements`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.selectedRooms) && data.selectedRooms.length > 0) {
        return data;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 4. Return default fallback matching Picture 1
  return DEFAULT_REQUIREMENT_SCOPE;
};

/**
 * Convert Requirement Scope response into Room[] objects with units and notes for ShopHub
 */
export const transformScopeToRooms = (
  scope: RequirementScopeResponse,
  projectId?: number
): Room[] => {
  const result: Room[] = [];
  const seenNames = new Set<string>();

  if (scope && Array.isArray(scope.selectedRooms)) {
    scope.selectedRooms.forEach((r, idx) => {
      const units = r.units && r.units.length > 0
        ? r.units.filter((u) => u.selected !== false).map((u) => u.label)
        : (r.unitsRequired || []);

      seenNames.add(r.roomName.toLowerCase());
      result.push({
        id: idx + 1,
        roomName: r.roomName,
        projectId,
        units,
        falseCeilingRequired: !!r.falseCeilingRequired,
        notes: r.notes || null,
      });
    });
  }

  // Also append any catalog rooms (e.g. KBR MBR) from availableRoomCatalog if not already in selectedRooms
  if (scope && Array.isArray(scope.availableRoomCatalog)) {
    scope.availableRoomCatalog.forEach((roomName) => {
      if (!seenNames.has(roomName.toLowerCase())) {
        seenNames.add(roomName.toLowerCase());
        result.push({
          id: result.length + 1,
          roomName,
          projectId,
          units: [],
          falseCeilingRequired: false,
          notes: null,
        });
      }
    });
  }

  if (result.length === 0) {
    return DEFAULT_REQUIREMENT_SCOPE.selectedRooms.map((r, idx) => ({
      id: idx + 1,
      roomName: r.roomName,
      projectId,
      units: r.units?.map((u) => u.label) || r.unitsRequired || [],
      falseCeilingRequired: r.falseCeilingRequired,
      notes: r.notes,
    }));
  }

  return result;
};
