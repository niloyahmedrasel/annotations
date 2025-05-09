"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Filter, Search, Plus, Loader2, Eye, Trash2, Tag } from 'lucide-react'
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

interface Issue {
  _id: string
  title: string
  createdBy: string
  bookNumber: string
  pageNumber: string
  volume: string
  chapter: string
  status: string
  tags: string[]
  issue: string
  createdAt: string
  updatedAt: string
}


const statuses = ["All Statuses", "Annotated", "Not Annotated"]

export default function FatwasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Statuses")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const {t, i18n} = useTranslation()
  const isRTL = i18n.language === "ar"

  const fetchIssues = async () => {
    try {
      setLoading(true)

      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null

      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setLoading(false)
        return
      }

      const response = await fetch("https://lkp.pathok.com.bd/api/issue", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch issues: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setIssues(data.books)
      console.log("this is issue", data.books)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching issues:", error)
      setError(error instanceof Error ? error.message : "Failed to load issues")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [])

  const allTags = Array.from(
    new Set(
      issues.flatMap((issue) => issue.tags || []).filter(Boolean)
    )
  ).sort()

  const handleDeleteIssue = async () => {
    if (!issueToDelete) return

    try {
      setIsDeleting(true)

      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null

      if (!token) {
        setError("Authentication token not found. Please log in again.")
        setIsDeleting(false)
        return
      }

      const response = await fetch(`https://lkp.pathok.com.bd/api/issue/${issueToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to delete issue: ${response.status} ${response.statusText}`)
      }

      setIssues(issues.filter((issue) => issue._id !== issueToDelete))

      setIsDeleteDialogOpen(false)
      setIssueToDelete(null)

      toast.success("Issue deleted successfully")
    } catch (error) {
      console.error("Error deleting issue:", error)
      alert(`Error deleting issue: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAnnotateIssue = async (issueId: string) => {
    try {
      const user = sessionStorage.getItem("user");
      const token = user ? JSON.parse(user).token : null;
  
      if (!token) {
        alert("You must be logged in to annotate.");
        return;
      }
  
      const res = await fetch(`https://lkp.pathok.com.bd/api/issue/annotate-issue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueId }),
      });
  
      if (!res.ok) {
        const responseData = await res.json();
        console.error(responseData);
        alert(responseData.error || "Failed to annotate issue");
        return;
      }
  
      const responseData = await res.json();
      const projectId = responseData.projectId;
  
      if (!projectId) {
        alert("Invalid project ID.");
        return;
      }
  
      console.log("Redirecting to project:", projectId);
      window.open(`https://studio.pathok.com.bd/projects/${projectId}/data`, "_blank");
  
    } catch (err) {
      console.error(err);
      alert("An error occurred while annotating.");
    }
  };
  
  
  

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

 
  const clearTagFilters = () => {
    setSelectedTags([])
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.createdBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.bookNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "All Statuses" || issue.status === selectedStatus

    const matchesTags = 
      selectedTags.length === 0 || 
      (issue.tags && selectedTags.some(tag => issue.tags.includes(tag)))

    return matchesSearch && matchesStatus && matchesTags
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Annotated":
        return "bg-green-500 hover:bg-green-600"
      case "Not Annotated":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsViewDialogOpen(true)
  }

  const handleDeleteConfirmation = (issueId: string) => {
    setIssueToDelete(issueId)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t("Loading...")}</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-lg mx-auto my-8 p-6">
        <h2 className="text-xl font-bold text-red-500 mb-4">{t("Error Loading Issues")}</h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>{t("Try Again")}</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("Issue Viewer")}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className={isRTL?"flex items-center mx-3":"flex items-center"}>
            <Filter className="mr-2 h-4 w-4" />
            {t("Filters")}
          </Button>
          <Button asChild>
            <Link href="/dashboard/fatwas/new" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              {t("Create New Issue")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="search"
            placeholder="Search issues by title or creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="mr-2 h-5 w-5" />
              {t("Filter by Tags")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allTags.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                  {allTags.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`tag-${tag}`} 
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() => toggleTag(tag)}
                      />
                      <Label 
                        htmlFor={`tag-${tag}`}
                        className="text-sm cursor-pointer"
                      >
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                    </div>
                    <Button variant="outline" size="sm" onClick={clearTagFilters}>
                      {t("Clear All")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground text-sm">{t("No tags available")}</div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status filter buttons */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(
          (status) =>
            status !== "All Statuses" && (
              <Button
                key={status}
                variant="outline"
                size="sm"
                className={`${selectedStatus === status ? getStatusColor(status) + " text-white" : ""}`}
                onClick={() => setSelectedStatus(status === selectedStatus ? "All Statuses" : status)}
              >
                {t(status)}
              </Button>
            ),
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium">{t("Filtered by tags:")}</span>
          {selectedTags.map(tag => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag}
              <button 
                onClick={() => toggleTag(tag)}
                className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5"
              >
                <span className="sr-only">{t("Remove")}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearTagFilters} className="h-7 px-2 text-xs">
            {t("Clear All")}
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Title")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Creator")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Book Number")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Page")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Volume")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("chapter")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Created At")}</TableHead>
              <TableHead  className={isRTL? "text-right" : ""}>{t("Status")}</TableHead>
              <TableHead  className={isRTL? "text-right" : "text-right"}>{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <TableRow key={issue._id}>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>{issue.createdBy}</TableCell>
                  <TableCell>{issue.bookNumber}</TableCell>
                  <TableCell>{issue.pageNumber}</TableCell>
                  <TableCell>{issue.volume}</TableCell>
                  <TableCell>{issue.chapter}</TableCell>
                  <TableCell>{formatDate(issue.createdAt)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status) + " text-white"}>{t(issue.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewIssue(issue)} className="mr-1">
                      {t("View")}
                    </Button>
                    <Button onClick={() => handleAnnotateIssue(issue._id)} variant="ghost" size="sm" className="mr-1">
                      {t("Annotate")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteConfirmation(issue._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t("Delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  {t("No issues found matching your filters.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedIssue?.title}</DialogTitle>
            <DialogDescription>
              Book: {selectedIssue?.bookNumber} | Page: {selectedIssue?.pageNumber} | Volume: {selectedIssue?.volume}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md max-h-[60vh] overflow-y-auto">
            <div className="text-lg font-semibold mb-2">Issue Text:</div>
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              {selectedIssue?.issue}
            </div>

            {selectedIssue?.tags && selectedIssue.tags.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-semibold mb-1">Tags:</div>
                <div className="flex flex-wrap gap-2">
                  {selectedIssue.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">Chapter: {selectedIssue?.chapter}</div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this issue?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the issue from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteIssue}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
