// Mobile Money Integration for Ghana
// Supports MTN MoMo, Vodafone Cash, and AirtelTigo Money

export enum MoMoProvider {
  MTN = 'mtn',
  VODAFONE = 'vodafone',
  AIRTEL = 'airtel'
}

export enum PaymentStatus {
  PENDING = 'pending',
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface MoMoPaymentRequest {
  provider: MoMoProvider;
  amount: number;
  phoneNumber: string;
  reference: string;
  description?: string;
}

export interface MoMoPaymentResponse {
  success: boolean;
  transaction_id?: string;
  message: string;
  error?: string;
  status?: PaymentStatus;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: PaymentStatus;
  transaction_id: string;
  amount?: number;
  phone_number?: string;
  error?: string;
}

class MobileMoneyService {
  private baseUrls = {
    [MoMoProvider.MTN]: 'https://api.mtn.com/v1',
    [MoMoProvider.VODAFONE]: 'https://api.vodafone.com.gh/v1',
    [MoMoProvider.AIRTEL]: 'https://api.airtel.com.gh/v1'
  };

  private apiKeys = {
    [MoMoProvider.MTN]: import.meta.env.VITE_MTN_MOMO_API_KEY || '',
    [MoMoProvider.VODAFONE]: import.meta.env.VITE_VODAFONE_MOMO_API_KEY || '',
    [MoMoProvider.AIRTEL]: import.meta.env.VITE_AIRTEL_MOMO_API_KEY || ''
  };

  // Validate Ghana phone number
  validateGhanaPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+233/, '0');
    const ghanaPhoneRegex = /^0[2-9]\d{8}$/;
    return ghanaPhoneRegex.test(cleanPhone);
  }

  // Format phone number for API
  formatPhoneNumber(phone: string): string {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/^\+233/, '0');
    return cleanPhone.startsWith('0') ? cleanPhone : `0${cleanPhone}`;
  }

  // Generate payment reference
  generatePaymentReference(opportunityId: string, userId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `STU${timestamp}${random}`.toUpperCase();
  }

  // Initiate Mobile Money payment
  async initiateMoMoPayment(
    provider: MoMoProvider,
    amount: number,
    phoneNumber: string,
    reference: string,
    description?: string
  ): Promise<MoMoPaymentResponse> {
    try {
      // Validate inputs
      if (!this.validateGhanaPhone(phoneNumber)) {
        return {
          success: false,
          error: 'Invalid Ghana phone number format'
        };
      }

      if (amount < 1) {
        return {
          success: false,
          error: 'Minimum amount is 1 GHS'
        };
      }

      const apiKey = this.apiKeys[provider];
      if (!apiKey) {
        return {
          success: false,
          error: `${provider.toUpperCase()} API key not configured`
        };
      }

      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // In production, this would make real API calls
      // For now, we'll simulate the API response
      const response = await this.simulateMoMoAPI(provider, {
        amount,
        phoneNumber: formattedPhone,
        reference,
        description: description || `StuFind Payment - ${reference}`
      });

      return response;
    } catch (error) {
      console.error('MoMo payment initiation error:', error);
      return {
        success: false,
        error: 'Payment initiation failed. Please try again.'
      };
    }
  }

  // Check payment status
  async checkPaymentStatus(
    provider: MoMoProvider,
    transactionId: string
  ): Promise<PaymentStatusResponse> {
    try {
      const apiKey = this.apiKeys[provider];
      if (!apiKey) {
        return {
          success: false,
          status: PaymentStatus.FAILED,
          transaction_id: transactionId,
          error: `${provider.toUpperCase()} API key not configured`
        };
      }

      // In production, this would make real API calls
      // For now, we'll simulate status checking
      const response = await this.simulateStatusCheck(provider, transactionId);
      return response;
    } catch (error) {
      console.error('Payment status check error:', error);
      return {
        success: false,
        status: PaymentStatus.FAILED,
        transaction_id: transactionId,
        error: 'Status check failed. Please try again.'
      };
    }
  }

  // Get payment instructions for user
  getPaymentInstructions(
    provider: MoMoProvider,
    amount: number,
    reference: string
  ): string[] {
    const instructions = {
      [MoMoProvider.MTN]: [
        `You will receive a USSD prompt on your phone`,
        `Enter your MTN MoMo PIN when prompted`,
        `Confirm payment of GH₵${amount.toFixed(2)}`,
        `Reference: ${reference}`,
        `Payment will be processed instantly`
      ],
      [MoMoProvider.VODAFONE]: [
        `You will receive a USSD prompt on your phone`,
        `Enter your Vodafone Cash PIN when prompted`,
        `Confirm payment of GH₵${amount.toFixed(2)}`,
        `Reference: ${reference}`,
        `Payment will be processed instantly`
      ],
      [MoMoProvider.AIRTEL]: [
        `You will receive a USSD prompt on your phone`,
        `Enter your AirtelTigo Money PIN when prompted`,
        `Confirm payment of GH₵${amount.toFixed(2)}`,
        `Reference: ${reference}`,
        `Payment will be processed instantly`
      ]
    };

    return instructions[provider] || [];
  }

  // Simulate MoMo API call (replace with real API in production)
  private async simulateMoMoAPI(
    provider: MoMoProvider,
    paymentData: any
  ): Promise<MoMoPaymentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success/failure based on phone number
    const phone = paymentData.phoneNumber;
    const isTestNumber = phone.includes('0244') || phone.includes('0555');
    
    if (isTestNumber) {
      return {
        success: true,
        transaction_id: `TXN_${Date.now()}_${provider.toUpperCase()}`,
        message: `Payment initiated successfully. Check your phone for USSD prompt.`,
        status: PaymentStatus.INITIATED
      };
    } else {
      return {
        success: false,
        error: 'This is a demo environment. Use test numbers (0244 or 0555) to simulate payments.'
      };
    }
  }

  // Simulate status check (replace with real API in production)
  private async simulateStatusCheck(
    provider: MoMoProvider,
    transactionId: string
  ): Promise<PaymentStatusResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate different statuses based on transaction ID
    const statuses = [PaymentStatus.PROCESSING, PaymentStatus.SUCCESS, PaymentStatus.FAILED];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      success: true,
      status: randomStatus,
      transaction_id: transactionId,
      amount: 10.00,
      phone_number: '0244 123 456'
    };
  }

  // Get provider display name
  getProviderDisplayName(provider: MoMoProvider): string {
    const names = {
      [MoMoProvider.MTN]: 'MTN MoMo',
      [MoMoProvider.VODAFONE]: 'Vodafone Cash',
      [MoMoProvider.AIRTEL]: 'AirtelTigo Money'
    };
    return names[provider] || provider;
  }

  // Get provider color
  getProviderColor(provider: MoMoProvider): string {
    const colors = {
      [MoMoProvider.MTN]: 'bg-yellow-500',
      [MoMoProvider.VODAFONE]: 'bg-red-500',
      [MoMoProvider.AIRTEL]: 'bg-red-600'
    };
    return colors[provider] || 'bg-gray-500';
  }
}

// Export singleton instance
export const paymentService = new MobileMoneyService();

// Export utility functions
export const generatePaymentReference = paymentService.generatePaymentReference.bind(paymentService);
export const validateGhanaPhone = paymentService.validateGhanaPhone.bind(paymentService);


