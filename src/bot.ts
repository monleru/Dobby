import { Telegraf } from 'telegraf';
import { validateEnvironment, config } from './config/environment';
import { ConversationService } from './services/conversation.service';
import { AIService } from './services/ai.service';
import { UserPreferencesService } from './services/user-preferences.service';
import { CommandHandler } from './handlers/command.handler';
import { MessageHandler } from './handlers/message.handler';
import { CallbackHandler } from './handlers/callback.handler';

/**
 * Main Telegram AI Bot class
 */
export class SentientAIBot {
  private bot: Telegraf;
  private conversationService: ConversationService;
  private aiService: AIService;
  private userPreferencesService: UserPreferencesService;
  private commandHandler: CommandHandler;
  private messageHandler: MessageHandler;
  private callbackHandler: CallbackHandler;

  constructor() {
    // Validate environment variables
    validateEnvironment();

    // Initialize services
    this.conversationService = new ConversationService();
    this.aiService = new AIService();
    this.userPreferencesService = new UserPreferencesService();

    // Initialize handlers
    this.commandHandler = new CommandHandler(this.userPreferencesService, this.conversationService);
    this.messageHandler = new MessageHandler(this.conversationService, this.aiService, this.userPreferencesService);
    this.callbackHandler = new CallbackHandler(this.userPreferencesService);

    // Create bot instance
    this.bot = new Telegraf(config.telegram.token || '');

    // Setup bot
    this.setupMiddleware();
    this.setupCommands();
    this.setupMessageHandlers();
    this.setupCallbackHandlers();
    this.setupErrorHandlers();
  }

  /**
   * Setup middleware for logging and monitoring
   */
  private setupMiddleware(): void {
    // Logging middleware
    this.bot.use(async (ctx, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${ctx.updateType} processed in ${ms}ms`);
    });
  }

  /**
   * Setup bot commands
   */
  private setupCommands(): void {
    // Start command
    this.bot.start(async (ctx) => {
      await this.commandHandler.handleStart(ctx);
    });

    // Help command
    this.bot.help(async (ctx) => {
      await this.commandHandler.handleHelp(ctx);
    });

    // Chat command
    this.bot.command('chat', async (ctx) => {
      await this.commandHandler.handleChat(ctx);
    });

    // Clear command
    this.bot.command('clear', async (ctx) => {
      await this.commandHandler.handleClear(ctx);
    });

    // Status command
    this.bot.command('status', async (ctx) => {
      await this.commandHandler.handleStatus(ctx);
    });

    // Models command
    this.bot.command('models', async (ctx) => {
      await this.commandHandler.handleModels(ctx);
    });

    // Model change command
    this.bot.command('model', async (ctx) => {
      await this.commandHandler.handleModelChange(ctx);
    });
  }

  /**
   * Setup message handlers
   */
  private setupMessageHandlers(): void {
    // Handle text messages
    this.bot.on('text', async (ctx) => {
      await this.messageHandler.handleMessage(ctx);
    });
  }

  /**
   * Setup callback query handlers
   */
  private setupCallbackHandlers(): void {
    // Handle callback queries (button clicks)
    this.bot.on('callback_query', async (ctx) => {
      await this.callbackHandler.handleCallback(ctx);
    });
  }

  /**
   * Setup error handlers
   */
  private setupErrorHandlers(): void {
    this.bot.catch((err, ctx) => {
      console.error('Bot error:', err);
      ctx.reply('❌ An unexpected error occurred. Please try again later.');
    });
  }

  /**
   * Start the bot
   */
  async start(): Promise<void> {
    try {
      console.log('Starting Sentient AI Bot...');
      
      // Test AI API connection
      const aiConnected = await this.aiService.testConnection();
      if (!aiConnected) {
        console.warn('Warning: AI API connection test failed');
      }

      // Launch bot
      await this.bot.launch();
      
      console.log('✅ Sentient AI Bot started successfully!');
      console.log('🤖 Bot username:', (await this.bot.telegram.getMe()).username);
      
      // Enable graceful stop
      process.once('SIGINT', () => this.bot.stop('SIGINT'));
      process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
      
    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      throw error;
    }
  }

  /**
   * Stop the bot
   */
  async stop(): Promise<void> {
    try {
      await this.bot.stop();
      console.log('✅ Bot stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping bot:', error);
    }
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const bot = new SentientAIBot();
    await bot.start();
  } catch (error) {
    console.error('Bot startup error:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}
