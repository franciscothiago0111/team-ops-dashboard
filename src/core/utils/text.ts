/**
 * Text utility functions
 */

/**
 * Strips HTML tags from a string
 * @param html - The HTML string to clean
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");

  // Remove extra whitespace and trim
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Truncates text to a maximum length
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Strips HTML and truncates text
 * @param html - The HTML string to clean and truncate
 * @param maxLength - Maximum length
 */
export function stripAndTruncate(html: string, maxLength: number): string {
  const plainText = stripHtmlTags(html);
  return truncateText(plainText, maxLength);
}
