// WhatsApp Webhook API Endpoint
import { NextApiRequest, NextApiResponse } from 'next';
import { webhook } from '@/integrations/whatsapp/webhook';
import { WhatsAppWebhookEvent } from '@/integrations/whatsapp/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Webhook verification
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    console.log('Webhook verification request:', { mode, token, challenge });

    const verificationResult = webhook.verifyWebhook(mode, token, challenge);
    
    if (verificationResult) {
      console.log('Webhook verified successfully');
      return res.status(200).send(verificationResult);
    } else {
      console.log('Webhook verification failed');
      return res.status(403).send('Forbidden');
    }
  }

  if (req.method === 'POST') {
    try {
      const event: WhatsAppWebhookEvent = req.body;
      console.log('Received WhatsApp webhook:', JSON.stringify(event, null, 2));

      // Process the webhook event
      await webhook.processWebhook(event);

      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
