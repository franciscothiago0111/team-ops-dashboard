/**
 * HTML to PDF Components Converter
 * Converts HTML from rich text editor to formatted React-PDF components
 * Preserves formatting like bold, italic, lists, headings, etc.
 */

import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const richTextStyles = StyleSheet.create({
  container: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1f2937',
  },
  paragraph: {
    marginBottom: 8,
    fontSize: 11,
    lineHeight: 1.5,
  },
  heading2: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 6,
    color: '#1f2937',
  },
  heading3: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 4,
    color: '#1f2937',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  italic: {
    fontFamily: 'Helvetica-Oblique',
  },
  boldItalic: {
    fontFamily: 'Helvetica-BoldOblique',
  },
  underline: {
    textDecoration: 'underline',
  },
  listContainer: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 3,
    fontSize: 11,
  },
  listBullet: {
    width: 20,
    fontSize: 11,
  },
  listContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.5,
  },
  orderedBullet: {
    width: 25,
    fontSize: 11,
  },
  link: {
    color: '#3b82f6',
  },
});

/**
 * Simple regex-based HTML parser for Quill output
 * Handles: <p>, <strong>, <em>, <u>, <h2>, <h3>, <ol>, <ul>, <li>, <a>
 */
function parseQuillHTML(html: string): React.ReactNode[] {
  if (!html || html.trim() === '') return [];

  const elements: React.ReactNode[] = [];
  let key = 0;

  // Clean HTML entities
  html = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Extract paragraphs and other block elements
  const blockRegex = /<(p|h2|h3|ul|ol)(?:\s[^>]*)?>([\s\S]+?)<\/\1>/g;
  let match;

  while ((match = blockRegex.exec(html)) !== null) {
    const [, tag, content] = match;

    if (tag === 'p') {
      // Parse inline elements within paragraph
      const inlineElements = parseInlineContent(content, `p-${key}`);
      if (inlineElements && inlineElements.length > 0) {
        elements.push(
          <View key={key++} style={richTextStyles.paragraph} wrap>
            <Text>{inlineElements}</Text>
          </View>
        );
      }
    } else if (tag === 'h2') {
      const inlineElements = parseInlineContent(content, `h2-${key}`);
      if (inlineElements && inlineElements.length > 0) {
        elements.push(
          <View key={key++} wrap={false}>
            <Text style={richTextStyles.heading2}>{inlineElements}</Text>
          </View>
        );
      }
    } else if (tag === 'h3') {
      const inlineElements = parseInlineContent(content, `h3-${key}`);
      if (inlineElements && inlineElements.length > 0) {
        elements.push(
          <View key={key++} wrap={false}>
            <Text style={richTextStyles.heading3}>{inlineElements}</Text>
          </View>
        );
      }
    } else if (tag === 'ul') {
      elements.push(parseList(content, `ul-${key++}`, false));
    } else if (tag === 'ol') {
      elements.push(parseList(content, `ol-${key++}`, true));
    }
  }

  // If no matches found or elements is empty, fallback to plain text
  if (elements.length === 0) {
    const cleanText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanText) {
      elements.push(
        <View key={0} style={richTextStyles.paragraph} wrap>
          <Text>{cleanText}</Text>
        </View>
      );
    }
  }

  return elements;
}

/**
 * Parse inline content (bold, italic, underline, links)
 */
function parseInlineContent(html: string, keyPrefix: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let key = 0;

  // Remove <br> tags and replace with space
  html = html.replace(/<br\s*\/?>/gi, ' ');

  // Pattern to match inline tags
  const inlineRegex = /<(strong|em|u|a)(?:\s[^>]*)?>(.+?)<\/\1>|([^<]+)/g;
  let match;

  while ((match = inlineRegex.exec(html)) !== null) {
    const [, tag, taggedContent, plainText] = match;

    if (plainText) {
      // Plain text
      const text = plainText.trim();
      if (text) {
        elements.push(text);
      }
    } else if (tag && taggedContent) {
      // Tagged content - recursively parse in case of nested tags
      const nestedContent = parseInlineContent(taggedContent, `${keyPrefix}-${key}`);
      const content = nestedContent.length > 0 ? nestedContent.join('') : taggedContent;

      let style;
      switch (tag) {
        case 'strong':
          style = richTextStyles.bold;
          break;
        case 'em':
          style = richTextStyles.italic;
          break;
        case 'u':
          style = richTextStyles.underline;
          break;
        case 'a':
          style = richTextStyles.link;
          break;
      }

      elements.push(
        <Text key={`${keyPrefix}-${key++}`} style={style}>
          {content}
        </Text>
      );
    }
  }

  // If nothing was parsed, return the plain text
  if (elements.length === 0) {
    const plainText = html.replace(/<[^>]+>/g, '').trim();
    if (plainText) {
      elements.push(plainText);
    }
  }

  return elements;
}

/**
 * Parse list (ul or ol)
 */
function parseList(html: string, keyPrefix: string, ordered: boolean): React.ReactNode {
  const items: React.ReactNode[] = [];
  const liRegex = /<li(?:\s[^>]*)?>(.+?)<\/li>/g;
  let match;
  let itemNumber = 1;

  while ((match = liRegex.exec(html)) !== null) {
    const content = match[1];
    const inlineElements = parseInlineContent(content, `${keyPrefix}-item-${itemNumber}`);

    items.push(
      <View key={`${keyPrefix}-item-${itemNumber}`} style={richTextStyles.listItem} wrap={false}>
        <Text style={ordered ? richTextStyles.orderedBullet : richTextStyles.listBullet}>
          {ordered ? `${itemNumber}.` : '•'}
        </Text>
        <Text style={richTextStyles.listContent}>{inlineElements}</Text>
      </View>
    );

    itemNumber++;
  }

  return (
    <View key={keyPrefix} style={richTextStyles.listContainer} wrap>
      {items}
    </View>
  );
}

/**
 * Convert HTML to React-PDF components
 * Main export function
 */
export function htmlToPDFElements(html: string): React.ReactNode {
  if (!html || html.trim() === '' || html === '<p><br></p>') return null;

  try {
    const elements = parseQuillHTML(html);

    if (!elements || elements.length === 0) {
      // Fallback to plain text if parsing fails
      const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (plainText) {
        return (
          <View style={richTextStyles.container} wrap>
            <Text>{plainText}</Text>
          </View>
        );
      }
      return null;
    }

    return <View style={richTextStyles.container} wrap>{elements}</View>;
  } catch (error) {
    console.error('Error parsing HTML for PDF:', error);
    // Fallback to plain text
    const plainText = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (plainText) {
      return (
        <View style={richTextStyles.container} wrap>
          <Text>{plainText}</Text>
        </View>
      );
    }
    return null;
  }
}

/**
 * Simple wrapper component for rich text in PDFs
 */
interface RichTextPDFProps {
  html: string;
}

export const RichTextPDF: React.FC<RichTextPDFProps> = ({ html }) => {
  const content = htmlToPDFElements(html);

  if (!content) {
    return null;
  }

  return <>{content}</>;
};
