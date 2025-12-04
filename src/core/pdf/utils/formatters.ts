/**
 * PDF Formatting Utilities
 */

/**
 * Format date for PDF display
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  } catch {
    return 'Invalid Date';
  }
}

/**
 * Format datetime for PDF display
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  } catch {
    return 'Invalid Date';
  }
}

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
