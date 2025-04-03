"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"

interface TextSelection {
  id: string
  text: string
  range: {
    startContainer: Node
    startOffset: number
    endContainer: Node
    endOffset: number
  }
  highlightElements: HTMLElement[]
}

const ContextMenu = ({
  position,
  onClose,
  onCreateIssue,
}: {
  position: { x: number; y: number }
  onClose: () => void
  onCreateIssue: (formData: any) => void
}) => {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [notes, setNotes] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateIssue({
      title,
      category,
      priority,
      notes,
    })
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        left: position.x,
        top: position.y,
        width: "320px",
        transform: "translate(-50%, 10px)",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create New Issue
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Issue Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Category</option>
              <option value="content">Content Error</option>
              <option value="formatting">Formatting Issue</option>
              <option value="translation">Translation Needed</option>
              <option value="reference">Missing Reference</option>
            </select>
          </div>

          <div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <textarea
              placeholder="Additional Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none h-20"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
          >
            Create Issue
          </button>
        </form>
      </div>
    </div>
  )
}

export default function NewFatwaPage() {
  const { id } = useParams()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selections, setSelections] = useState<TextSelection[]>([])
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true)

        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null

        if (!token) {
          setError("Authentication token not found. Please log in again.")
          setLoading(false)
          return
        }
        const response = await fetch(`https://lkp.pathok.com.bd/api/book/book-file/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`)
        }
        const arrayBuffer = await response.arrayBuffer()

        const [mammoth, DOMPurifyModule] = await Promise.all([import("mammoth"), import("dompurify")])

        const DOMPurify = DOMPurifyModule.default
        const result = await mammoth.convertToHtml({ arrayBuffer })
        const cleanHtml = DOMPurify.sanitize(result.value)

        setContent(cleanHtml)
        setLoading(false)
      } catch (error) {
        console.error("Error loading document:", error)
        setError(error instanceof Error ? error.message : "Failed to load document")
        setLoading(false)
      }
    }

    if (id) {
      loadDocument()
    }
  }, [id])
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const selectedText = selection.toString().trim()

      if (!selectedText) return
      const newSelection: TextSelection = {
        id: nanoid(),
        text: selectedText,
        range: {
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endContainer,
          endOffset: range.endOffset,
        },
        highlightElements: [],
      }
      highlightRange(range, newSelection)
      setSelections((prev) => [...prev, newSelection])
      selection.removeAllRanges()
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("mouseup", handleSelection)
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("mouseup", handleSelection)
      }
    }
  }, [content])

  const highlightRange = (range: Range, selection: TextSelection) => {
    const highlightElements: HTMLElement[] = []
    const fragment = range.cloneContents()
    const tempContainer = document.createElement("div")
    tempContainer.appendChild(fragment)

    const highlightSpan = document.createElement("span")
    highlightSpan.className = "highlighted-text"
    highlightSpan.dataset.selectionId = selection.id
    highlightSpan.style.backgroundColor = "rgba(255, 255, 0, 0.4)"
    highlightSpan.style.boxShadow = "0 0 2px rgba(255, 255, 0, 0.8)"
    highlightSpan.style.borderRadius = "2px"
    highlightSpan.style.padding = "0 2px"
    highlightSpan.innerHTML = tempContainer.innerHTML
    range.deleteContents()
    range.insertNode(highlightSpan)

    highlightElements.push(highlightSpan)

    selection.highlightElements = highlightElements
  }
  const handleContextMenu = (e: React.MouseEvent) => {
    if (selections.length === 0) return

    e.preventDefault()
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    })
    setShowMenu(true)
  }

  const handleCreateIssue = (formData: any) => {
    const combinedText = selections.map((s) => s.text).join(" ")
    console.log({
      ...formData,
      selectedText: combinedText,
    })

    setShowMenu(false)
    clearSelections()
  }

  const clearSelections = () => {
    
    selections.forEach((selection) => {
      selection.highlightElements.forEach((el) => {
        if (el.parentNode) {
          const parent = el.parentNode
          while (el.firstChild) {
            parent.insertBefore(el.firstChild, el)
          }
          parent.removeChild(el)
        }
      })
    })

    setSelections([])
  }

  const clearPreviousSelection = () => {
    if (selections.length === 0) return
    const lastSelection = selections[selections.length - 1]

    lastSelection.highlightElements.forEach((el) => {
      if (el.parentNode) {
        const parent = el.parentNode
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        parent.removeChild(el)
      }
    })
    setSelections((prev) => prev.slice(0, -1))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading document...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-lg mx-auto my-8 p-6">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Document</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </Card>
    )
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Viewer</h1>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearPreviousSelection} disabled={selections.length === 0}>
            Clear Previous
          </Button>
          <Button variant="outline" onClick={clearSelections} disabled={selections.length === 0}>
            Clear All
          </Button>
          <Button onClick={() => console.log(selections.map((s) => s.text))} disabled={selections.length === 0}>
            Log Selections
          </Button>
        </div>
      </div>

      {selections.length > 0 && (
        <div className="mb-4 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg inline-block">
          <span className="font-medium">
            {selections.length} text selection{selections.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div
        ref={contentRef}
        onContextMenu={handleContextMenu}
        style={{
          maxWidth: "8.5in",
          margin: "0 auto",
          padding: "1in",
          backgroundColor: "white",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
          minHeight: "11in",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            lineHeight: "1.6",
            color: "#000000",
          }}
        />
      </div>

      {showMenu && (
        <ContextMenu position={menuPosition} onClose={() => setShowMenu(false)} onCreateIssue={handleCreateIssue} />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .highlighted-text {
          transition: background-color 0.2s ease;
        }
        
        .highlighted-text:hover {
          background-color: rgba(255, 255, 0, 0.6) !important;
        }
      `}</style>
    </div>
  )
}

