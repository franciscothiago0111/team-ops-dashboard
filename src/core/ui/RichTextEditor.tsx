/**
 * Rich Text Editor Component
 * Wrapper around react-draft-wysiwyg for rich text editing
 */

"use client";

import React, { forwardRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './RichTextEditor.css';

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, label, error, disabled }, ref) => {
    // Initialize as true on client, false on server for SSR safety
    const [mounted] = useState(() => typeof window !== 'undefined');

    const [editorState, setEditorState] = useState(() => {
      if (value) {
        try {
          const blocksFromHTML = convertFromHTML(value);
          const contentState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
          );
          return EditorState.createWithContent(contentState);
        } catch {
          return EditorState.createEmpty();
        }
      }
      return EditorState.createEmpty();
    });

    const onEditorStateChange = (newEditorState: EditorState) => {
      setEditorState(newEditorState);
      const html = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
      onChange(html);
    };

    const toolbarConfig = {
      options: ['inline', 'list', 'link', 'history'],
      inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough'],
      },
      list: {
        options: ['unordered', 'ordered'],
      },
    };

    if (!mounted) {
      return (
        <div ref={ref} className="space-y-1">
          {label && (
            <label className="block text-sm font-medium text-slate-700">
              {label}
            </label>
          )}
          <div className="h-32 w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50" />
        </div>
      );
    }

    return (
      <div ref={ref} className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className={`rich-text-editor border rounded-lg ${error ? 'border-red-500' : 'border-slate-200'} ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}>
          <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            toolbar={toolbarConfig}
            placeholder={placeholder}
            readOnly={disabled}
            editorClassName="px-4 py-2 min-h-[128px]"
            toolbarClassName="border-b border-slate-200"
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
