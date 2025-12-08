/**
 * Rich Text Editor Component
 * Wrapper around Editor.js for rich text editing
 */

"use client";

import React, { forwardRef, useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Link from '@editorjs/link';
import Underline from '@editorjs/underline';
import edjsHTML from 'editorjs-html';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const edjsParser = edjsHTML();

// Helper to convert HTML to Editor.js blocks (basic implementation)
const htmlToEditorJS = (html: string): OutputData => {
  if (!html || html === '<p></p>' || html === '') {
    return { blocks: [] };
  }

  // Basic HTML parsing - this is a simplified version
  const blocks: Array<{
    type: string;
    data: Record<string, unknown>;
  }> = [];
  const div = document.createElement('div');
  div.innerHTML = html;

  const processNode = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({
          type: 'paragraph',
          data: { text }
        });
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      if (element.tagName === 'P') {
        blocks.push({
          type: 'paragraph',
          data: { text: element.innerHTML }
        });
      } else if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
        blocks.push({
          type: 'header',
          data: {
            text: element.textContent,
            level: parseInt(element.tagName[1])
          }
        });
      } else if (element.tagName === 'UL') {
        const items = Array.from(element.querySelectorAll('li')).map(li => li.innerHTML);
        blocks.push({
          type: 'list',
          data: {
            style: 'unordered',
            items
          }
        });
      } else if (element.tagName === 'OL') {
        const items = Array.from(element.querySelectorAll('li')).map(li => li.innerHTML);
        blocks.push({
          type: 'list',
          data: {
            style: 'ordered',
            items
          }
        });
      } else {
        // Process children
        Array.from(element.childNodes).forEach(processNode);
      }
    }
  };

  Array.from(div.childNodes).forEach(processNode);

  return { blocks };
};

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, label, error, disabled }, ref) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef(false);

    useEffect(() => {
      if (!holderRef.current || isInitialized.current) return;

      const initData = value ? htmlToEditorJS(value) : { blocks: [] };

      editorRef.current = new EditorJS({
        holder: holderRef.current,
        placeholder: placeholder || 'Digite aqui...',
        readOnly: disabled,
        data: initData,
        tools: {
          header: {
            // @ts-expect-error - EditorJS type incompatibility with plugin versions
            class: Header,
            config: {
              placeholder: 'Digite um título...',
              levels: [2, 3],
              defaultLevel: 2
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          link: {
            class: Link,
          },
          underline: Underline,
        },
        onChange: async () => {
          if (editorRef.current && !disabled) {
            try {
              const outputData = await editorRef.current.save();
              const html = edjsParser.parse(outputData);
              onChange(Array.isArray(html) ? html.join('') : html);
            } catch (error) {
              console.error('Error saving editor content:', error);
            }
          }
        },
      });

      isInitialized.current = true;

      return () => {
        if (editorRef.current && typeof editorRef.current.destroy === 'function') {
          try {
            editorRef.current.destroy();
          } catch (error) {
            console.error('Error destroying editor:', error);
          }
          editorRef.current = null;
          isInitialized.current = false;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update readOnly state when disabled prop changes
    useEffect(() => {
      if (editorRef.current && isInitialized.current && editorRef.current.readOnly) {
        try {
          editorRef.current.readOnly.toggle(disabled || false);
        } catch (error) {
          console.error('Error toggling readOnly:', error);
        }
      }
    }, [disabled]);

    return (
      <div ref={ref} className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div
          className={`rich-text-editor border rounded-lg min-h-32 ${error ? 'border-red-500' : 'border-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
        >
          <div
            ref={holderRef}
            className="px-4 py-2"
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';