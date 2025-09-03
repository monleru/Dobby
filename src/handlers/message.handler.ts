import { Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import { ConversationService } from '../services/conversation.service';
import { AIService } from '../services/ai.service';
import { UserPreferencesService } from '../services/user-preferences.service';
import { escapeMarkdown } from '../utils/markdown';
import { SYSTEM_PROMPT } from '../config/ai-models';

/**
 * Handler for user messages and AI responses
 */
export class MessageHandler {
  constructor(
    private conversationService: ConversationService,
    private aiService: AIService,
    private userPreferencesService: UserPreferencesService
  ) {}

  /**
   * Handle incoming user message
   */
  async handleMessage(ctx: Context): Promise<void> {
    const user = ctx.from;
    const chatId = ctx.chat?.id;
    const message = ctx.message as Message.TextMessage;

    if (!user || !chatId || !message || message.text === undefined) return;

    const text = message.text;
    if (!text) return;

    // Skip commands
    if (text.startsWith('/')) return;

    // Check if bot should respond (group chat tagging or private chat)
    if (!this.shouldRespond(ctx)) return;

    try {
      // Clean and add user message to history
      const cleanText = this.cleanMessageText(text, ctx);
      this.conversationService.addMessage(chatId, 'user', cleanText);

      // Show typing indicator
      await ctx.sendChatAction('typing');

      // Get conversation context
      const conversationContext = this.conversationService.getConversationContext(chatId);

      // Add system message
      const systemMessage = {
        role: 'system' as const,
        content: SYSTEM_PROMPT,
        timestamp: Date.now()
      };

      // Form messages for AI
      const aiMessages = [systemMessage, ...conversationContext];

      // Get user's preferred model
      const userId = user.id;
      const selectedModel = this.userPreferencesService.getUserModel(userId);

      // Send thinking message first as reply to user's message
      const thinkingMsg = await ctx.reply('🤖 Dobby is thinking\\.\\.\\.', { 
        parse_mode: 'MarkdownV2',
        reply_parameters: {
          message_id: message.message_id
        }
      });
      
      try {
        // Call AI API
        const aiResponse = await this.aiService.generateResponse(aiMessages, selectedModel);
        
        // Add AI response to history
        this.conversationService.addMessage(chatId, 'assistant', aiResponse);
        
        // Delete thinking message and send AI response as reply
        await ctx.telegram.deleteMessage(ctx.chat?.id, thinkingMsg.message_id);
        await ctx.reply(escapeMarkdown(aiResponse), { 
          parse_mode: 'MarkdownV2',
          reply_parameters: {
            message_id: message.message_id
          }
        });
      } catch (error) {
        console.error('Error calling AI API:', error);
        
        // Delete thinking message and send error as reply
        await ctx.telegram.deleteMessage(ctx.chat?.id, thinkingMsg.message_id);
        await ctx.reply('❌ Error: Failed to get AI response\\. Please try again\\.', { 
          parse_mode: 'MarkdownV2',
          reply_parameters: {
            message_id: message.message_id
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await ctx.reply('❌ An error occurred while processing the message\\. Please try again later\\.', { 
        parse_mode: 'MarkdownV2' 
      });
    }
  }

  /**
   * Check if bot should respond to this message
   */
  private shouldRespond(ctx: Context): boolean {
    const chatType = ctx.chat?.type;
    const message = ctx.message as Message.TextMessage;

    if (!message || message.text === undefined) {
      return false;
    }

    const text = message.text || '';

    // In private chats, respond to all messages
    if (chatType === 'private') {
      return true;
    }

    // In group chats, only respond when tagged
    if (chatType === 'group' || chatType === 'supergroup') {
      const botUsername = ctx.botInfo?.username;
      if (botUsername) {
        return text.includes(`@${botUsername}`);
      }
    }

    return false;
  }

  /**
   * Clean message text for processing
   */
  private cleanMessageText(text: string, ctx: Context): string {
    // Remove bot username if present
    const botUsername = ctx.botInfo?.username;
    if (botUsername) {
      text = text.replace(new RegExp(`@${botUsername}`, 'gi'), '').trim();
    }

    return text;
  }
}
