import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment configuration
export const config = {
  telegram: {
    token: process.env.TELEGRAM_TOKEN
  },
  ai: {
    apiKey: process.env.FIREWORKS_API_KEY,
    baseUrl: 'https://api.fireworks.ai/inference/v1'
  }
};

// Validate required environment variables
export function validateEnvironment(): void {
  if (!config.telegram.token) {
    throw new Error('TELEGRAM_TOKEN not found in .env file');
  }
  if (!config.ai.apiKey) {
    throw new Error('FIREWORKS_API_KEY not found in .env file');
  }
}
