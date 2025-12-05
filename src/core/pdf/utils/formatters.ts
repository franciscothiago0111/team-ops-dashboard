/**
 * PDF Formatting Utilities
 */

/**
 * Format date for PDF display
 */

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format status with proper casing
 */
export function formatStatus(status: string): string {
  if (!status) return 'Unknown';
  return status
    .split('_')
    .map(word => capitalize(word.toLowerCase()))
    .join(' ');
}

/**
 * Format priority
 */
export function formatPriority(priority: string): string {
  if (!priority) return 'Normal';
  return capitalize(priority.toLowerCase());
}
