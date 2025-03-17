"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookOpen, FileText, Tag } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"

interface Book {
  id: string
  bookCover: string
  bookFile:string
  title: string
  author: string
  type: string
  status: string
  category: string
  description: string
  pdfUrl: string
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (!params.id) return

    const fetchBook = async () => {
      try {
        console.log(params.id)
        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null
        const response = await fetch(`https://lkp.pathok.com.bd/api/book/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch book data")
        const data = await response.json()
        console.log(data)
        setBook(data.book)
      } catch (error) {
        console.error("Error fetching book:", error)
      }
    }

    fetchBook()
  }, [params.id])

  const handleOpenDoc = async () => {

    console.log("this is book",book)
    if (!book || !book?.bookFile) {
      console.error("Book file not found!");
      return;
    }
  
    const editorUrl = `https://test.pathok.com.bd/editor?fileName=${encodeURIComponent(book.bookFile)}&mode=edit`;
    window.open(editorUrl, "_blank"); 
  };
  


  const handleDelete = async () => {
    try {
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null
      await fetch(`https://lkp.pathok.com.bd/api/book/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setIsDeleteDialogOpen(false)
      toast.success("Book deleted successfully")
      router.push("/dashboard/books")
    } catch (error) {
      console.error("Error deleting book:", error)
    }
  }

  if (!book) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Book Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section: Book Cover Image */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={book.bookCover ? `https://lkp.pathok.com.bd/upload/${book.bookCover}` : "/placeholder.svg"}
                alt={`${book.title} cover`}
                fill
                className="rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Middle Section: Book Information */}
        <Card className="col-span-1 md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">{book.title}</h2>
            <p className="text-lg text-gray-500">{book.author}</p>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <span>{book.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <Badge variant={book.status === "Published" ? "default" : "secondary"}>{book.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>{book.category}</span>
              </Badge>
            </div>
            <p className="text-gray-600">{book.description}</p>
          </CardContent>
        </Card>

        {/* Right Section: Action Buttons */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <Button className="w-full" onClick={handleOpenDoc}>
              Open Doc
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </Button>
            <div>
              <Link href={`/dashboard/books/process/${book.id}`}>
                <Button variant="secondary" className="w-full">
                  Process Book
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this book? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
