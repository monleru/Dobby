import { ConversationHistory, ConversationMessage } from '../types';

/**
 * Service for managing conversation history and context
 */
export class ConversationService {
  private conversationHistory: ConversationHistory = {};

  /**
   * Add message to conversation history
   */
  addMessage(chatId: number, role: 'user' | 'assistant' | 'system', content: string): void {
    if (!this.conversationHistory[chatId]) {
      this.conversationHistory[chatId] = [];
    }

    const history = this.conversationHistory[chatId];
    if (history) {
      history.push({
        role,
        content,
        timestamp: Date.now()
      });

      // Keep only last 50 messages
      if (history.length > 50) {
        this.conversationHistory[chatId] = history.slice(-50);
      }
    }
  }

  /**
   * Get conversation context for AI
   */
  getConversationContext(chatId: number, maxMessages: number = 10): ConversationMessage[] {
    const history = this.conversationHistory[chatId];
    if (!history) {
      return [];
    }
    return history.slice(-maxMessages);
  }

  /**
   * Clear conversation history for a chat
   */
  clearHistory(chatId: number): void {
    delete this.conversationHistory[chatId];
  }

  /**
   * Get conversation statistics
   */
  getStats(chatId: number): { totalMessages: number; lastActivity: number | null } {
    const history = this.conversationHistory[chatId];
    if (!history || history.length === 0) {
      return { totalMessages: 0, lastActivity: null };
    }

    return {
      totalMessages: history.length,
      lastActivity: history[history.length - 1]?.timestamp || null
    };
  }
}
