import { NextRequest, NextResponse } from 'next/server';
import {
  getLeadDetails,
  getCrmPipeline,
  getHubQuote,
  getActivePaymentLinks,
  getUpcomingAppointments,
  getDesignModulePaymentSummary,
} from '@/lib/api/erp-client';
import { mapErpToDashboard } from '@/lib/client/erpMapper';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const defaultLeadId = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_LEAD_ID || '2399';
    const leadId = searchParams.get('leadId') || defaultLeadId;

    // Parallel fetch from project-erp and DesignModule with graceful settled error handling
    const [leadRes, pipelineRes, quoteRes, paymentRes, appointmentsRes, designPaymentRes] =
      await Promise.allSettled([
        getLeadDetails(leadId),
        getCrmPipeline(),
        getHubQuote(leadId),
        getActivePaymentLinks(leadId),
        getUpcomingAppointments(leadId),
        getDesignModulePaymentSummary(leadId),
      ]);

    const lead = leadRes.status === 'fulfilled' ? leadRes.value : null;
    const pipeline = pipelineRes.status === 'fulfilled' ? pipelineRes.value : null;
    const hubQuote = quoteRes.status === 'fulfilled' ? quoteRes.value : null;
    const paymentLink = paymentRes.status === 'fulfilled' ? paymentRes.value : null;
    const appointments = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value : null;
    const designPayment = designPaymentRes.status === 'fulfilled' ? designPaymentRes.value : null;

    const dashboardData = mapErpToDashboard(
      {
        lead,
        pipeline,
        hubQuote,
        paymentLink,
        appointments: Array.isArray(appointments) ? appointments : undefined,
        designPayment,
      },
      leadId
    );

    return NextResponse.json({
      success: true,
      data: dashboardData,
      source: dashboardData.isLiveBackend ? 'project-erp' : 'fallback',
    });
  } catch (error: unknown) {
    console.error('[Client Dashboard API] Error:', error);

    // Always return valid fallback response so client UI never breaks
    const fallbackData = mapErpToDashboard({}, 'AL-1002');
    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: 'fallback',
      warning: (error as Error).message,
    });
  }
}
