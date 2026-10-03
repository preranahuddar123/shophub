import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leadType: string; id: string }> }
) {
  const { leadType, id } = await params;

  // Exact data from Picture 1 (CRM Requirement Scope)
  const data = {
    success: true,
    leadId: id || '2185',
    leadIdentifier: id?.startsWith('GL-') ? id : 'GL-MOZKPP0X8A',
    leadType: leadType || 'glead',
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
        notes: 'Master Bedroom Wardrobe & Dressing',
        units: [
          { label: 'Wardrobe', selected: true },
          { label: 'Dresser Unit', selected: true },
        ],
        unitsRequired: ['Wardrobe', 'Dresser Unit'],
      },
    ],
  };

  return NextResponse.json(data);
}
