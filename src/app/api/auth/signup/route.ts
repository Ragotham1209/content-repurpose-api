import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateApiKey, PLAN_LIMITS } from '@/lib/auth';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SignupSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Valid email required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { email } = parseResult.data;

    // Check if email already has an API key
    const { data: existing } = await supabase
      .from('api_keys')
      .select('key, plan, requests_used, requests_limit')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'API key already exists for this email',
        api_key: existing.key,
        plan: existing.plan,
        requests_used: existing.requests_used,
        requests_limit: existing.requests_limit,
      });
    }

    // Generate new API key
    const apiKey = generateApiKey();
    const plan = 'free';
    const limits = PLAN_LIMITS[plan];

    const { error } = await supabase.from('api_keys').insert({
      key: apiKey,
      email,
      plan,
      requests_limit: limits.requests,
    });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
        { error: 'Failed to create API key', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'API key created successfully',
        api_key: apiKey,
        plan,
        requests_limit: limits.requests,
        allowed_platforms: limits.platforms,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
