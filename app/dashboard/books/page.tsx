"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash, PlayCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Book {
  id: string
  thumbnail: string
  title: string
  author: string
  type: string
  status: string
  categories: string[]
}

const initialBooks: Book[] = [
  {
    id: "1",
    thumbnail: "https://via.placeholder.com/50?text=Book+1",
    title: "The Book of Knowledge",
    author: "Scholar Name",
    type: "Religious",
    status: "Published",
    categories: ["Islamic Studies", "Education"],
  },
  {
    id: "2",
    thumbnail: "https://via.placeholder.com/50?text=Book+2",
    title: "Principles of Islamic Jurisprudence",
    author: "Dr. Ahmad Ali",
    type: "Legal",
    status: "In Review",
    categories: ["Islamic Law", "Jurisprudence"],
  },
  {
    id: "3",
    thumbnail: "https://via.placeholder.com/50?text=Book+3",
    title: "Hadith Compilation",
    author: "Imam Bukhari",
    type: "Scholarly",
    status: "Unpublish",
    categories: ["Hadith", "Islamic Studies"],
  },
]

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  const openDeleteDialog = (book: Book) => {
    setBookToDelete(book)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setBookToDelete(null)
  }

  const confirmDelete = () => {
    if (bookToDelete) {
      setBooks(books.filter((book) => book.id !== bookToDelete.id))
      closeDeleteDialog()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books</h1>
        <Button asChild>
          <Link href="/dashboard/books/new">Add New Book</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input id="search" placeholder="Search books..." />
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-type" className="sr-only">
            Filter by Type
          </Label>
          <Select>
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="religious">Religious</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="scholarly">Scholarly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="filter-status" className="sr-only">
            Filter by Status
          </Label>
          <Select>
            <SelectTrigger id="filter-status">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="Unpublish">Unpublish</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Cover</TableHead>
              <TableHead>Book Name</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <img
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={`${book.title} Thumbnail`}
                    className="w-12 h-12 rounded-md"
                  />
                </TableCell>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.type}</TableCell>
                <TableCell>
                  <Badge variant={book.status === "Published" ? "default" : "secondary"}>{book.status}</Badge>
                </TableCell>
                <TableCell>
                  {book.categories.map((category) => (
                    <Badge key={category} variant="outline" className="mr-1">
                      {category}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex space-x-2 justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/books/${book.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/books/process/${book.id}`}>
                              <PlayCircle className="w-4 h-4" />
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Process</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(book)}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the book "{bookToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

