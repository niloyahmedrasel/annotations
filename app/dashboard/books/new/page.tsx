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

interface DropdownOption {
  _id: string
  title: string
}

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
  const [authors, setAuthors] = useState<DropdownOption[]>([])
  const [editors, setEditors] = useState<DropdownOption[]>([])
  const [publishers, setPublishers] = useState<DropdownOption[]>([])
  const [bookTypes, setBookTypes] = useState<DropdownOption[]>([])
  const [bookCategories, setBookCategories] = useState<DropdownOption[]>([])

  const [authorsLoading, setAuthorsLoading] = useState(true)
  const [editorsLoading, setEditorsLoading] = useState(true)
  const [publishersLoading, setPublishersLoading] = useState(true)
  const [bookTypesLoading, setBookTypesLoading] = useState(true)
  const [bookCategoriesLoading, setBookCategoriesLoading] = useState(true)

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

  const getToken = () => {
    const user = sessionStorage.getItem("user")
    const token = user ? JSON.parse(user).token : null

    if (!token) {
      toast.error("Authentication required")
      router.push("/login")
      return null
    }

    return token
  }

  const fetchAuthors = async () => {
    setAuthorsLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch("https://lkp.pathok.com.bd/api/author", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch authors")

      const data = await response.json()
      setAuthors(data.authors)
    } catch (error) {
      console.error("Error fetching authors:", error)
      toast.error("Failed to load authors")
    } finally {
      setAuthorsLoading(false)
    }
  }

  const fetchEditors = async () => {
    setEditorsLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch("https://lkp.pathok.com.bd/api/editor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch editors")

      const data = await response.json()
      setEditors(data.editors)
    } catch (error) {
      console.error("Error fetching editors:", error)
      toast.error("Failed to load editors")
    } finally {
      setEditorsLoading(false)
    }
  }

  const fetchPublishers = async () => {
    setPublishersLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch("https://lkp.pathok.com.bd/api/publisher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch publishers")

      const data = await response.json()
      setPublishers(data.publishers)
    } catch (error) {
      console.error("Error fetching publishers:", error)
      toast.error("Failed to load publishers")
    } finally {
      setPublishersLoading(false)
    }
  }

  const fetchBookTypes = async () => {
    setBookTypesLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch("https://lkp.pathok.com.bd/api/bookType", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch book types")

      const data = await response.json()
      setBookTypes(data.bookTypes)
    } catch (error) {
      console.error("Error fetching book types:", error)
      toast.error("Failed to load book types")
    } finally {
      setBookTypesLoading(false)
    }
  }

  const fetchBookCategories = async () => {
    setBookCategoriesLoading(true)
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch("https://lkp.pathok.com.bd/api/bookCategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch book categories")

      const data = await response.json()
      setBookCategories(data.bookCategories)
    } catch (error) {
      console.error("Error fetching book categories:", error)
      toast.error("Failed to load book categories")
    } finally {
      setBookCategoriesLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthors()
    fetchEditors()
    fetchPublishers()
    fetchBookTypes()
    fetchBookCategories()
  }, [router])

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
        response = await fetch(`https://lkp.pathok.com.bd/api/book/${bookId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      } else {
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
                    {authorsLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : authors.length > 0 ? (
                      authors.map((author) => (
                        <SelectItem key={author._id} value={author._id}>
                          {author.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm">No authors found</div>
                    )}
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
                    {editorsLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : editors.length > 0 ? (
                      editors.map((editor) => (
                        <SelectItem key={editor._id} value={editor._id}>
                          {editor.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm">No editors found</div>
                    )}
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
                    {publishersLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : publishers.length > 0 ? (
                      publishers.map((publisher) => (
                        <SelectItem key={publisher._id} value={publisher._id}>
                          {publisher.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm">No publishers found</div>
                    )}
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
                    {bookTypesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : bookTypes.length > 0 ? (
                      bookTypes.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm">No book types found</div>
                    )}
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
                    {bookCategoriesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : bookCategories.length > 0 ? (
                      bookCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm">No categories found</div>
                    )}
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
