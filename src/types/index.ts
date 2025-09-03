// Core types for the Telegram AI Bot

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ConversationHistory {
  [chatId: number]: ConversationMessage[];
}

export interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface UserModelPreferences {
  [userId: number]: string;
}

export interface AIModel {
  name: string;
  endpoint: string;
  description: string;
  parameters: number;
}

export interface AIModels {
  [key: string]: AIModel;
}
