/**
 * Image Proxy Utility
 * Handles external images with CORS issues
 */

/**
 * Fetch image and convert to base64 data URI
 * Useful for external images that might have CORS issues
 */
export async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    // Detect content type
    const contentType = response.headers.get('content-type') || 'image/png';

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}

/**
 * Check if URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Process image URL for PDF
 * Converts external URLs to base64, leaves local paths as-is
 */
export async function processImageUrl(url: string): Promise<string> {
  if (!url) return '';

  if (isExternalUrl(url)) {
    return await fetchImageAsBase64(url);
  }

  return url;
}
