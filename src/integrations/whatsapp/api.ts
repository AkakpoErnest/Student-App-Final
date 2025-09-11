// WhatsApp API Endpoint for Vercel/Netlify
import { NextRequest, NextResponse } from 'next/server';
import { webhook } from './webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process the webhook
    await webhook.processWebhook(body);
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  if (mode && token && challenge) {
    const result = webhook.verifyWebhook(mode, token, challenge);
    if (result) {
      return new NextResponse(result);
    }
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

