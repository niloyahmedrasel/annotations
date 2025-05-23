"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { BookOpen, FileText, Tag, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

interface Book {
  _id: string
  bookCover: string
  bookFile: string
  title: string
  author: string
  type: string
  status: string
  category: string
  description: string
  pdfUrl: string
  isAvailableForModification?: boolean
  isAvailableForAnnotation?: boolean
  isAvailableForPublicReading?: boolean
}

export default function BookDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [modificationChecked, setModificationChecked] = useState(false)
  const [annotationChecked, setAnnotationChecked] = useState(false)
  const [publicReadingChecked, setPublicReadingChecked] = useState(false)

  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"

  useEffect(() => {
    if (!params.id) return

    const fetchBook = async () => {
      try {
        setIsLoading(true)
        const user = sessionStorage.getItem("user")
        const token = user ? JSON.parse(user).token : null

        if (!token) {
          toast.error(t("Authentication required"))
          router.push("/login")
          return
        }

        const response = await fetch(`https://lkp.pathok.com.bd/api/book/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.message)
        setBook(data.book)

      } catch (error:any) {
        console.error("Error fetching book:", error)
        toast.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id, router])

  useEffect(() => {
    if (book) {
      setModificationChecked(book.isAvailableForModification || false)
      setAnnotationChecked(book.isAvailableForAnnotation || false)
      setPublicReadingChecked(book.isAvailableForPublicReading || false)
    }
  }, [book])

  const handleOpenDoc = async () => {
    if (!book || !book?.bookFile) {
      toast.error(t("Book file not found!"))
      return
    }

    const editorUrl = `https://test.pathok.com.bd/editor?fileName=${encodeURIComponent(book.bookFile)}&mode=edit`
    window.open(editorUrl, "_blank")
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const user = sessionStorage.getItem("user")
      const token = user ? JSON.parse(user).token : null

      if (!token) {
        toast.error(t("Authentication required"))
        return
      }

      const response = await fetch(`https://lkp.pathok.com.bd/api/book/${params.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setIsDeleteDialogOpen(false)
      toast.success("Book deleted successfully")
      router.push("/dashboard/books")
    } catch (error:any) {
      console.error("Error deleting book:", error)
      toast.error(error.message)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>{t("Loading book details...")}</span>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">{t("Book Not Found")}</h2>
        <p className="mb-6">{t("The book you're looking for could not be found.")}</p>
        <Button onClick={() => router.push("/dashboard/books")}>{t("Back to Books")}</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{t("Book Details")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <Card className="col-span-1">
          <CardContent className="p-4">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={
                  book.bookCover
                    ? `https://lkp.pathok.com.bd/upload/${book.bookCover}`
                    : "/placeholder.svg?height=400&width=300"
                }
                alt={`${book.title} cover`}
                fill
                className="rounded-lg object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          </CardContent>
        </Card>

      
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
              <Badge variant={book.status === "Published" ? "default" : "secondary"}>{t(book.status)}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {book.category && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{book.category}</span>
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{book.description || t("No description available")}</p>


            <div className="mt-6 space-y-3 border-t pt-4">
              <h3 className="font-medium text-lg">{t("Availability Settings")}</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availableForModification"
                    checked={modificationChecked}
                    onCheckedChange={(checked) => setModificationChecked(checked === true)}
                  />
                  <label htmlFor="availableForModification" className="text-sm font-medium leading-none">
                    {t("Available for doc modification")}
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availableForAnnotation"
                    checked={annotationChecked}
                    onCheckedChange={(checked) => setAnnotationChecked(checked === true)}
                  />
                  <label htmlFor="availableForAnnotation" className="text-sm font-medium leading-none">
                   {t("Available for annotation")}
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availableForPublicReading"
                    checked={publicReadingChecked}
                    onCheckedChange={(checked) => setPublicReadingChecked(checked === true)}
                  />
                  <label htmlFor="availableForPublicReading" className="text-sm font-medium leading-none">
                    {t("Available for public reading")}
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Section: Action Buttons */}
        <Card className="col-span-1 md:col-span-3 lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <Button className="w-full" onClick={handleOpenDoc}>
              {t("Open Doc")}
            </Button>

            <Button className="w-full text-black" variant="secondary" asChild>
              <Link href={`/dashboard/fatwas/new/${book._id}`}>{t("Create Issue")}</Link>
            </Button>

            <Button className="w-full" variant="default" asChild>
              <Link href={"/dashboard/annotations"}>{t("Annotate")}</Link>
            </Button>

            <Button variant="destructive" className="w-full" onClick={() => setIsDeleteDialogOpen(true)}>
              {t("Delete")}
            </Button>

            <Button variant="secondary" className="w-full" disabled>
              <Link href={`/dashboard/books/process/${book._id}`}>{t("Process Book")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this book? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              {t("Cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Deleting...")}
                </>
              ) : (
                t("Delete")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

