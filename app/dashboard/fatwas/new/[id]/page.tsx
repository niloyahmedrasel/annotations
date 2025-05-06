"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { nanoid } from "nanoid"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { t } from "i18next"

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

interface Tag {
  _id: string
  title: string
}

const isArabicText = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF]/
  return arabicPattern.test(text)
}

const ContextMenu = ({
  position,
  onClose,
  onCreateIssue,
  documentData = {},
  selection = "",
}: {
  position: { x: number; y: number }
  onClose: () => void
  onCreateIssue: (formData: any) => void
  documentData?: any
  selection?: string
}) => {
  const defaultTitle = selection ? (selection.length > 50 ? selection.substring(0, 47) + "..." : selection) : ""

  const [title, setTitle] = useState(defaultTitle)
  const [tags, setTags] = useState<string[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [priority, setPriority] = useState("")
  const [notes, setNotes] = useState("")
  const menuRef = useRef<HTMLDivElement>(null)

  const {t} = useTranslation()

  const bookInfo = {
    bookNumber: documentData.bookNumber || "N/A",
    volume: documentData.volume || "N/A",
    page: documentData.pageNumber || "N/A",
    chapter: documentData.chapter || "N/A",
    lineNumber: documentData.lineNumber || "N/A",
    wordNumber: documentData.wordNumber || "N/A",
  }

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setTagsLoading(true)
        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null

        if (!token) {
          toast.error("Authentication required")
          return
        }

        const response = await fetch("https://lkp.pathok.com.bd/api/tag", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch tags")
        }

        const data = await response.json()
        const newData = data.tags

        if (newData && newData.length > 0) {
          const tagTitles = newData.map((tag: Tag) => tag.title)
          setTags(tagTitles)
        }
      } catch (error) {
        console.error("Error fetching tags:", error)

        setTags(["issue", "review"])
      } finally {
        setTagsLoading(false)
      }
    }

    fetchTags()
  }, [])

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
      bookInfo,
      tags,
      selectedText: selection,
    })
  }

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
        width: "400px",
        transform: "translate(-50%, 10px)",
        animation: "fadeIn 0.2s ease-out",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          {t("Create New Issue")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">{t("Title")}</label>
            <input
              type="text"
              placeholder={t("Enter issue title")}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("Book Information")}</label>
            <div className="px-3 py-2 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
              {t("Book Number")}: {bookInfo.bookNumber}, {t("Volume")}: {bookInfo.volume}, {t("Page")}: {bookInfo.page}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{("Chapter")}</label>
            <div className="px-3 py-2 bg-white/30 dark:bg-gray-800/30 rounded-lg border border-gray-300 dark:border-gray-600 text-sm">
              {bookInfo.chapter}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t("Tags")}</label>
            {tagsLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">{t("Loading tags...")}</span>
              </div>
            ) : (
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
            )}
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t("Add a tag")}
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
                className="px-3 py-2 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition-colors text-sm mx-2"
              >
                {t("Add")}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 mt-4 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-lg"
          >
            {t("Create Issue")}
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

    const selectedText = selection.text
    const isArabic = isArabicText(selectedText)

    const highlightSpan = document.createElement("span")
    highlightSpan.className = "highlighted-text"
    highlightSpan.dataset.selectionId = selection.id
    highlightSpan.style.backgroundColor = "rgba(255, 255, 0, 0.4)"
    highlightSpan.style.boxShadow = "0 0 2px rgba(255, 255, 0, 0.8)"
    highlightSpan.style.borderRadius = "2px"
    highlightSpan.style.padding = "0 2px"
    highlightSpan.style.direction = isArabic ? "rtl" : "ltr"
    highlightSpan.style.textAlign = isArabic ? "right" : "left"

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

  const handleCreateIssue = async (formData: any) => {
    try {
      const combinedText = selections.map((s) => s.text).join(" ")

      const user = sessionStorage.getItem("user")
      const userName = user ? JSON.parse(user).name : null
      const token = user ? JSON.parse(user).token : null

      if (!token) {
        setError("Authentication token not found. Please log in again.")
        return
      }

      const issueData = {
        title: formData.title,
        status: "pending",
        bookNumber: formData.bookInfo.bookNumber,
        pageNumber: formData.bookInfo.page,
        volume: formData.bookInfo.volume,
        chapter: formData.bookInfo.chapter,
        tags: formData.tags,
        issue: combinedText,
        createdBy:userName,
      }

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

      setShowMenu(false)

      clearSelections()
    } catch (error) {
      console.error("Error creating issue:", error)
      alert(`Error creating issue: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
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
        <h2 className="text-xl font-bold text-red-500 mb-4">{t("Error Loading Document")}</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.history.back()}>{t("Go Back")}</Button>
      </Card>
    )
  }

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("Document Viewer")}</h1>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={clearPreviousSelection} disabled={selections.length === 0}>
            {t("Clear Previous")}
          </Button>
          <Button variant="outline" onClick={clearSelections} disabled={selections.length === 0}>
            {t("Clear All")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">{t("Selected Text")} ({selections.length})</h2>
          {selections.length === 0 ? (
            <p className="text-gray-400 text-sm italic">
             {t("No text selected yet. Select text from the document to add it here.")}
            </p>
          ) : (
            <div className="space-y-3">
              {selections.map((selection, index) => (
                <div key={selection.id} className="bg-gray-700 rounded-md p-3 relative">
                  <p
                    className="text-sm pr-8"
                    style={{
                      direction: isArabicText(selection.text) ? "rtl" : "ltr",
                      textAlign: isArabicText(selection.text) ? "right" : "left",
                    }}
                  >
                    "{selection.text}"
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => {
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
                    <span className="sr-only">{t("Remove selection")}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
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
                direction: isArabicText(content) ? "rtl" : "ltr",
                textAlign: isArabicText(content) ? "right" : "left",
              }}
            />
          </div>
        </div>
      </div>

      {showMenu && (
        <ContextMenu
          position={menuPosition}
          onClose={() => setShowMenu(false)}
          onCreateIssue={handleCreateIssue}
          documentData={documents}
          selection={selections.map((s) => s.text).join(" ")}
        />
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
