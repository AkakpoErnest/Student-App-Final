// Claude AI API Integration
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeError {
  error: {
    type: string;
    message: string;
  };
}

class ClaudeAPI {
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com/v1/messages';
  private model: string = 'claude-3-haiku-20240307'; // Fast and cost-effective model

  constructor() {
    // Use environment variable only
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Claude API key not found. Please set VITE_CLAUDE_API_KEY in your environment variables.');
    }
  }

  async sendMessage(
    messages: ClaudeMessage[],
    systemPrompt?: string
  ): Promise<{ content: string; error?: string }> {
    try {
      // Validate API key
      if (!this.apiKey || !this.apiKey.startsWith('sk-ant-')) {
        console.error('Invalid API key:', this.apiKey);
        throw new Error('Invalid Claude API key. Please check your environment variables.');
      }

      console.log('Making request to Claude API with key:', this.apiKey.substring(0, 20) + '...');

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1000,
          system: systemPrompt || this.getDefaultSystemPrompt(),
          messages: messages
        })
      });

      console.log('Claude API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: { message: errorText } };
        }
        throw new Error(`Claude API error: ${errorData.error?.message || `HTTP ${response.status}`}`);
      }

      const data = await response.json();
      console.log('Claude API success response:', data);
      return {
        content: data.content[0]?.text || 'No response generated'
      };
    } catch (error) {
      console.error('Claude API error:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Failed to get AI response'
      };
    }
  }

  private getDefaultSystemPrompt(): string {
    return `You are StuFind AI Assistant, a helpful AI assistant for the StuFind student marketplace app. 

StuFind is a platform where Ghanaian university students can:
- Buy and sell items (textbooks, electronics, clothing, furniture, etc.)
- Find internships and job opportunities
- Offer and hire services (tutoring, project help, etc.)
- Use secure escrow payments with Ghana Cedis (GHS)
- Connect with verified university students

Key Features:
- University verification system
- Token-based rewards program
- WhatsApp bot for buying/selling
- Mobile Money (MoMo) payment integration
- Dark/light theme support
- Real-time chat system

App Structure:
- Home page: Featured opportunities and categories
- Marketplace: Browse all available items and services
- Dashboard: User profile, posted items, tokens, verification status
- Post Opportunity: Create new listings
- How It Works: App explanation and features

Always be helpful, friendly, and provide accurate information about the app. If users ask about features not mentioned, politely explain that you're specifically designed to help with StuFind app questions.`;
  }

  // Quick response for simple questions
  async getQuickResponse(userMessage: string): Promise<string> {
    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: userMessage
      }
    ];

    const result = await this.sendMessage(messages);
    return result.content || 'Sorry, I couldn\'t process your request right now.';
  }

  // Context-aware response with app state
  async getContextualResponse(
    userMessage: string, 
    context: {
      currentPage?: string;
      userType?: 'buyer' | 'seller' | 'guest';
      university?: string;
      verificationStatus?: string;
    }
  ): Promise<string> {
    const contextualPrompt = `${this.getDefaultSystemPrompt()}

Current Context:
- Page: ${context.currentPage || 'Unknown'}
- User Type: ${context.userType || 'Guest'}
- University: ${context.university || 'Not specified'}
- Verification Status: ${context.verificationStatus || 'Not verified'}

Provide a helpful response considering the user's current context and app state.`;

    const messages: ClaudeMessage[] = [
      {
        role: 'user',
        content: userMessage
      }
    ];

    const result = await this.sendMessage(messages, contextualPrompt);
    return result.content || 'Sorry, I couldn\'t process your request right now.';
  }
}

export const claudeAPI = new ClaudeAPI();

// Test function for debugging
export const testClaudeAPI = async () => {
  console.log('Testing Claude API...');
  console.log('API Key loaded:', claudeAPI['apiKey'] ? 'Yes' : 'No');
  console.log('API Key preview:', claudeAPI['apiKey']?.substring(0, 20) + '...');
  
  try {
    const result = await claudeAPI.getQuickResponse('Hello, test message');
    console.log('API Test Result:', result);
    return result;
  } catch (error) {
    console.error('API Test Error:', error);
    return error;
  }
};

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testClaudeAPI = testClaudeAPI;
}
