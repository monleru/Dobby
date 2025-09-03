import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { escapeMarkdown } from '../utils/markdown';
import { AI_MODELS } from '../config/ai-models';
import { UserPreferencesService } from '../services/user-preferences.service';

/**
 * Handler for callback queries (button clicks)
 */
export class CallbackHandler {
  constructor(
    private userPreferencesService: UserPreferencesService
  ) {}

  /**
   * Handle callback query
   */
  async handleCallback(ctx: Context): Promise<void> {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    const callbackData = callbackQuery?.data;
    const userId = ctx.from?.id;

    if (!userId || !callbackData) {
      await ctx.answerCbQuery('❌ Unable to process callback');
      return;
    }

    if (callbackData.startsWith('model_')) {
      await this.handleModelSelection(ctx, callbackData, userId);
    } else {
      await ctx.answerCbQuery('❌ Unknown callback type');
    }
  }

  /**
   * Handle model selection callback
   */
  private async handleModelSelection(ctx: Context, callbackData: string, userId: number): Promise<void> {
    const modelKey = callbackData.replace('model_', '');
    
    if (AI_MODELS[modelKey]) {
      // Update user's model preference
      this.userPreferencesService.setUserModel(userId, modelKey);
      const modelInfo = this.userPreferencesService.getUserModelInfo(userId);
      
      // Answer callback query
      await ctx.answerCbQuery(`✅ Model changed to ${modelKey}!`);
      
      // Send confirmation message
      await ctx.reply(
        `🎉 **Model changed successfully\\!**\n\n` +
        `**New model:** ${escapeMarkdown(modelKey)}\n` +
        `**Model URL:** \`${escapeMarkdown(modelInfo.endpoint || 'Unknown')}\`\n\n` +
        `Your conversation will now use this model\\. You can use /models to see your current selection\\.`,
        { parse_mode: 'MarkdownV2' }
      );
      
      // Update the original message to show current selection
      await this.updateModelsMessage(ctx, userId);
    } else {
      await ctx.answerCbQuery('❌ Invalid model selected');
    }
  }

  /**
   * Update the models message with current selection
   */
  private async updateModelsMessage(ctx: Context, userId: number): Promise<void> {
    try {
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

      // Edit the original message
      await ctx.editMessageText(modelsMessage, {
        parse_mode: 'MarkdownV2',
        reply_markup: keyboard
      });
    } catch (error) {
      console.error('Error updating models message:', error);
    }
  }
}
