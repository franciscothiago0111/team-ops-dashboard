/**
 * Rich Text Editor Component
 * Wrapper around React Quill for rich text editing
 */

"use client";

import React, { forwardRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';
import './RichTextEditor.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="border rounded-lg min-h-32 bg-slate-50 animate-pulse" />
});

interface IRichTextEditorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, label, error, disabled }, ref) => {

    // Quill modules configuration
    const modules = useMemo(() => ({
      toolbar: [
        [{ 'header': [2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ],
    }), []);

    const formats = [
      'header',
      'bold', 'italic', 'underline',
      'list', 'bullet',
      'link'
    ];

    const handleChange = (content: string) => {
      console.log('📝 Quill onChange - Content:', content);
      // Quill always returns at least <p><br></p> for empty content
      // We need to pass this through so validation can handle it
      onChange(content);
    };

    return (
      <div ref={ref} className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div
          className={`rich-text-editor ${error ? 'rich-text-editor-error' : ''} ${disabled ? 'disabled' : ''}`}
        >
          <ReactQuill
            theme="snow"
            value={value || ''}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder || 'Digite aqui...'}
            readOnly={disabled}
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