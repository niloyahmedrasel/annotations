"use client"

import { useState } from "react"
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

interface Book {
  id: string
  thumbnail: string
  title: string
  author: string
  type: string
  status: string
  categories: string[]
  description: string
  pdfUrl: string
}

// This would typically come from an API or database
const book: Book = {
  id: "1",
  thumbnail: "https://via.placeholder.com/300x400?text=Book+Cover",
  title: "The Book of Knowledge",
  author: "Scholar Name",
  type: "Religious",
  status: "Published",
  categories: ["Islamic Studies", "Education"],
  description:
    "A comprehensive guide to Islamic knowledge covering various aspects of the religion, including theology, jurisprudence, and ethics.",
  pdfUrl: "/sample.pdf",
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Deleting book:", params.id)
    setIsDeleteDialogOpen(false)
    router.push("/dashboard/books")
  }

  const handleProcessBook = () => {
    // Implement process book logic here
    console.log("Processing book:", params.id)
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
                src={book.thumbnail || "/placeholder.svg"}
                alt={`${book.title} cover`}
                layout="fill"
                objectFit="cover"
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
              {book.categories.map((category) => (
                <Badge key={category} variant="outline" className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{category}</span>
                </Badge>
              ))}
            </div>
            <p className="text-gray-600">{book.description}</p>
          </CardContent>
        </Card>

        {/* Right Section: Action Buttons */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <Button className="w-full" onClick={() => window.open(book.pdfUrl, "_blank")}>
              Open PDF
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)}>
              Delete
            </Button>
            <div>
            <Link href={`/dashboard/books/process/${book.id}`}>
            <Button variant="secondary" className="w-full" onClick={handleProcessBook}>
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

