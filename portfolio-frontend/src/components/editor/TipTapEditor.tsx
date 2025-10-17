'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Code,
  Quote,
  Undo2,
  Redo2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface TipTapEditorProps {
  value: string
  onChangeAction: (content: string) => void
  placeholder?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TipTapEditor({ value, onChangeAction, placeholder }: TipTapEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  // ✅ FIX: Add immediatelyRender: false
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChangeAction(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm dark:prose-invert max-w-none w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-[300px]',
      },
    },
  })

  if (!editor) {
    return (
      <div className="h-80 bg-muted rounded-md border border-input flex items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    )
  }

  const handleAddLink = () => {
    if (!linkUrl.trim()) return

    if (linkUrl.match(/^https?:\/\//)) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: `https://${linkUrl}` })
        .run()
    }

    setLinkUrl('')
    setShowLinkInput(false)
  }

  const handleAddImage = () => {
    if (!imageUrl.trim()) return

    editor.chain().focus().setImage({ src: imageUrl }).run()

    setImageUrl('')
    setShowImageInput(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (showLinkInput) handleAddLink()
      if (showImageInput) handleAddImage()
    }
    if (e.key === 'Escape') {
      setShowLinkInput(false)
      setShowImageInput(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border border-input rounded-md bg-muted/50">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r border-border pr-1">
          <Button
            type="button"
            variant={editor.isActive('bold') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
            className="h-8 w-8 p-0"
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive('italic') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
            className="h-8 w-8 p-0"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive('underline') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
            className="h-8 w-8 p-0"
          >
            <UnderlineIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive('code') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Code"
            className="h-8 w-8 p-0"
          >
            <Code className="w-4 h-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r border-border pr-1">
          <Button
            type="button"
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            title="Heading 1"
            className="h-8 px-2 text-xs"
          >
            H1
          </Button>

          <Button
            type="button"
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
            className="h-8 px-2 text-xs"
          >
            H2
          </Button>

          <Button
            type="button"
            variant={editor.isActive('blockquote') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
            className="h-8 w-8 p-0"
          >
            <Quote className="w-4 h-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex gap-1 border-r border-border pr-1">
          <Button
            type="button"
            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Media */}
        <div className="flex gap-1 border-r border-border pr-1">
          <Button
            type="button"
            variant={showLinkInput ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setShowLinkInput(!showLinkInput)
              setShowImageInput(false)
            }}
            title="Add Link"
            className="h-8 w-8 p-0"
          >
            <LinkIcon className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant={showImageInput ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setShowImageInput(!showImageInput)
              setShowLinkInput(false)
            }}
            title="Add Image"
            className="h-8 w-8 p-0"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
            className="h-8 w-8 p-0"
          >
            <Undo2 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
            className="h-8 w-8 p-0"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex gap-2 p-2 bg-muted/50 rounded-md border border-border">
          <Input
            type="url"
            placeholder="Enter URL (https://example.com)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
          <Button size="sm" type="button" onClick={handleAddLink}>
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="flex gap-2 p-2 bg-muted/50 rounded-md border border-border">
          <Input
            type="url"
            placeholder="Enter image URL (https://example.com/image.jpg)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1"
          />
          <Button size="sm" type="button" onClick={handleAddImage}>
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowImageInput(false)
              setImageUrl('')
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Helper Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 Tips:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Use markdown shortcuts: <code className="bg-muted px-1 rounded">**bold**</code>, <code className="bg-muted px-1 rounded">*italic*</code></li>
          <li>Paste images directly or add via URL</li>
          <li>Use Ctrl+Z to undo, Ctrl+Y to redo</li>
          <li>Press Ctrl+/ to see more shortcuts</li>
        </ul>
      </div>
    </div>
  )
}