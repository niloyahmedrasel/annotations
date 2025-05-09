"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Search } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"

interface BookCategory {
  _id: string
  title: string
}

export default function BookCategoriesPage() {
  const [bookCategories, setBookCategories] = useState<BookCategory[]>([])
  const [newBookCategory, setNewBookCategory] = useState({ title: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {t, i18n} = useTranslation()
  const isRTL = i18n.language === "ar"
 
  const user = sessionStorage.getItem("user")
  const token = user ? JSON.parse(user).token : null

  useEffect(() => {
    fetchBookCategories()
  }, [])
  
  const fetchBookCategories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/bookCategory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
      
      setBookCategories(data.bookCategories)
    } catch (error:any) {
      toast.error(t("Failed to load book categories"))
      console.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const addBookCategory = async () => {
    if (newBookCategory.title.trim() === "") {
      toast.warning(t("Book category title cannot be empty"))
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/bookCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBookCategory),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      fetchBookCategories()
      toast.success(t("Book category added successfully"))
      setNewBookCategory({ title: "" })
    } catch (error:any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBookCategory = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/bookCategory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setBookCategories(bookCategories.filter((category) => category._id !== id))
      toast.success(t("Book category deleted successfully"))
    } catch (error:any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBookCategories =
    bookCategories && bookCategories.length > 0
      ? bookCategories.filter((category) => category.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  return (
    <div className="space-y-6 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">{t("Book Categories")}</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("Search book categories...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder={t("Book category title")}
          value={newBookCategory.title}
          onChange={(e) => setNewBookCategory({ title: e.target.value })}
        />
        <Button onClick={addBookCategory} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("Add Category")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">{t("Loading book categories...")}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL?"text-right":""}>{t("Title")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!bookCategories || filteredBookCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {searchQuery ? "No book categories match your search" : "No book categories found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredBookCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">{category.title}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteBookCategory(category._id)} disabled={isLoading}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("Delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}