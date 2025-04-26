"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { BookOpen, User, Tag, Edit, Eye } from "lucide-react"
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
  bookCover: string
  title: string
  author: string
  type: string
  status: string
  categories: string[]
}

const bookTypes = ["Religious", "Legal", "Scholarly"]
const bookStatuses = ["Published", "In Review", "Unpublish"]

export default function BooksPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null
        const response = await fetch("https://lkp.pathok.com.bd/api/book", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message)
        }
        console.log(data)

        const formattedBooks = data.books.map((book: any) => ({
          id: book._id, 
          bookCover: book.bookCover ? `https://lkp.pathok.com.bd/upload/${book.bookCover}` : "/placeholder.svg",
          title: book.title,
          author: book.author,
          type: book.type, 
          status: "Published", 
          categories: [book.category], 
        }))

        setBooks(formattedBooks)
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

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
    <div className="space-y-4">
      <div className="w-full mb-6">
        <Input
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 mx-auto h-9"
        />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books</h1>
        {user?.role === "Super Admin" && (
          <Button asChild>
            <Link href="/dashboard/books/new">Add New Book</Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4 space-y-4">
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
          {loading ? (
            <p className="text-center text-gray-600">Loading books...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="flex flex-col h-full transition-all duration-300 hover:shadow-lg">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={book.bookCover || "/placeholder.svg"}
                      width={50}
                      height={20}
                      alt={`${book.title} Thumbnail`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="flex-grow p-4">
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
                  <CardFooter className="p-4 flex gap-2">
                    <Button variant="default" size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/books/${book.id}`}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Link>
                    </Button>
                    <Button variant="secondary" size="sm" asChild className="flex-1">
                      <Link href={`/dashboard/books/new?id=${book.id}`}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
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
          <DialogFooter className="flex justify-end space-x-3">
            <div>
              <Button variant="outline" onClick={closeDeleteDialog}>
                Cancel
              </Button>
            </div>
            <div>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

