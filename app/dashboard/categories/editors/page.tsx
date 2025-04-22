"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2, Search } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Editor {
  _id: string
  title: string
}

export default function EditorsPage() {
  const [editors, setEditors] = useState<Editor[]>([])
  const [newEditor, setNewEditor] = useState({ title: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
 
  const user = sessionStorage.getItem("user")
  const token = user ? JSON.parse(user).token : null

  useEffect(() => {
    fetchEditors()
  }, [])
  
  const fetchEditors = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/editor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch editors")
      }
      const data = await response.json()
      setEditors(data.editors)
    } catch (error) {
      toast.error("Failed to load editors")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addEditor = async () => {
    if (newEditor.title.trim() === "") {
      toast.warning("Editor title cannot be empty")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://lkp.pathok.com.bd/api/editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEditor),
      })

      if (!response.ok) {
        throw new Error("Failed to add editor")
      }

      fetchEditors()
      toast.success("Editor added successfully")
      setNewEditor({ title: "" })
    } catch (error) {
      toast.error("Failed to add editor")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEditor = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://lkp.pathok.com.bd/api/editor/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete editor")
      }

      setEditors(editors.filter((editor) => editor._id !== id))
      toast.success("Editor deleted successfully")
    } catch (error) {
      toast.error("Failed to delete editor")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredEditors =
    editors && editors.length > 0
      ? editors.filter((editor) => editor.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  return (
    <div className="space-y-6 p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold">Editors</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search editors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex space-x-4">
        <Input
          placeholder="Editor title"
          value={newEditor.title}
          onChange={(e) => setNewEditor({ title: e.target.value })}
        />
        <Button onClick={addEditor} disabled={isLoading}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Editor
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading editors...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!editors || filteredEditors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  {searchQuery ? "No editors match your search" : "No editors found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredEditors.map((editor) => (
                <TableRow key={editor._id}>
                  <TableCell className="font-medium">{editor.title}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => deleteEditor(editor._id)} disabled={isLoading}>
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