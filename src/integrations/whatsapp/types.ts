// WhatsApp Bot Types
export interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'location' | 'interactive';
  text?: {
    body: string;
  };
  image?: {
    id: string;
    mime_type: string;
    sha256: string;
  };
  interactive?: {
    type: 'button_reply' | 'list_reply';
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
    };
  };
}

export interface WhatsAppWebhookEvent {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: WhatsAppMessage[];
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

export interface BotUser {
  phone: string;
  name?: string;
  university?: string;
  studentId?: string;
  preferences: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  conversationState: 'idle' | 'browsing' | 'viewing_item' | 'negotiating' | 'checkout';
  currentItemId?: string;
  lastActivity: Date;
}

export interface BotResponse {
  type: 'text' | 'template' | 'interactive' | 'image';
  content: string;
  buttons?: Array<{
    id: string;
    title: string;
  }>;
  list?: {
    header: string;
    body: string;
    footer?: string;
    sections: Array<{
      title: string;
      rows: Array<{
        id: string;
        title: string;
        description?: string;
      }>;
    }>;
  };
  imageUrl?: string;
}

export interface StuFindOpportunity {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  university: string;
  seller: {
    name: string;
    phone: string;
    verified: boolean;
  };
  images: string[];
  status: 'active' | 'sold' | 'pending';
  createdAt: Date;
}

