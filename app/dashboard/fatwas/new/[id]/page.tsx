"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"
import { toast } from "react-toastify"

// Types for our selections
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

// Custom context menu component
const ContextMenu = ({
  position,
  onClose,
  onCreateIssue,
  documentData = {}, // Renamed from 'document' to 'documentData'
  selection = "", // Add selection parameter with default empty string
}: {
  position: { x: number; y: number }
  onClose: () => void
  onCreateIssue: (formData: any) => void
  documentData?: any // Renamed parameter type
  selection?: string
}) => {
  // Pre-populate title with selection text (truncated if too long)
  const defaultTitle = selection ? (selection.length > 50 ? selection.substring(0, 47) + "..." : selection) : ""

  const [title, setTitle] = useState(defaultTitle)
  const [tags, setTags] = useState<string[]>(["issue", "review"]) // Default tags
  const [priority, setPriority] = useState("")
  const [notes, setNotes] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)

  // Get data from documents state
  const bookInfo = {
    bookNumber: documentData.bookNumber || "N/A",
    volume: documentData.volume || "N/A",
    page: documentData.pageNumber || "N/A",
    chapter: documentData.chapter || "N/A",
    lineNumber: documentData.lineNumber || "N/A",
    wordNumber: documentData.wordNumber || "N/A",
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside) // Now using global document
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateIssue({
      title,
      bookInfo,
      tags,
      selectedText: selection,
    })
  }

  // Handle tag input
  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      style={{
        left: position.x,
        top: position.y,
        width: "400px", // Increased width to accommodate more fields
        transform: "translate(-50%, 10px)",
        animation: "fadeIn 0.2s ease-out",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Create New Issue
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title (simple input field) */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter issue title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Name of the book: volume: page (automated) */}
          <div>
            <label className="block text-sm font-medium mb-1">Book Information</label>
            <div className="px-3 py-2 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
              Book Number: {bookInfo.bookNumber}, Volume: {bookInfo.volume}, Page: {bookInfo.page}
            </div>
          </div>

          {/* Original book Chapter/sub-chapter name (automated) */}
          <div>
            <label className="block text-sm font-medium mb-1">Chapter</label>
            <div className="px-3 py-2 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
              {bookInfo.chapter}
            </div>
          </div>

          {/* Tags (automated, editable) */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-l-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
          </div>

          {/* Create Issue Button - Made more prominent */}
          <button
            type="submit"
            className="w-full py-3 px-4 mt-4 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-lg"
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
  const [documents, setDocuments] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selections, setSelections] = useState<TextSelection[]>([])
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Dynamically import mammoth and DOMPurify to avoid SSR issues
  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true)

        // Get token from session storage
        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null

        if (!token) {
          setError("Authentication token not found. Please log in again.")
          setLoading(false)
          return
        }

        // Fetch the document
        const response = await fetch(`https://lkp.pathok.com.bd/api/book/book-file/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`)
        }
        if (response) {
          await fetch(`https://lkp.pathok.com.bd/api/scraped-documents/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Fetched document data:", data)
              setDocuments(data)
            })
        }

        // Convert document to HTML
        const arrayBuffer = await response.arrayBuffer()

        // Dynamically import mammoth and DOMPurify
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

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !selection.rangeCount) return

      const range = selection.getRangeAt(0)
      const selectedText = selection.toString().trim()

      if (!selectedText) return

      // Create a new selection object
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

      // Highlight the selected text
      highlightRange(range, newSelection)

      // Add to selections
      setSelections((prev) => [...prev, newSelection])

      // Clear the selection to allow for new selections
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

  // Function to highlight a range of text
  const highlightRange = (range: Range, selection: TextSelection) => {
    const highlightElements: HTMLElement[] = []

    // Create a document fragment from the range
    const fragment = range.cloneContents()

    // Create a temporary container
    const tempContainer = document.createElement("div")
    tempContainer.appendChild(fragment)

    // Create a highlight span
    const highlightSpan = document.createElement("span")
    highlightSpan.className = "highlighted-text"
    highlightSpan.dataset.selectionId = selection.id
    highlightSpan.style.backgroundColor = "rgba(255, 255, 0, 0.4)"
    highlightSpan.style.boxShadow = "0 0 2px rgba(255, 255, 0, 0.8)"
    highlightSpan.style.borderRadius = "2px"
    highlightSpan.style.padding = "0 2px"

    // Replace the selected content with the highlighted version
    highlightSpan.innerHTML = tempContainer.innerHTML
    range.deleteContents()
    range.insertNode(highlightSpan)

    // Add to highlight elements
    highlightElements.push(highlightSpan)

    // Update the selection object
    selection.highlightElements = highlightElements
  }

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    if (selections.length === 0) return

    e.preventDefault()
    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    })
    setShowMenu(true)
  }

  // Handle create issue
  const handleCreateIssue = async (formData: any) => {
    try {
      // Combine all selected text into a single string
      const combinedText = selections.map((s) => s.text).join(" ")

      // Get token from session storage
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null

      if (!token) {
        setError("Authentication token not found. Please log in again.")
        return
      }

      // Prepare data according to the backend interface
      const issueData = {
        title: formData.title,
        status: "pending", // Default status
        bookNumber: formData.bookInfo.bookNumber,
        pageNumber: formData.bookInfo.page,
        volume: formData.bookInfo.volume,
        chapter: formData.bookInfo.chapter,
        tags: formData.tags,
        issue: combinedText,
      }

      // Make POST request to the API
      const response = await fetch("https://lkp.pathok.com.bd/api/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(issueData),
      })

      if (!response.ok) {
        throw new Error(`Failed to create issue: ${response.status} ${response.statusText}`)
      }

      toast.success("Issue created successfully!")

      const result = await response.json()
      console.log("Issue created successfully:", result)


      // Close the menu
      setShowMenu(false)

      // Clear all selections after creating issue
      clearSelections()
    } catch (error) {
      console.error("Error creating issue:", error)
      alert(`Error creating issue: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Clear all selections
  const clearSelections = () => {
    // Remove all highlight elements from the DOM
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

    // Clear selections state
    setSelections([])
  }

  // Add a new function to clear only the previous selection
  const clearPreviousSelection = () => {
    if (selections.length === 0) return

    // Get the last selection
    const lastSelection = selections[selections.length - 1]

    // Remove its highlight elements from the DOM
    lastSelection.highlightElements.forEach((el) => {
      if (el.parentNode) {
        const parent = el.parentNode
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el)
        }
        parent.removeChild(el)
      }
    })

    // Remove the last selection from the state
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
        </div>
      </div>

      {/* Main content area with selections panel and document */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Selections panel - left side */}
        <div className="w-full md:w-1/4 bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Selected Text ({selections.length})</h2>
          {selections.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
              No text selected yet. Select text from the document to add it here.
            </p>
          ) : (
            <div className="space-y-3">
              {selections.map((selection, index) => (
                <div key={selection.id} className="bg-gray-700 rounded-md p-3 relative">
                  <p className="text-sm pr-8">"{selection.text}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => {
                      // Remove this specific selection
                      const selectionToRemove = selections[index]
                      selectionToRemove.highlightElements.forEach((el) => {
                        if (el.parentNode) {
                          const parent = el.parentNode
                          while (el.firstChild) {
                            parent.insertBefore(el.firstChild, el)
                          }
                          parent.removeChild(el)
                        }
                      })
                      setSelections((prev) => prev.filter((s) => s.id !== selectionToRemove.id))
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-x"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                    <span className="sr-only">Remove selection</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document content - right side */}
        <div className="w-full md:w-3/4">
          <div
            ref={contentRef}
            onContextMenu={handleContextMenu}
            style={{
              maxWidth: "100%",
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
        </div>
      </div>

      {/* Custom Context Menu */}
      {showMenu && (
        <ContextMenu
          position={menuPosition}
          onClose={() => setShowMenu(false)}
          onCreateIssue={handleCreateIssue}
          documentData={documents}
          selection={selections.map((s) => s.text).join(" ")}
        />
      )}

      {/* Add custom styles */}
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
