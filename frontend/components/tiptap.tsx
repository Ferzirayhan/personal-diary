"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export function Tiptap({ content, onChange, placeholder, editable = true }: TiptapProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
        emptyEditorClass:
          "is-editor-empty before:text-slate-400 before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none",
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base min-h-[420px] w-full rounded-2xl border border-[var(--app-border)] bg-white px-5 py-4 text-[var(--app-foreground)] outline-none ring-2 ring-transparent transition focus:ring-[var(--app-ring)]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
