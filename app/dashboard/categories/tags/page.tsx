"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Search } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Tag {
  _id: string
  title: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState({ title: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
 
  const user = sessionStorage.getItem("user")
  const token = user ? JSON.parse(user).token : null

  useEffect(() => {
    fetchTags()
  }, [])
  
  const fetchTags = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/tag", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch tags")
      }
      const data = await response.json()
      setTags(data.tags)
    } catch (error) {
      toast.error("Failed to load tags")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = async () => {
    if (newTag.title.trim() === "") {
      toast.warning("Tag title cannot be empty")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/tag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTag),
      })

      if (!response.ok) {
        throw new Error("Failed to add tag")
      }

      fetchTags()
      toast.success("Tag added successfully")
      setNewTag({ title: "" })
    } catch (error) {
      toast.error("Failed to add tag")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTag = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/tag/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete tag")
      }

      setTags(tags.filter((tag) => tag._id !== id))
      toast.success("Tag deleted successfully")
    } catch (error) {
      toast.error("Failed to delete tag")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTags =
    tags && tags.length > 0
      ? tags.filter((tag) => tag.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  return (
    <div className="space-y-6 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">Tags</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Tag title"
          value={newTag.title}
          onChange={(e) => setNewTag({ title: e.target.value })}
        />
        <Button onClick={addTag} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading tags...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!tags || filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {searchQuery ? "No tags match your search" : "No tags found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag) => (
                <TableRow key={tag._id}>
                  <TableCell className="font-medium">{tag.title}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteTag(tag._id)} disabled={isLoading}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
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