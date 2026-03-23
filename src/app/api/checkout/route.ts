import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createSupabaseServer } from '@/lib/supabase-server';
import { supabase as adminSupabase } from '@/lib/supabase';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20' as any,
});

const CheckoutSchema = z.object({
  plan: z.enum(['starter', 'pro', 'scale']),
});

const PLAN_TO_PRICE: Record<string, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  pro: process.env.STRIPE_PRICE_PRO,
  scale: process.env.STRIPE_PRICE_SCALE,
};

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 2. Validate request
    const body = await request.json();
    const parseResult = CheckoutSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid plan', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { plan } = parseResult.data;
    const priceId = PLAN_TO_PRICE[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured for plan: ${plan}`, code: 'CONFIG_ERROR' },
        { status: 500 }
      );
    }

    // 3. Check for existing Stripe customer
    const { data: apiKeyRow } = await adminSupabase
      .from('api_keys')
      .select('stripe_customer_id, email')
      .eq('user_id', user.id)
      .single();

    // 4. Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgraded=true`,
      cancel_url: `${appUrl}/dashboard`,
      metadata: { email: user.email || '', user_id: user.id },
    };

    if (apiKeyRow?.stripe_customer_id) {
      sessionParams.customer = apiKeyRow.stripe_customer_id;
    } else {
      sessionParams.customer_email = user.email || apiKeyRow?.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
