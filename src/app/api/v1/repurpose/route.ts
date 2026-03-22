import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, trackUsage, getAllowedPlatforms } from '@/lib/auth';
import { RepurposeRequestSchema, repurposeContent, fetchUrlContent } from '@/lib/repurpose';

export const runtime = 'nodejs';
export const maxDuration = 30; // Vercel timeout

// CORS headers for cross-origin API access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const start = Date.now();

  try {
    // 1. Authenticate
    const apiKey = request.headers.get('x-api-key');
    const authResult = await validateApiKey(apiKey);

    if (!authResult.valid) {
      return NextResponse.json(
        { error: authResult.error, code: authResult.status === 429 ? 'RATE_LIMITED' : 'UNAUTHORIZED' },
        { status: authResult.status, headers: corsHeaders }
      );
    }

    const { record } = authResult;

    // 2. Parse and validate request body
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body', code: 'BAD_REQUEST' },
        { status: 400, headers: corsHeaders }
      );
    }

    const parseResult = RepurposeRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: parseResult.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const input = parseResult.data;

    // 3. Check platform access
    const allowedPlatforms = getAllowedPlatforms(record.plan);
    const blockedPlatforms = input.platforms.filter(p => !allowedPlatforms.includes(p));
    if (blockedPlatforms.length > 0) {
      return NextResponse.json(
        {
          error: `Your plan (${record.plan}) does not include: ${blockedPlatforms.join(', ')}. Upgrade to access all platforms.`,
          code: 'PLAN_RESTRICTED',
          allowed_platforms: allowedPlatforms,
        },
        { status: 403, headers: corsHeaders }
      );
    }

    // 4. Fetch URL content if needed
    if (input.source_url && !input.content) {
      try {
        input.content = await fetchUrlContent(input.source_url);
      } catch (error) {
        return NextResponse.json(
          { error: (error as Error).message, code: 'URL_FETCH_ERROR' },
          { status: 422, headers: corsHeaders }
        );
      }
    }

    // 5. Repurpose content
    const { results, tokens_used, latency_ms } = await repurposeContent(input);

    // 6. Track usage
    await trackUsage(
      record.id,
      '/api/v1/repurpose',
      input.platforms,
      tokens_used,
      latency_ms,
      'success'
    );

    // 7. Return response
    return NextResponse.json(
      {
        success: true,
        data: results,
        meta: {
          platforms: input.platforms,
          tone: input.tone,
          tokens_used,
          latency_ms,
          requests_remaining: record.requests_limit - record.requests_used - 1,
        },
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'X-RateLimit-Limit': String(record.requests_limit),
          'X-RateLimit-Remaining': String(record.requests_limit - record.requests_used - 1),
          'X-Request-Duration': `${latency_ms}ms`,
        },
      }
    );
  } catch (error) {
    console.error('Repurpose API error:', error);

    const message =
      error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      { error: message, code: 'INTERNAL_ERROR' },
      { status: 500, headers: corsHeaders }
    );
  }
}
