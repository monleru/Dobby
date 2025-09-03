// Markdown utilities for Telegram

/**
 * Escapes MarkdownV2 special characters
 * @param text - Text to escape
 * @returns Escaped text safe for MarkdownV2
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
}

/**
 * Smart escape that preserves valid markdown formatting
 * @param text - Text to process
 * @returns Text with preserved formatting and escaped special chars
 */
export function smartEscapeMarkdown(text: string): string {
  // Escape special characters but preserve markdown formatting
  return text
    .replace(/([_`>#+=|{}.!-])/g, '\\$1')  // Escape problematic chars
    .replace(/\\\*/g, '*')                   // Keep asterisks for bold/italic
    .replace(/\\\[/g, '[')                   // Keep brackets
    .replace(/\\\]/g, ']')                   // Keep brackets
    .replace(/\\\(/g, '(')                   // Keep parentheses
    .replace(/\\\)/g, ')');                  // Keep parentheses
}
