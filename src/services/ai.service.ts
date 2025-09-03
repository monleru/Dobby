import axios from 'axios';
import { ConversationMessage, AIResponse } from '../types';
import { config } from '../config/environment';
import { AI_MODELS } from '../config/ai-models';

/**
 * Service for AI API interactions
 */
export class AIService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = config.ai.baseUrl;
    this.apiKey = config.ai.apiKey || '';
  }

  /**
   * Call AI API with conversation context
   */
  async generateResponse(messages: ConversationMessage[], modelKey: string): Promise<string> {
    try {
      const model = AI_MODELS[modelKey];
      if (!model) {
        throw new Error(`Unknown model: ${modelKey}`);
      }

      const payload = {
        model: model.endpoint,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 4096,
        temperature: 0.6,
        top_p: 1,
        top_k: 40
      };

      const response = await axios.post<AIResponse>(
        `${this.baseUrl}/chat/completions`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response content from AI API');
      }

      return aiResponse;
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw new Error(`AI API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test AI API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const testMessage: ConversationMessage = {
        role: 'user',
        content: 'Hello',
        timestamp: Date.now()
      };

      await this.generateResponse([testMessage], 'dobby-mini');
      return true;
    } catch (error) {
      console.error('AI API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get available models info
   */
  getAvailableModels(): typeof AI_MODELS {
    return AI_MODELS;
  }
}
