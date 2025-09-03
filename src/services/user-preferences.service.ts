import { UserModelPreferences } from '../types';
import { DEFAULT_MODEL, AI_MODELS } from '../config/ai-models';

/**
 * Service for managing user preferences and settings
 */
export class UserPreferencesService {
  private userModelPreferences: UserModelPreferences = {};

  /**
   * Get user's preferred AI model
   */
  getUserModel(userId: number): string {
    const userModel = this.userModelPreferences[userId] || DEFAULT_MODEL;
    return AI_MODELS[userModel] ? userModel : DEFAULT_MODEL;
  }

  /**
   * Set user's preferred AI model
   */
  setUserModel(userId: number, modelKey: string): boolean {
    if (!AI_MODELS[modelKey]) {
      return false;
    }

    this.userModelPreferences[userId] = modelKey;
    return true;
  }

  /**
   * Get user's current model info
   */
  getUserModelInfo(userId: number) {
    const modelKey = this.getUserModel(userId);
    return {
      key: modelKey,
      ...AI_MODELS[modelKey]
    };
  }

  /**
   * Get all user preferences
   */
  getAllPreferences(): UserModelPreferences {
    return { ...this.userModelPreferences };
  }

  /**
   * Reset user preferences to default
   */
  resetUserPreferences(userId: number): void {
    delete this.userModelPreferences[userId];
  }

  /**
   * Get users count by model preference
   */
  getModelUsageStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    for (const modelKey of Object.keys(AI_MODELS)) {
      stats[modelKey] = 0;
    }

    for (const userId of Object.keys(this.userModelPreferences)) {
      const modelKey = this.userModelPreferences[parseInt(userId)];
      if (modelKey && stats[modelKey] !== undefined) {
        stats[modelKey]++;
      }
    }

    return stats;
  }
}
