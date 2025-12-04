/**
 * Rich Text Display Component
 * Safely renders HTML content from rich text editor
 */

"use client";

import React from 'react';
import './RichTextDisplay.css';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className = '' }: RichTextDisplayProps) {
  // Remove empty paragraphs and clean up the HTML
  const cleanHtml = content
    .replace(/<p><\/p>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .trim();

  // If content is empty after cleaning, return null
  if (!cleanHtml || cleanHtml === '<p></p>') {
    return null;
  }

  return (
    <div
      className={`rich-text-display ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
