import { Context } from 'telegraf';
import { escapeMarkdown } from '../utils/markdown';
import { AI_MODELS } from '../config/ai-models';
import { UserPreferencesService } from '../services/user-preferences.service';
import { ConversationService } from '../services/conversation.service';
import { Message } from 'telegraf/typings/core/types/typegram';

/**
 * Handler for bot commands
 */
export class CommandHandler {
  constructor(
    private userPreferencesService: UserPreferencesService,
    private conversationService: ConversationService
  ) {}

  /**
   * Handle /start command
   */
  async handleStart(ctx: Context): Promise<void> {
    const user = ctx.from;
    if (!user) return;

    const welcomeMessage = 
      '🌟 **Welcome to Sentient AI Bot\\!**\n\n' +
      'I\'m Dobby, your AI assistant powered by advanced language models\\.\n\n' +
      '**What I can do:**\n' +
      '• Answer questions and engage in conversations\n' +
      '• Support multiple AI models (70B and Mini)\n' +
      '• Remember conversation context\n' +
      '• Provide formatted responses\n\n' +
      '**Commands:**\n' +
      '• /help - show this help message\n' +
      '• /chat - start a conversation\n' +
      '• /models - choose AI model\n' +
      '• /status - show current settings\n' +
      '• /clear - clear conversation history\n\n' +
      'Just send me a message to start chatting\\! 🚀';

    await ctx.reply(welcomeMessage, { parse_mode: 'MarkdownV2' });
  }

  /**
   * Handle /help command
   */
  async handleHelp(ctx: Context): Promise<void> {
    const helpMessage = 
      '📚 **Sentient AI Bot Help**\n\n' +
      '**Available Commands:**\n' +
      '• /start - welcome message and setup\n' +
      '• /help - this help message\n' +
      '• /chat - start a new conversation\n' +
      '• /clear - clear conversation history\n' +
      '• /status - show current AI model and settings\n' +
      '• /models - view and select AI models\n' +
      '• /model <name> - change AI model via command\n\n' +
      '**Usage:**\n' +
      '• In private chats: I respond to all messages\n' +
      '• In group chats: Tag me with @username to get my attention\n' +
      '• I remember conversation context for better responses\n' +
      '• Choose between Dobby 70B (quality) and Dobby Mini (speed)\n\n' +
      '**Need more help?** Just ask me anything\\! 🤖';

    await ctx.reply(helpMessage, { parse_mode: 'MarkdownV2' });
  }

  /**
   * Handle /chat command
   */
  async handleChat(ctx: Context): Promise<void> {
    const chatMessage = 
      '💬 **Chat Mode Activated\\!**\n\n' +
      'I\'m ready to chat with you\\! Send me any message and I\'ll respond using your selected AI model\\.\n\n' +
      '**Current AI Model:** ' + 
      escapeMarkdown(this.userPreferencesService.getUserModel(ctx.from?.id || 0)) + '\n\n' +
      '**Tip:** Use /models to change your AI model or /status to see current settings\\.';

    await ctx.reply(chatMessage, { parse_mode: 'MarkdownV2' });
  }

  /**
   * Handle /clear command
   */
  async handleClear(ctx: Context): Promise<void> {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    this.conversationService.clearHistory(chatId);
    
    const clearMessage = 
      '🧹 **Conversation History Cleared\\!**\n\n' +
      'Your chat history has been reset\\. I\'ll start fresh with our next conversation\\.';

    await ctx.reply(clearMessage, { parse_mode: 'MarkdownV2' });
  }

  /**
   * Handle /status command
   */
  async handleStatus(ctx: Context): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const userModelInfo = this.userPreferencesService.getUserModelInfo(userId);
    const chatId = ctx.chat?.id;
    const stats = chatId ? this.conversationService.getStats(chatId) : null;

    let statusMessage = 
      '📊 **Bot Status**\n\n' +
      '**Current AI Model:** ' + escapeMarkdown(userModelInfo.name || 'Unknown') + '\n' +
      '**Model Key:** `' + escapeMarkdown(userModelInfo.key) + '`\n' +
      '**Parameters:** ' + (userModelInfo.parameters || 0) + 'B\n' +
      '**Endpoint:** `' + escapeMarkdown(userModelInfo.endpoint || 'Unknown') + '`\n\n';

    if (stats) {
      statusMessage += 
        '**Chat Statistics:**\n' +
        '• Total Messages: ' + stats.totalMessages + '\n' +
        '• Last Activity: ' + (stats.lastActivity ? new Date(stats.lastActivity).toLocaleString() : 'Never') + '\n\n';
    }

    statusMessage += 
      '**Commands:**\n' +
      '• /models - change AI model\n' +
      '• /clear - reset conversation history\n' +
      '• /help - show all commands';

    await ctx.reply(statusMessage, { parse_mode: 'MarkdownV2' });
  }

  /**
   * Handle /models command
   */
  async handleModels(ctx: Context): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const currentModelKey = this.userPreferencesService.getUserModel(userId);
    let modelsMessage = '🤖 **Available AI Models:**\n\n';

    for (const [key, model] of Object.entries(AI_MODELS)) {
      const status = key === currentModelKey ? '✅ **CURRENT**' : '⚪';
      modelsMessage += `${status} **${escapeMarkdown(key)}**\n`;
      modelsMessage += `   ${escapeMarkdown(model.description)}\n\n`;
    }

    modelsMessage += '\n💡 **Click the button below to change your model:**\n\n';
    modelsMessage += `**Your current model:** ${escapeMarkdown(currentModelKey)}`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🤖 Dobby 70B', callback_data: 'model_dobby-70b' },
          { text: '⚡ Dobby Mini', callback_data: 'model_dobby-mini' }
        ]
      ]
    };

    await ctx.reply(modelsMessage, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard
    });
  }

  /**
   * Handle /model command with parameter
   */
  async handleModelChange(ctx: Context): Promise<void> {
    const userId = ctx.from?.id;
    if (!userId) return;

    const message = ctx.message as Message.TextMessage;
    const text = message?.text || '';
    const modelName = text.split(' ')[1];

    if (!modelName) {
      await ctx.reply(
        '❌ **Usage:** /model <model\\_name>\n\n' +
        '**Available models:**\n' +
        '• `dobby\\-70b` - Full 70B parameter model\n' +
        '• `dobby\\-mini` - Lightweight 1\\.8B parameter model\n\n' +
        '**Example:** /model dobby\\-mini',
        { parse_mode: 'MarkdownV2' }
      );
      return;
    }

    if (this.userPreferencesService.setUserModel(userId, modelName)) {
      const modelInfo = this.userPreferencesService.getUserModelInfo(userId);
      const successMessage = 
        '🎉 **Model changed successfully\\!**\n\n' +
        '**New model:** ' + escapeMarkdown(modelName) + '\n' +
        '**Model URL:** `' + escapeMarkdown(modelInfo.endpoint || 'Unknown') + '`\n\n' +
        'Your conversation will now use this model\\. You can use /models to see your current selection\\.';

      await ctx.reply(successMessage, { parse_mode: 'MarkdownV2' });
    } else {
      await ctx.reply(
        '❌ **Invalid model name\\!**\n\n' +
        '**Available models:**\n' +
        '• `dobby\\-70b` - Full 70B parameter model\n' +
        '• `dobby\\-mini` - Lightweight 1\\.8B parameter model',
        { parse_mode: 'MarkdownV2' }
      );
    }
  }
}
