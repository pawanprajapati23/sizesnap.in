'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[300px] px-4 py-3',
      },
    },
  });

  // Update editor content if props change (like when loading initial data)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && content !== undefined) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    setUploadingImage(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (cloudName && uploadPreset) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'blog');

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || 'Failed to upload image to Cloudinary');
        }

        const data = await res.json();
        editor.chain().focus().setImage({ src: data.secure_url }).run();
      } else {
        const url = window.prompt('Enter Image URL:');
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-[#414FA8]' : 'text-gray-600'}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          title="Insert Image (Cloudinary)"
        >
          {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-[#414FA8]" /> : <ImageIcon className="w-4 h-4" />}
        </button>
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <div className="w-px h-5 bg-gray-300 mx-1"></div>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-50"
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white min-h-[300px] cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
