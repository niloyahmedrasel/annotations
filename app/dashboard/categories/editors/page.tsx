"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

interface Editor {
  id: string
  name: string
  email: string
  booksEdited: number
}

const initialEditors: Editor[] = [
  { id: "1", name: "John Doe", email: "john@example.com", booksEdited: 15 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", booksEdited: 22 },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", booksEdited: 8 },
]

export default function EditorsPage() {
  const [editors, setEditors] = useState<Editor[]>(initialEditors)
  const [newEditor, setNewEditor] = useState({ name: "", email: "" })

  const addEditor = () => {
    if (newEditor.name.trim() !== "" && newEditor.email.trim() !== "") {
      setEditors([
        ...editors,
        {
          id: Date.now().toString(),
          name: newEditor.name,
          email: newEditor.email,
          booksEdited: 0,
        },
      ])
      setNewEditor({ name: "", email: "" })
    }
  }

  const deleteEditor = (id: string) => {
    setEditors(editors.filter((editor) => editor.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Editors</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Editor name"
          value={newEditor.name}
          onChange={(e) => setNewEditor({ ...newEditor, name: e.target.value })}
        />
        <Input
          placeholder="Editor email"
          value={newEditor.email}
          onChange={(e) => setNewEditor({ ...newEditor, email: e.target.value })}
        />
        <Button onClick={addEditor}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Editor
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Books Edited</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {editors.map((editor) => (
            <TableRow key={editor.id}>
              <TableCell className="font-medium">{editor.name}</TableCell>
              <TableCell>{editor.email}</TableCell>
              <TableCell>{editor.booksEdited}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteEditor(editor.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

