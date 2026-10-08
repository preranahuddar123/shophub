'use client';

import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function run(command: string, value?: string) {
  document.execCommand(command, false, value);
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if ((el.innerHTML || '') !== (value || '')) {
      el.innerHTML = value || '';
    }
  }, [value]);

  const apply = (command: string, arg?: string) => {
    editorRef.current?.focus();
    run(command, arg);
    onChange(editorRef.current?.innerHTML || '');
  };

  const insertLink = () => {
    const url = window.prompt('Enter link URL');
    if (!url) return;
    apply('createLink', url);
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL');
    if (!url) return;
    apply('insertImage', url);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-1 border-b border-gray-100 px-2 py-1.5">
        <button
          type="button"
          title="Bold"
          className="h-8 w-8 rounded text-sm font-bold text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            apply('bold');
          }}
        >
          B
        </button>
        <button
          type="button"
          title="Italic"
          className="h-8 w-8 rounded text-sm italic text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            apply('italic');
          }}
        >
          I
        </button>
        <button
          type="button"
          title="Bullet list"
          className="h-8 w-8 rounded text-sm text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            apply('insertUnorderedList');
          }}
        >
          ≡
        </button>
        <button
          type="button"
          title="Insert link"
          className="h-8 w-8 rounded text-sm text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            insertLink();
          }}
        >
          🔗
        </button>
        <button
          type="button"
          title="Insert image"
          className="h-8 w-8 rounded text-sm text-gray-700 hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            insertImage();
          }}
        >
          🖼
        </button>
      </div>
      <div className="relative">
        {!value && (
          <p className="pointer-events-none absolute left-3.5 top-3 text-sm text-gray-400">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[140px] px-3.5 py-3 text-sm text-gray-900 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_img]:max-h-40 [&_img]:rounded"
          onInput={() => onChange(editorRef.current?.innerHTML || '')}
        />
      </div>
    </div>
  );
}
