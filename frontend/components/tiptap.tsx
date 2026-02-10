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
                emptyEditorClass: "is-editor-empty before:text-ink/40 before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none",
            }),
        ],
        content,
        editable,
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose-base focus:outline-none min-h-[300px] w-full rounded-xl border border-ink/20 px-4 py-3 outline-none ring-pine focus:ring-2",
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
