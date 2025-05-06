"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Search } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from "react-i18next"

interface Publisher {
  _id: string
  title: string
}

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [newPublisher, setNewPublisher] = useState({ title: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {t,i18n} = useTranslation()
  const isRTL = i18n.language === "ar"
 
  const user = sessionStorage.getItem("user")
  const token = user ? JSON.parse(user).token : null

  useEffect(() => {
    fetchPublishers()
  }, [])
  
  const fetchPublishers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/publisher", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch publishers")
      }
      const data = await response.json()
      setPublishers(data.publishers)
    } catch (error) {
      toast.error(t("Failed to load publishers"))
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addPublisher = async () => {
    if (newPublisher.title.trim() === "") {
      toast.warning(t("Publisher title cannot be empty"))
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/publisher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPublisher),
      })

      if (!response.ok) {
        throw new Error("Failed to add publisher")
      }

      fetchPublishers()
      toast.success(t("Publisher added successfully"))
      setNewPublisher({ title: "" })
    } catch (error) {
      toast.error(t("Failed to add publisher"))
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deletePublisher = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/publisher/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete publisher")
      }

      setPublishers(publishers.filter((publisher) => publisher._id !== id))
      toast.success("Publisher deleted successfully")
    } catch (error) {
      toast.error("Failed to delete publisher")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPublishers =
    publishers && publishers.length > 0
      ? publishers.filter((publisher) => publisher.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  return (
    <div className="space-y-6 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">{t("Publishers")}</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("Search publishers...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder={t("Publisher title")}
          value={newPublisher.title}
          onChange={(e) => setNewPublisher({ title: e.target.value })}
        />
        <Button onClick={addPublisher} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("Add Publisher")}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">{t("Loading publishers...")}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? "text-right" : "text-left"}>{t("Title")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!publishers || filteredPublishers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {searchQuery ? "No publishers match your search" : "No publishers found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPublishers.map((publisher) => (
                <TableRow key={publisher._id}>
                  <TableCell className="font-medium">{publisher.title}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deletePublisher(publisher._id)} disabled={isLoading}>
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