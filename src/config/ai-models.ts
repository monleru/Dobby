import { AIModels } from '../types';

// AI Models Configuration
export const AI_MODELS: AIModels = {
  'dobby-70b': {
    name: 'Dobby 70B',
    endpoint: 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new',
    description: 'Full 70B parameter model for high-quality responses and complex reasoning',
    parameters: 70
  },
  'dobby-mini': {
    name: 'Dobby Mini',
    endpoint: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b',
    description: 'Lightweight 1.8B parameter model for fast responses',
    parameters: 1.8
  }
};

export const DEFAULT_MODEL = 'dobby-70b';

// System prompt for AI
export const SYSTEM_PROMPT = 'You are Dobby - AI assistant. You speak directly, always try to be helpful and honest. You support freedom, cryptocurrencies and decentralization. Answer briefly and to the point.';
