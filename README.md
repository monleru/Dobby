# 🤖 Sentient AI - Advanced Telegram Bot

> **Next-generation AI-powered Telegram bot featuring the revolutionary Dobby models with multi-model support, intelligent conversation management, and seamless user experience.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.15.6-purple.svg)](https://telegraf.js.org/)

## 🌟 Live Demo

**Try our official bot right now:** [@askDobbybot](https://t.me/askDobbybot)

Experience the power of Sentient AI with our live Telegram bot featuring the revolutionary Dobby models!

## 🚀 Features

### 🧠 **Advanced AI Integration**
- **Multi-Model Support**: Choose between Dobby 70B and Dobby Mini models
- **Fireworks AI Backend**: Enterprise-grade AI infrastructure with 99.9% uptime
- **Intelligent Context**: Maintains conversation history for coherent, contextual discussions
- **Smart Formatting**: Telegram-optimized MarkdownV2 responses with proper escaping
- **Real-time Processing**: Instant AI responses with thinking indicators

### 💬 **Enhanced User Experience**
- **Interactive Model Selection**: Inline keyboard buttons for instant model switching
- **Thinking Indicators**: Real-time "🤖 Dobby is thinking..." feedback with reply threading
- **Reply Threading**: All responses properly linked to user messages for better conversation flow
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Multi-Chat Support**: Independent conversations per chat with memory management

### 🔧 **Developer Experience**
- **TypeScript**: Full type safety and modern development with strict mode
- **Modular Architecture**: Clean, maintainable code following SOLID principles
- **Environment Configuration**: Secure token management with validation
- **Comprehensive Logging**: Detailed operation monitoring and performance metrics
- **Production Ready**: Docker support, process management, and scaling considerations

### 🎯 **Smart Conversation Features**
- **Context Memory**: Remembers last 50 messages per chat for coherent discussions
- **Smart Filtering**: Responds to all messages in private chats, only when tagged in groups
- **Conversation Management**: Automatic cleanup, history limits, and memory optimization
- **User Preferences**: Individual model selection per user with persistent storage
- **Statistics Tracking**: Message counts, activity timestamps, and usage analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/pnpm/yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Fireworks AI API Key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd sentimentAI

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp env.example .env
# Edit .env with your tokens
```

### Environment Setup

```bash
# .env file
TELEGRAM_TOKEN=your_telegram_bot_token_here
FIREWORKS_API_KEY=your_fireworks_api_key_here
```

### Running the Bot

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Watch mode for development
npm run watch
```

## 🤖 AI Models

### Available Models

| Model | Parameters | Use Case | Performance | Endpoint |
|-------|------------|----------|-------------|----------|
| **Dobby 70B** | 70B | High-quality responses, complex reasoning, detailed analysis | Premium quality, slower response | `accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new` |
| **Dobby Mini** | 1.8B | Fast responses, lightweight processing, quick answers | Fast response, good quality | `accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b` |

### Model Selection Features
- **Interactive Buttons**: Click to instantly switch between models
- **Command Line**: Use `/model <name>` for quick switching
- **User Persistence**: Each user's preference is saved individually
- **Real-time Switching**: Change models mid-conversation without losing context
- **Model Information**: Detailed stats and endpoint information

## 📱 Bot Commands

### Core Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/start` | Initialize the bot and show welcome message | Basic setup and introduction |
| `/help` | Display comprehensive help and usage guide | Get detailed assistance |
| `/chat` | Start a new conversation session | Activate private chat mode |
| `/clear` | Clear conversation history | Reset chat memory |
| `/status` | Show current AI model and bot status | View settings and statistics |
| `/models` | Display available models with interactive buttons | Choose your AI model |
| `/model <name>` | Change AI model via command line | Quick model switching |

### Advanced Features
- **Smart Context Management**: Automatic conversation history optimization
- **Memory Efficiency**: Intelligent cleanup and storage management
- **Performance Monitoring**: Response time tracking and analytics
- **Error Recovery**: Graceful handling of API failures and network issues

## 🏗️ Architecture

### Core Components

```typescript
class SentientAIBot {
  private setupMiddleware()      // Logging, monitoring, and session management
  private setupCommands()        // Bot command handlers and routing
  private setupMessageHandlers() // AI conversation processing and context management
  private setupCallbackHandlers() // Interactive button and callback processing
  private setupErrorHandlers()   // Error handling, recovery, and user feedback
}
```

### Service Layer

```typescript
// Core services with dependency injection
ConversationService    // Manages chat history and context
AIService             // Handles AI API interactions and responses
UserPreferencesService // Manages user settings and model preferences
```

### Handler Layer

```typescript
// Specialized handlers for different interaction types
CommandHandler         // Processes bot commands (/start, /help, etc.)
MessageHandler         // Handles user messages and AI responses
CallbackHandler        // Manages button clicks and interactive elements
```

### Data Flow

1. **User Input** → Message handler with context validation
2. **Context Retrieval** → Conversation history + system prompt + user preferences
3. **AI Processing** → Fireworks API call with selected model and parameters
4. **Response Generation** → Formatted MarkdownV2 output with proper escaping
5. **User Feedback** → Reply with proper threading and conversation management

### Conversation Management

- **Smart History**: Maintains last 50 messages per chat with automatic cleanup
- **Context Window**: Configurable message limit for AI context (default: 10)
- **Memory Efficiency**: Automatic cleanup, optimization, and storage management
- **Multi-Chat Support**: Independent conversations per chat ID with isolation
- **Performance Optimization**: Efficient data structures and memory management

## 🔐 Security & Configuration

### Environment Variables
- **TELEGRAM_TOKEN**: Bot authentication token with validation
- **FIREWORKS_API_KEY**: AI service API key with secure handling
- **Optional**: Custom model endpoints, rate limiting, and advanced configurations

### Security Features
- **Token Validation**: Environment variable validation on startup
- **API Security**: Secure API key handling and request signing
- **User Isolation**: Chat-level conversation isolation and privacy
- **Rate Limiting**: Configurable request limits and abuse prevention
- **Error Handling**: Secure error messages without information leakage

### Best Practices
- Never commit `.env` files to version control
- Use environment-specific configurations for different deployments
- Implement rate limiting and monitoring for production use
- Monitor API usage, costs, and performance metrics
- Regular security audits and dependency updates

## 🧪 Development

### Scripts

```bash
npm run dev      # Development with tsx (hot reload)
npm run build    # TypeScript compilation with strict checking
npm run start    # Production execution with error handling
npm run watch    # Watch mode compilation for development
npm run test     # Run test suite and validation
```

### Project Structure

```
sentimentAI/
├── src/
│   ├── config/              # Configuration management
│   │   ├── ai-models.ts     # AI model definitions and settings
│   │   └── environment.ts   # Environment variables and validation
│   ├── services/            # Core business logic
│   │   ├── ai.service.ts    # AI API integration
│   │   ├── conversation.service.ts  # Chat management
│   │   └── user-preferences.service.ts  # User settings
│   ├── handlers/            # Request processing
│   │   ├── command.handler.ts    # Bot commands
│   │   ├── message.handler.ts    # User messages
│   │   └── callback.handler.ts   # Interactive elements
│   ├── utils/               # Utility functions
│   │   └── markdown.ts      # Markdown processing
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # Core interfaces
│   └── bot.ts               # Main bot implementation
├── dist/                    # Compiled JavaScript output
├── .env.example            # Environment template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This documentation
```

### Adding New Features

1. **Commands**: Add handlers in `setupCommands()` method
2. **Models**: Extend `AI_MODELS` object in `ai-models.ts`
3. **Services**: Create new service classes following dependency injection pattern
4. **Handlers**: Implement new handlers for specific interaction types
5. **Middleware**: Add custom middleware in `setupMiddleware()` method

### Code Quality
- **TypeScript Strict Mode**: Full type safety and null checking
- **SOLID Principles**: Clean architecture and dependency injection
- **Error Handling**: Comprehensive error handling and user feedback
- **Logging**: Structured logging with performance metrics
- **Testing**: Unit tests and integration testing support

## 📊 Performance & Monitoring

### Metrics & Analytics
- **Response Time Tracking**: Real-time performance monitoring
- **API Call Success Rates**: Success/failure ratio tracking
- **User Interaction Patterns**: Usage analytics and behavior insights
- **Model Usage Statistics**: Performance comparison between models
- **Memory Usage Optimization**: Efficient resource management

### Performance Features
- **Efficient History Management**: Smart conversation context optimization
- **Context Window Sizing**: Configurable message limits for optimal performance
- **Rate Limiting & Caching**: Request optimization and abuse prevention
- **Memory Optimization**: Automatic cleanup and storage management
- **Async Processing**: Non-blocking operations for better responsiveness

### Monitoring & Alerts
- **Health Checks**: Bot status and API connectivity monitoring
- **Performance Alerts**: Response time and error rate notifications
- **Usage Analytics**: User engagement and feature usage tracking
- **Resource Monitoring**: Memory usage and system resource tracking
- **Error Reporting**: Comprehensive error logging and alerting

## 🌐 Deployment

### Production Considerations
- **Process Management**: PM2, Docker, or Kubernetes deployment
- **Logging**: Structured logging with log aggregation
- **Monitoring**: Health checks, metrics collection, and alerting
- **Scaling**: Load balancing and horizontal scaling support
- **Backup & Recovery**: Configuration and data backup strategies

### Docker Support
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3000
CMD ["npm", "start"]
```

### Deployment Options
- **Local Development**: `npm run dev` with hot reload
- **Production Server**: `npm run build && npm start`
- **Container Deployment**: Docker with health checks
- **Cloud Platforms**: AWS, Google Cloud, Azure support
- **Serverless**: Function-based deployment options

## 🤝 Contributing

### Development Workflow
1. Fork the repository and create a feature branch
2. Implement your changes following the established patterns
3. Add comprehensive tests and documentation
4. Ensure all TypeScript checks pass
5. Submit a pull request with detailed description

### Code Standards
- **TypeScript Strict Mode**: Full type safety and null checking
- **ESLint Configuration**: Code quality and style enforcement
- **Prettier Formatting**: Consistent code formatting
- **Conventional Commits**: Standardized commit message format
- **Code Review**: All changes require peer review

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: Service interaction testing
- **End-to-End Tests**: Full bot functionality testing
- **Performance Tests**: Load testing and optimization
- **Security Tests**: Vulnerability scanning and validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Creator

**Created with passion by [@Monleru](https://x.com/Monleru)**

Follow me on X for updates, AI insights, and more exciting projects! 🚀

## 📞 Support & Community

- **Live Bot**: [@askDobbybot](https://t.me/askDobbybot) - Try it now!

---

<div align="center">

[![GitHub Stars](https://img.shields.io/github/stars/your-username/sentimentAI?style=social)](https://github.com/your-username/sentimentAI)
[![GitHub Forks](https://img.shields.io/github/forks/your-username/sentimentAI?style=social)](https://github.com/your-username/sentimentAI)
[![GitHub Issues](https://img.shields.io/github/issues/your-username/sentimentAI)](https://github.com/your-username/sentimentAI)

**Try our bot:** [@askDobbybot](https://t.me/askDobbybot) 🚀

</div>