import { NextRequest, NextResponse } from 'next/server';
import { getLeadDetails } from '@/lib/api/erp-client';
import { ProjectPageData } from '@/lib/client/types';
import { getQuoteRoomsForLead } from '@/lib/db/designmod';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const defaultLeadId = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_LEAD_ID || '1691';
    const leadId = searchParams.get('leadId') || defaultLeadId;

    let lead: any = null;
    try {
      lead = await getLeadDetails(leadId);
    } catch {
      lead = null;
    }

    const isLive = Boolean(lead && lead.id);

    // Format customer name & ID
    const rawName = lead?.name || 'Varnika';
    const cleanName =
      rawName === rawName.toUpperCase()
        ? rawName
            .split(' ')
            .map((w: string) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
            .join(' ')
        : rawName;

    const isVarnika =
      cleanName.toLowerCase().includes('varnika') ||
      String(leadId).includes('1691') ||
      String(leadId).includes('3F565') ||
      String(leadId).includes('2341');

    const projectId =
      lead?.customerId ||
      lead?.customer_id ||
      (lead?.leadId || lead?.lead_identifier ? `BLR-${String(lead.leadId || lead.lead_identifier).replace(/\D/g, '')}` : (isVarnika ? 'BLR-A1691' : 'BLR-A0462'));

    const propertyTitle = isVarnika
      ? '2 BHK Apartment • Bangalore 560076 (Renovation)'
      : '4 BHK Apartment • Bangalore 560043';

    // Lead Designer from CRM or fallback
    const designerName = lead?.designerName || lead?.designer_name || (isVarnika ? 'Seher' : 'Meghana');
    const designerPhone = isVarnika ? '+91 97405 44327' : (lead?.assigneePhone || '+91 88614 64757');
    const designerEmail = isVarnika ? 'seher@hubinterior.com' : 'meghana@hubinterior.com';

    // Assigned Relationship Manager
    const rmName = lead?.assignee || (isVarnika ? 'Sharanya' : 'Meghana');
    const rmPhone = isVarnika ? '+91 87550 09932' : (lead?.assigneePhone || '+91 88614 64757');
    const rmEmail = isVarnika ? 'chitarala@hubinterior.com' : 'meghana@hubinterior.com';

    // Project drawings & quotation
    const fileName = isVarnika
      ? 'VARNIKA FINAL QUOTATION 10-09-2026.pdf'
      : (lead?.floorPlanUrl?.includes('REV-A') ? 'Project_Final_REV-A.pdf' : 'Project_Final_V4.pdf');

    const downloadUrl = isVarnika
      ? 'https://designmod.s3.ap-south-2.amazonaws.com/lead-uploads/lead-2341-1789212222793-0-dqc2-quotation-VARNIKA_FINAL_QUOTATION_10-09-2026.__1_.pdf'
      : `https://hows.hubinterior.com/v1/leads/website/${lead?.id || 462}/floor-plan?presign=false`;

    // Dynamic quotation room extraction for any client from Prolance / DesignModule snapshots
    let dynamicRooms = null;
    try {
      const quoteIdMatch =
        (lead?.quoteLink && String(lead.quoteLink).match(/\/quote\/(\d+)/)) ||
        (lead?.quote_link && String(lead.quote_link).match(/\/quote\/(\d+)/)) ||
        (lead?.quoteUrl && String(lead.quoteUrl).match(/\/quote\/(\d+)/)) ||
        (lead?.notes && String(lead.notes).match(/\/quote\/(\d+)/));

      const quoteId = quoteIdMatch
        ? quoteIdMatch[1]
        : lead?.prolanceQuoteId ||
          lead?.prolance_quote_id ||
          (isVarnika ? '70877' : String(leadId) === '462' || String(lead?.id) === '462' ? '73761' : undefined);

      const contactNo = lead?.phone || lead?.contactNo || lead?.contact_no;
      dynamicRooms = await getQuoteRoomsForLead(lead?.id || leadId, quoteId, contactNo);
    } catch (e) {
      console.warn('[Project API] Dynamic rooms error:', e);
    }

    const defaultRooms = [
      {
        id: 'photo-kitchen',
        roomName: 'Kitchen - [R0]',
        title: 'Kitchen - [R0]',
        caption: 'Upper loft cabinets in ceramic finish, lower base units with aluminium handles, Jet Black granite countertop with integrated hob and chimney hood.',
        date: 'Design Approved',
        imageUrl: '/images/projects/kitchen-r0.jpg',
        isFeatured: true,
      },
      {
        id: 'photo-living',
        roomName: 'Living & Dining - [R0]',
        title: 'Living & Dining - [R0]',
        caption: 'Feature TV wall with curved arch wallpaper backdrop, suspended cabinetry with brass accents, CNC jaali partition, and hallway gypsum archway.',
        date: 'Design Approved',
        imageUrl: '/images/projects/living-dining-r0.jpg',
      },
      {
        id: 'photo-mbr',
        roomName: 'Master bedroom - [R0]',
        title: 'Master bedroom - [R0]',
        caption: 'Floor-to-ceiling wardrobe in natural oak veneer finish with aluminium profile handles, subtle wall trims, and warm textured paint accent wall.',
        date: 'Design Approved',
        imageUrl: '/images/projects/master-bedroom-r0.jpg',
      },
      {
        id: 'photo-kbr',
        roomName: 'Guest bedroom - [R0]',
        title: 'Guest bedroom - [R0]',
        caption: 'Integrated study desk with open pine wood ledges, tall storage unit with tandem drawers in macchiato, and fluted glass aluminium profile wardrobe.',
        date: 'Design Approved',
        imageUrl: '/images/projects/guest-bedroom-r0.jpg',
      },
    ];

    const sitePhotos = dynamicRooms && dynamicRooms.length > 0 ? dynamicRooms : defaultRooms;

    const readinessItems = isVarnika
      ? [
          {
            name: 'Material Sourcing',
            percentage: 100,
            subtext: 'Ceramic loft, Toned Blue utility, and Veneer finishes approved.',
            isComplete: true,
          },
          {
            name: 'Factory Production',
            percentage: 65,
            subtext: 'Modular carcass & shutter fabrication in progress at factory.',
            isComplete: false,
          },
          {
            name: 'On-Site Masking & Prep',
            percentage: 100,
            subtext: 'Site masking verified; core cutting & electrical points marked.',
            isComplete: true,
          },
        ]
      : [
          {
            name: 'Material Sourcing',
            percentage: 100,
            subtext: 'All premium finishes arrived at warehouse.',
            isComplete: true,
          },
          {
            name: 'Factory Production',
            percentage: 85,
            subtext: 'Modular units for Guest Room in final assembly.',
            isComplete: false,
          },
          {
            name: 'On-Site Installation',
            percentage: 42,
            subtext: 'Flooring complete. Cabinetry framing in progress.',
            isComplete: false,
          },
        ];

    const nextBigStep = isVarnika
      ? {
          title: 'Dispatch to Site for Installation',
          startDate: 'Starting Sept 28, 2026',
        }
      : {
          title: 'Hardwood Flooring Polish',
          startDate: 'Starting June 24, 2024',
        };

    const timelineMilestones = isVarnika
      ? [
          {
            id: 'step-1',
            title: 'Booking & Design Kickoff',
            date: 'July 15',
            description: '10% booking token confirmed and virtual meeting with Designer Seher.',
            status: 'completed' as const,
          },
          {
            id: 'step-2',
            title: 'D2 Site Masking & Checklist',
            date: 'Aug 27',
            description: 'Site masking drawings and civil dimensions checked on site.',
            status: 'completed' as const,
          },
          {
            id: 'step-3',
            title: 'DQC2 Final Design Sign-off',
            date: 'Sept 12',
            description: 'Final quotation (Quote #70877) and production drawings approved by DQC.',
            status: 'completed' as const,
          },
          {
            id: 'step-4',
            title: 'Factory Production & Assembly',
            date: 'Sept 16',
            description: '40% milestone cleared. Modular units in automated CNC cutting & edge banding.',
            status: 'active' as const,
            estCompletion: 'Est. Completion: Sept 28',
          },
          {
            id: 'step-5',
            title: 'Site Installation & Handover',
            date: 'Oct 15',
            description: 'Cabinetry fitting, countertop installation, final QC check, and handover.',
            status: 'upcoming' as const,
          },
        ]
      : [
          {
            id: 'step-1',
            title: 'Civil & Electrical Modifications',
            date: 'May 28',
            description: 'Concealed wiring, lighting points, and partition walls finalized.',
            status: 'completed' as const,
          },
          {
            id: 'step-2',
            title: 'Flooring Installation',
            date: 'June 05',
            description: 'Italian marble laying and initial grinding in living areas.',
            status: 'completed' as const,
          },
          {
            id: 'step-3',
            title: 'Modular Carpentry Installation',
            date: 'June 20',
            description: 'Kitchen cabinets and wardrobe frameworks are being fitted.',
            status: 'active' as const,
            estCompletion: 'Est. Completion: June 20',
          },
          {
            id: 'step-4',
            title: 'False Ceiling & Painting',
            date: 'June 25',
            description: 'Installation of POP designs followed by base coat paint.',
            status: 'upcoming' as const,
          },
          {
            id: 'step-5',
            title: 'Project Handover',
            date: 'July 15',
            description: 'Deep cleaning, final snag check, and key handover ceremony.',
            status: 'upcoming' as const,
          },
        ];

    const teamContacts = [
      {
        id: 'team-1',
        name: designerName,
        role: 'LEAD DESIGNER',
        email: designerEmail,
        phone: designerPhone,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        actionType: 'email' as const,
      },
      {
        id: 'team-2',
        name: rmName,
        role: 'RELATIONSHIP MANAGER',
        phone: rmPhone,
        email: rmEmail,
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        actionType: 'call' as const,
      },
      {
        id: 'team-3',
        name: isVarnika ? 'Sohan' : 'Vikram Mehta',
        role: isVarnika ? 'PROJECT MANAGER' : 'SITE ENGINEER',
        phone: isVarnika ? '+91 97411 67755' : '+91 97405 49568',
        email: isVarnika ? 'sohan@hubinterior.com' : 'vikram@hubinterior.com',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        actionType: 'chat' as const,
      },
    ];

    const projectData: ProjectPageData = {
      projectId,
      clientName: cleanName,
      propertyTitle,
      currentPhaseTitle: 'Modular Carpentry Installation',
      overallProgressPercentage: 68,
      sitePhotos,
      readinessItems,
      nextBigStep,
      timelineMilestones,
      teamContacts,
      latestRevision: {
        fileName,
        fileSize: isVarnika ? '5.0 MB' : '12.4 MB',
        updatedText: isVarnika ? 'Quote #70877 Approved • 5.0 MB' : 'Updated yesterday • 12.4 MB',
        downloadUrl,
      },
      isLiveBackend: isLive,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: projectData,
      source: isLive ? 'project-erp' : 'fallback',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
