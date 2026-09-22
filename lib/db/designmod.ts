import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DESIGNMOD_DB_HOST || 'database-1.cl002gu0o5ft.ap-south-2.rds.amazonaws.com',
      user: process.env.DESIGNMOD_DB_USER || 'admin',
      password: process.env.DESIGNMOD_DB_PASSWORD || 'Hubinterior2019',
      database: process.env.DESIGNMOD_DB_NAME || 'DesignMod',
      waitForConnections: true,
      connectionLimit: 4,
      queueLimit: 0,
      connectTimeout: 8000,
    });
  }
  return pool;
}

export interface QuoteRoomOption {
  id: string;
  roomName: string;
  title: string;
  imageUrl: string;
  caption?: string;
  isFeatured?: boolean;
}

function getRoomImage(roomTitle: string): string {
  const lower = roomTitle.toLowerCase();
  if (lower.includes('kitchen')) {
    return '/images/projects/kitchen-r0.jpg';
  }
  if (lower.includes('living') || lower.includes('dining') || lower.includes('hall')) {
    return '/images/projects/living-dining-r0.jpg';
  }
  if (lower.includes('master') || lower.includes('mbr') || lower.includes('bed 1') || lower.includes('bedroom 1')) {
    return '/images/projects/master-bedroom-r0.jpg';
  }
  // Guest room, other bedrooms, kid's room, study, etc.
  return '/images/projects/guest-bedroom-r0.jpg';
}

function getRoomCaption(roomTitle: string): string {
  const lower = roomTitle.toLowerCase();
  if (lower.includes('kitchen')) {
    return 'Upper loft cabinets in ceramic finish, lower base units with aluminium handles, Jet Black granite countertop with integrated hob and chimney hood.';
  }
  if (lower.includes('living') || lower.includes('dining')) {
    return 'Feature TV wall with curved arch wallpaper backdrop, suspended cabinetry with brass accents, CNC jaali partition, and hallway gypsum archway.';
  }
  if (lower.includes('master') || lower.includes('mbr')) {
    return 'Floor-to-ceiling wardrobe in natural oak veneer finish with aluminium profile handles, subtle wall trims, and warm textured paint accent wall.';
  }
  return 'Integrated study desk with open pine wood ledges, tall storage unit with tandem drawers in macchiato, and fluted glass aluminium profile wardrobe.';
}

export async function getQuoteRoomsForLead(
  leadId?: string | number,
  quoteId?: string | number,
  contactNo?: string
): Promise<QuoteRoomOption[] | null> {
  try {
    const db = getDbPool();
    const cleanLeadId = leadId ? String(leadId).replace(/\D/g, '') : '';
    const cleanQuoteId = quoteId ? String(quoteId).replace(/\D/g, '') : '';

    let rows: any[] = [];

    // 1. Try by Quote ID if present
    if (cleanQuoteId) {
      const [r]: any = await db.query(
        'SELECT payload_json FROM lead_prolance_quote_snapshots WHERE quote_id = ? ORDER BY id DESC LIMIT 1',
        [cleanQuoteId]
      );
      if (r && r.length > 0) rows = r;
    }

    // 2. Try by Lead ID if present
    if (!rows.length && cleanLeadId) {
      const [r]: any = await db.query(
        'SELECT payload_json FROM lead_prolance_quote_snapshots WHERE lead_id = ? ORDER BY id DESC LIMIT 1',
        [cleanLeadId]
      );
      if (r && r.length > 0) rows = r;
    }

    // 3. Try looking up in DesignMod leads table by contact_no
    if (!rows.length && contactNo) {
      const cleanPhone = contactNo.replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        const [leadRows]: any = await db.query(
          'SELECT id, prolance_quote_id FROM leads WHERE contact_no LIKE ? ORDER BY id DESC LIMIT 1',
          [`%${cleanPhone}%`]
        );
        if (leadRows && leadRows.length > 0) {
          const matchedLead = leadRows[0];
          const [r]: any = await db.query(
            'SELECT payload_json FROM lead_prolance_quote_snapshots WHERE lead_id = ? OR quote_id = ? ORDER BY id DESC LIMIT 1',
            [matchedLead.id, matchedLead.prolance_quote_id]
          );
          if (r && r.length > 0) rows = r;
        }
      }
    }

    if (!rows.length) return null;

    const rawPayload = rows[0].payload_json;
    const parsed = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
    const data = parsed?.data || parsed;
    const optionDetails: any[] = data?.optionDetails || [];

    if (!optionDetails.length) return null;

    return optionDetails.map((opt: any, idx: number) => {
      const rawName = opt.optionName || opt.roomName || opt.title || `Room ${idx + 1}`;
      // Clean display name (capitalize nicely)
      const roomName = rawName.trim();
      const title = roomName;

      return {
        id: `photo-${opt.optionID || idx}`,
        roomName,
        title,
        caption: getRoomCaption(roomName),
        imageUrl: getRoomImage(roomName),
        isFeatured: idx === 0,
      };
    });
  } catch (err: any) {
    console.warn('[DesignMod DB] Failed to fetch quotation rooms:', err?.message || err);
    return null;
  }
}
