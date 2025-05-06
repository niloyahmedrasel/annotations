"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Search } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"

interface Author {
  _id: string
  title: string
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [newAuthor, setNewAuthor] = useState({ title: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {t,i18n} = useTranslation()
  const isRTL = i18n.language === "ar"
 
  const user = sessionStorage.getItem("user")
  const token = user ? JSON.parse(user).token : null


  useEffect(() => {
    fetchAuthors()
  }, [])
  const fetchAuthors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/author",{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error("Failed to fetch authors")
      }
      
      setAuthors(data.authors)
    } catch (error:any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addAuthor = async () => {
    if (newAuthor.title.trim() === "") {
      toast.warning(t("Author title cannot be empty"))
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/author", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAuthor),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      fetchAuthors()
      toast.success(t("Author added successfully"))
      setNewAuthor({ title: "" })
    } catch (error:any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAuthor = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/author/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setAuthors(authors.filter((author) => author._id !== id))
      toast.success(t("Author deleted successfully"))
    } catch (error:any) {
      toast.error(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAuthors =
    authors && authors.length > 0
      ? authors.filter((author) => author.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  return (
    <div className="space-y-6 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">{t("Authors")}</h1>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("Search authors...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Add author form */}
      <div className="flex space-x-4">
        <Input
          placeholder={t("Author title")}
          value={newAuthor.title}
          onChange={(e) => setNewAuthor({ title: e.target.value })}
        />
        <Button onClick={addAuthor} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t(" Add Author")}
        </Button>
      </div>

      {/* Authors table */}
      {isLoading ? (
        <div className="text-center py-8">{("Loading authors...")}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? "text-right" : "text-left"}>{t("Title")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!authors || filteredAuthors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {searchQuery ? "No authors match your search" : "No authors found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAuthors.map((author) => (
                <TableRow key={author._id}>
                  <TableCell className="font-medium">{author.title}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteAuthor(author._id)} disabled={isLoading}>
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
