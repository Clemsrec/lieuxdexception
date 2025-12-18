'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  Link2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Quote,
} from 'lucide-react';
import { useCallback } from 'react';

/**
 * Props pour RichTextEditor
 */
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

/**
 * Éditeur de texte riche WYSIWYG pour la gestion des contenus
 * 
 * Utilise TipTap pour offrir une expérience type Word :
 * - Toolbar intuitive avec boutons visuels
 * - Gras, Italique, Souligné
 * - Listes à puces et numérotées
 * - Liens
 * - Alignement du texte
 * - Titres (H1, H2, H3)
 * - Undo/Redo
 */
export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Saisissez votre texte ici...',
  minHeight = '200px',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-accent hover:text-accent-dark underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien:', previousUrl);

    // Cancelled
    if (url === null) {
      return;
    }

    // Empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // Update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-neutral-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-neutral-50 border-b border-neutral-300 p-2 flex flex-wrap gap-1">
        {/* Undo / Redo */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Annuler (Ctrl+Z)"
            type="button"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Refaire (Ctrl+Y)"
            type="button"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Titres */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Titre 1"
            type="button"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Titre 2"
            type="button"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Titre 3"
            type="button"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Mise en forme */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('bold') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Gras (Ctrl+B)"
            type="button"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('italic') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Italique (Ctrl+I)"
            type="button"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('underline') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Souligné (Ctrl+U)"
            type="button"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Listes */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2 mr-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('bulletList') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Liste à puces"
            type="button"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('orderedList') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Liste numérotée"
            type="button"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('blockquote') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Citation"
            type="button"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Alignement */}
        <div className="flex gap-1 border-r border-neutral-300 pr-2 mr-1">
          <span className="flex items-center text-xs text-charcoal-600 font-medium px-2 bg-charcoal-50 rounded">
            Alignement :
          </span>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-neutral-200 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Aligner à gauche"
            type="button"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-neutral-200 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Centrer"
            type="button"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-neutral-200 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Aligner à droite"
            type="button"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lien */}
        <div className="flex gap-1">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-neutral-200 ${
              editor.isActive('link') ? 'bg-accent text-white hover:bg-accent-dark' : ''
            }`}
            title="Ajouter un lien"
            type="button"
          >
            <Link2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Éditeur */}
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
        className="bg-white"
      />
      
      {/* Info aide */}
      <div className="bg-neutral-50 border-t border-neutral-300 px-4 py-2 text-xs text-secondary">
        <div className="flex items-center gap-4">
          <span>💡 Astuce : Utilisez les boutons ci-dessus pour mettre en forme votre texte</span>
          <div className="flex gap-3 ml-auto">
            <span className="text-neutral-400">Ctrl+B = Gras</span>
            <span className="text-neutral-400">Ctrl+I = Italique</span>
            <span className="text-neutral-400">Ctrl+U = Souligné</span>
          </div>
        </div>
      </div>
    </div>
  );
}
