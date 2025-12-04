/**
 * HTML to Plain Text Converter for PDF
 * Converts HTML from rich text editor to plain text suitable for PDF rendering
 */

/**
 * Converts HTML content to plain text with basic formatting preserved
 * Removes HTML tags but maintains structure (line breaks, lists, etc.)
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';

  // Remove script and style tags completely
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Convert common HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");

  // Convert headings to uppercase with extra spacing
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n');

  // Convert line breaks and paragraphs
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Convert lists
  text = text.replace(/<li[^>]*>/gi, '• ');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<\/?[ou]l[^>]*>/gi, '\n');

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Clean up whitespace
  text = text.replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines
  text = text.replace(/[ \t]+/g, ' '); // Multiple spaces to single space
  text = text.trim();

  return text;
}

/**
 * Splits long text into chunks suitable for PDF pagination
 * @param text - The text to split
 * @param maxLength - Maximum characters per chunk (default: 1000)
 */
export function splitTextForPDF(text: string, maxLength: number = 1000): string[] {
  if (text.length <= maxLength) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split('\n\n');
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 <= maxLength) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk) chunks.push(currentChunk);

      // If single paragraph is too long, split by sentences
      if (paragraph.length > maxLength) {
        const sentences = paragraph.split('. ');
        let tempChunk = '';

        for (const sentence of sentences) {
          if (tempChunk.length + sentence.length + 2 <= maxLength) {
            tempChunk += (tempChunk ? '. ' : '') + sentence;
          } else {
            if (tempChunk) chunks.push(tempChunk + '.');
            tempChunk = sentence;
          }
        }

        currentChunk = tempChunk;
      } else {
        currentChunk = paragraph;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
