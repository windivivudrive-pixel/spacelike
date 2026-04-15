"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    icon: string;
    title: string;
    disabled?: boolean;
}

function ToolbarButton({ onClick, isActive, icon, title, disabled }: ToolbarButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all
                ${isActive
                    ? 'bg-brand-accent text-white shadow-[0_0_10px_rgba(236,57,44,0.3)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--input-bg)]'
                }
                ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            <i className={icon}></i>
        </button>
    );
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-[var(--border-color)] mx-1" />;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Underline,
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-xl border border-[var(--border-color)] max-w-full h-auto my-4',
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                HTMLAttributes: {
                    class: 'text-brand-accent underline hover:brightness-125 transition-all',
                    rel: 'noopener noreferrer',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Bắt đầu viết bài...',
            }),
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none min-h-[320px] p-5 focus:outline-none text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-headings:font-display prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-a:text-brand-accent prose-strong:text-[var(--text-primary)] prose-blockquote:border-brand-accent prose-blockquote:text-[var(--text-secondary)] prose-code:text-brand-accent prose-code:bg-[var(--input-bg)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-ul:text-[var(--text-secondary)] prose-ol:text-[var(--text-secondary)] prose-li:text-[var(--text-secondary)]',
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync content from outside (e.g. when loading a post for editing)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '', { emitUpdate: false });
        }
        // Only sync when content prop changes from parent, not from editor updates
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    const addImage = useCallback(() => {
        if (!editor) return;
        const url = window.prompt('Nhập URL hình ảnh:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addLink = useCallback(() => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Nhập URL liên kết:', previousUrl || 'https://');

        if (url === null) return; // Cancelled

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return (
            <div className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] min-h-[400px] flex items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-brand-accent text-xl"></i>
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] overflow-hidden focus-within:border-brand-accent focus-within:ring-1 focus-within:ring-brand-accent transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-3 py-2 border-b border-[var(--border-color)] bg-[var(--input-bg)] flex-wrap">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon="fa-solid fa-bold"
                    title="Đậm (Ctrl+B)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon="fa-solid fa-italic"
                    title="Nghiêng (Ctrl+I)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    icon="fa-solid fa-underline"
                    title="Gạch chân (Ctrl+U)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon="fa-solid fa-strikethrough"
                    title="Gạch ngang"
                />

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon="fa-solid fa-heading"
                    title="Heading 2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon="fa-solid fa-h"
                    title="Heading 3"
                />

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon="fa-solid fa-list-ul"
                    title="Danh sách"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon="fa-solid fa-list-ol"
                    title="Danh sách số"
                />

                <ToolbarDivider />

                {/* Block */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon="fa-solid fa-quote-left"
                    title="Trích dẫn"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive('codeBlock')}
                    icon="fa-solid fa-code"
                    title="Code block"
                />

                <ToolbarDivider />

                {/* Media & Link */}
                <ToolbarButton
                    onClick={addImage}
                    icon="fa-solid fa-image"
                    title="Chèn hình ảnh"
                />
                <ToolbarButton
                    onClick={addLink}
                    isActive={editor.isActive('link')}
                    icon="fa-solid fa-link"
                    title="Chèn liên kết"
                />

                <ToolbarDivider />

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    icon="fa-solid fa-rotate-left"
                    title="Hoàn tác (Ctrl+Z)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    icon="fa-solid fa-rotate-right"
                    title="Làm lại (Ctrl+Y)"
                />

                <div className="flex-1" />

                {/* Clear formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                    icon="fa-solid fa-eraser"
                    title="Xóa định dạng"
                />
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Footer - word count */}
            <div className="flex items-center justify-end px-4 py-2 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                <span>
                    {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} từ
                    &nbsp;·&nbsp;
                    {editor.storage.characterCount?.characters?.() ?? editor.getText().length} ký tự
                </span>
            </div>
        </div>
    );
}
