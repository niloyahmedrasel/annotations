"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Edit, Trash, PlayCircle, BookOpen, User, Tag } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"

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
    thumbnail: "https://via.placeholder.com/150?text=Book+1",
    title: "The Book of Knowledge",
    author: "Scholar Name",
    type: "Religious",
    status: "Published",
    categories: ["Islamic Studies", "Education"],
  },
  {
    id: "2",
    thumbnail: "https://via.placeholder.com/150?text=Book+2",
    title: "Principles of Islamic Jurisprudence",
    author: "Dr. Ahmad Ali",
    type: "Legal",
    status: "In Review",
    categories: ["Islamic Law", "Jurisprudence"],
  },
  {
    id: "3",
    thumbnail: "https://via.placeholder.com/150?text=Book+3",
    title: "Hadith Compilation",
    author: "Imam Bukhari",
    type: "Scholarly",
    status: "Unpublish",
    categories: ["Hadith", "Islamic Studies"],
  },
]

const bookTypes = ["Religious", "Legal", "Scholarly"]
const bookStatuses = ["Published", "In Review", "Unpublish"]

export default function BooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

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

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(book.type)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(book.status)
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books</h1>
        {user?.role === "Super Admin" && (
          <Button asChild>
            <Link href="/dashboard/books/new">Add New Book</Link>
          </Button>
        )}
      </div>
      <Input placeholder="Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Book Types</h2>
            {bookTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Book Statuses</h2>
            {bookStatuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={selectedStatuses.includes(status)}
                  onCheckedChange={() => toggleStatus(status)}
                />
                <Label htmlFor={`status-${status}`}>{status}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={book.thumbnail || "/placeholder.svg"}
                    alt={`${book.title} Thumbnail`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">{book.title}</h2>
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span className="text-sm text-gray-600">{book.author}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span className="text-sm text-gray-600">{book.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {book.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant={book.status === "Published" ? "default" : "secondary"} className="text-xs">
                    {book.status}
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 flex justify-end space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" size="sm" asChild>
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
                        <Button variant="secondary" size="sm" asChild>
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
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(book)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the book "{bookToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
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

