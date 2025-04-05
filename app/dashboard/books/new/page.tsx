"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-toastify"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

const bookFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z.string({ required_error: "Please select an author." }),
  editor: z.string({ required_error: "Please select an editor." }),
  publisher: z.string({ required_error: "Please select a publisher." }),
  type: z.string({ required_error: "Please select a book type." }),
  category: z.string({ required_error: "Please select a category." }),
  bookCover: z
    .any()
    .optional()
    .nullable()
    .refine((file) => !file || file.length === 0 || file.length === 1, "Book cover is required for new books."),
  file: z
    .any()
    .optional()
    .nullable()
    .refine((file) => !file || file.length === 0 || file.length === 1, "File is required for new books."),
})

export default function BookFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookId = searchParams.get("id")
  const isEditMode = !!bookId
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [bookData, setBookData] = useState<any>(null)

  const form = useForm<z.infer<typeof bookFormSchema>>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      editor: "",
      publisher: "",
      type: "",
      category: "",
    },
  })

  // Fetch book data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBookData = async () => {
        try {
          setIsLoading(true)
          const user = sessionStorage.getItem("user")
          const token = user ? JSON.parse(user).token : null

          if (!token) {
            toast.error("Authentication required")
            router.push("/login")
            return
          }

          const response = await fetch(`https://lkp.pathok.com.bd/api/book/${bookId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) throw new Error("Failed to fetch book data")

          const data = await response.json()
          setBookData(data.book)

          // Set form values
          form.reset({
            title: data.book.title || "",
            author: data.book.author || "",
            editor: data.book.editor || "",
            publisher: data.book.publisher || "",
            type: data.book.type || "",
            category: data.book.category || "",
          })
        } catch (error) {
          console.error("Error fetching book:", error)
          toast.error("Failed to load book details")
        } finally {
          setIsLoading(false)
        }
      }

      fetchBookData()
    }
  }, [bookId, form, isEditMode, router])

  async function onSubmit(values: z.infer<typeof bookFormSchema>) {
    const formData = new FormData()
    formData.append("title", values.title)
    formData.append("author", values.author)
    formData.append("editor", values.editor)
    formData.append("publisher", values.publisher)
    formData.append("type", values.type)
    formData.append("category", values.category)

    if (values.bookCover && values.bookCover.length > 0) {
      formData.append("bookCover", values.bookCover[0])
    }
    if (values.file && values.file.length > 0) {
      formData.append("bookFile", values.file[0])
    }

    const user = sessionStorage.getItem("user")
    const token = user ? JSON.parse(user).token : null

    if (!token) {
      toast.error("Authentication required")
      return
    }

    try {
      let response

      if (isEditMode) {
        // PUT request for editing
        response = await fetch(`https://lkp.pathok.com.bd/api/book/${bookId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      } else {
        // POST request for creating
        response = await fetch("https://lkp.pathok.com.bd/api/book", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      }

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} book`)
      }

      const result = await response.json()
      console.log("Success:", result)
      form.reset()

      router.push("/dashboard/books")
      toast.success(`Book ${isEditMode ? "updated" : "created"} successfully!`)
    } catch (error) {
      console.error("Error:", error)
      toast.error(`Failed to ${isEditMode ? "update" : "create"} book`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading book details...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{isEditMode ? "Edit Book" : "Add New Book"}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="jane-austen">Jane Austen</SelectItem>
                    <SelectItem value="mark-twain">Mark Twain</SelectItem>
                    <SelectItem value="george-orwell">George Orwell</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="editor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Editor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an editor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a publisher" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="penguin">Penguin Books</SelectItem>
                    <SelectItem value="harpercollins">HarperCollins</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a book type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="scholarly">Scholarly</SelectItem>
                    <SelectItem value="religious">Religious</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="fiction">Fiction</SelectItem>
                    <SelectItem value="non-fiction">Non-fiction</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Input: Book Cover */}
          <FormField
            control={form.control}
            name="bookCover"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>{isEditMode ? "Upload New Book Cover (Optional)" : "Upload Book Cover"}</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} />
                </FormControl>
                {isEditMode && bookData?.bookCover && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Current cover:</p>
                    <img
                      src={`https://lkp.pathok.com.bd/upload/${bookData.bookCover}`}
                      alt="Current book cover"
                      className="mt-1 h-20 w-auto object-contain"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Input: Book File */}
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange } }) => (
              <FormItem>
                <FormLabel>{isEditMode ? "Upload New Book File (Optional)" : "Upload Book File"}</FormLabel>
                <FormControl>
                  <Input type="file" accept=".pdf,.docx" onChange={(e) => onChange(e.target.files)} />
                </FormControl>
                {isEditMode && bookData?.bookFile && (
                  <p className="text-sm text-gray-500 mt-2">Current file: {bookData.bookFile}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{isEditMode ? "Update Book" : "Submit"}</Button>
        </form>
      </Form>
    </div>
  )
}

