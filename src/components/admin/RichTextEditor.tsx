import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { Bold, Italic, List, ListOrdered, Image as ImageIcon, Loader, Heading1, Heading2, Quote } from 'lucide-react';
import { useState } from 'react';
import { uploadImageToR2 } from '@/lib/r2Api';
import ResizableImage from './ImageResizeComponent';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
}

const CustomImage = ImageExtension.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: null,
                renderHTML: (attributes) => {
                    if (!attributes.width) return {};
                    return { width: attributes.width };
                },
            },
            align: {
                default: 'center',
                renderHTML: (attributes) => {
                    if (!attributes.align) return {};
                    return { align: attributes.align };
                },
            },
        };
    },
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(ResizableImage);
    },
});

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const [isUploading, setIsUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            CustomImage.configure({
                inline: true,
                allowBase64: true,
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] text-[#ccc] text-[14px] leading-relaxed',
                style: 'font-family: inherit;',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        event.preventDefault(); // stop browser from opening file
                        setIsUploading(true);
                        uploadImageToR2(file)
                            .then((res) => {
                                const { schema } = view.state;
                                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                                if (coordinates) {
                                    const node = schema.nodes.image.create({ src: res.url });
                                    const transaction = view.state.tr.insert(coordinates.pos, node);
                                    view.dispatch(transaction);
                                }
                            })
                            .catch((err) => {
                                console.error('Drag upload failed', err);
                                alert('Upload failed');
                            })
                            .finally(() => setIsUploading(false));
                        return true; // handled
                    }
                }
                return false;
            },
            handlePaste: (view, event, slice) => {
                const items = Array.from(event.clipboardData?.items || []);
                const item = items.find(i => i.type.indexOf('image') === 0);

                if (item) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        setIsUploading(true);
                        uploadImageToR2(file)
                            .then((res) => {
                                const node = view.state.schema.nodes.image.create({ src: res.url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            })
                            .catch(err => {
                                console.error('Paste upload failed', err);
                                alert('Upload failed');
                            })
                            .finally(() => setIsUploading(false));
                        return true;
                    }
                }
                return false;
            }
        },
    });

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, children, title }: any) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded transition-all duration-200 border border-transparent ${isActive ? 'bg-[var(--neon-cyan)] text-black shadow-[0_0_8px_var(--neon-cyan)]' : 'text-[#888] hover:text-white hover:border-[#444]'
                }`}
        >
            {children}
        </button>
    );

    const addImage = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border border-[#333] bg-[#0a0a0a] rounded-sm overflow-hidden flex flex-col transition-colors duration-300 focus-within:border-[var(--brand)]">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-[#222] bg-[#050505] flex-wrap">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic size={14} />
                </ToolbarButton>
                <div className="w-[1px] h-4 bg-[#333] mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading"
                >
                    <Heading1 size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Subheading"
                >
                    <Heading2 size={14} />
                </ToolbarButton>
                <div className="w-[1px] h-4 bg-[#333] mx-1" />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <Quote size={14} />
                </ToolbarButton>
                <div className="w-[1px] h-4 bg-[#333] mx-1" />
                <button
                    type="button"
                    onClick={addImage}
                    className="p-1.5 text-[#888] hover:text-[var(--neon-magenta)] transition-colors"
                    title="Add Image URL"
                >
                    <ImageIcon size={14} />
                </button>

                {isUploading && (
                    <div className="ml-auto flex items-center gap-2">
                        <span style={{ ...font, fontSize: '8px', color: 'var(--neon-cyan)' }} className="animate-pulse">UPLOADING...</span>
                        <Loader size={12} className="animate-spin text-[var(--neon-cyan)]" />
                    </div>
                )}
            </div>

            {/* Editor Area */}
            <div className="p-4" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
                <EditorContent editor={editor} />
            </div>

            <style>{`
                .ProseMirror p { margin-bottom: 0.8em; }
                .ProseMirror img { 
                    max-width: 100%; 
                    border: 1px solid var(--neon-cyan);
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
                    margin: 1em 0;
                    display: block;
                }
                .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; color: #aaa; }
                .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; color: #aaa; }
                .ProseMirror h2 { color: var(--brand); font-family: 'Press Start 2P', monospace; font-size: 0.9em; margin-top: 1.5em; margin-bottom: 0.5em; }
                .ProseMirror h3 { color: var(--neon-magenta); font-family: 'Press Start 2P', monospace; font-size: 0.7em; margin-top: 1.2em; margin-bottom: 0.5em; }
                .ProseMirror blockquote { border-left: 3px solid var(--brand); padding-left: 1em; color: #888; font-style: italic; }
                
                /* Image Alignment Styles */
                .ProseMirror img[align="left"] {
                    float: left;
                    margin-right: 1.5em;
                    margin-bottom: 1em;
                }
                .ProseMirror img[align="right"] {
                    float: right;
                    margin-left: 1.5em;
                    margin-bottom: 1em;
                }
                .ProseMirror img[align="center"] {
                    display: block;
                    margin: 1em auto;
                    float: none;
                }
                /* Clearfix */
                .ProseMirror::after {
                    content: "";
                    display: table;
                    clear: both;
                }
            `}</style>
        </div>
    );
}
