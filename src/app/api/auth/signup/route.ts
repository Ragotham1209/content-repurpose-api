import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { generateApiKey, PLAN_LIMITS } from '@/lib/auth';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SignupSchema.safeParse(body);

    if (!parseResult.success) {
      const msg = parseResult.error.issues.map(i => i.message).join(', ');
      return NextResponse.json(
        { error: msg, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    // Check if email already has an API key
    const { data: existing } = await supabase
      .from('api_keys')
      .select('key')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in.', code: 'DUPLICATE' },
        { status: 409 }
      );
    }

    // Create Supabase Auth user using service-role (admin) client
    const adminAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: authData, error: authError } = await adminAuth.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm for MVP
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      // If user already exists in auth but not in api_keys
      if (authError.message?.includes('already been registered')) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.', code: 'DUPLICATE' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to create account', code: 'AUTH_ERROR' },
        { status: 500 }
      );
    }

    // Generate API key and insert into api_keys
    const apiKey = generateApiKey();
    const plan = 'free';
    const limits = PLAN_LIMITS[plan];

    const { error: dbError } = await supabase.from('api_keys').insert({
      key: apiKey,
      email,
      user_id: authData.user.id,
      plan,
      requests_limit: limits.requests,
    });

    if (dbError) {
      console.error('DB insert error:', dbError);
      return NextResponse.json(
        { error: 'Account created but failed to generate API key. Please log in and try again.', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
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
