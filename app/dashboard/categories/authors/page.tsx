"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

interface Author {
  id: string
  name: string
  nationality: string
  booksWritten: number
}

const initialAuthors: Author[] = [
  { id: "1", name: "J.K. Rowling", nationality: "British", booksWritten: 15 },
  { id: "2", name: "Stephen King", nationality: "American", booksWritten: 61 },
  { id: "3", name: "Haruki Murakami", nationality: "Japanese", booksWritten: 14 },
]

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>(initialAuthors)
  const [newAuthor, setNewAuthor] = useState({ name: "", nationality: "" })

  const addAuthor = () => {
    if (newAuthor.name.trim() !== "" && newAuthor.nationality.trim() !== "") {
      setAuthors([
        ...authors,
        {
          id: Date.now().toString(),
          name: newAuthor.name,
          nationality: newAuthor.nationality,
          booksWritten: 0,
        },
      ])
      setNewAuthor({ name: "", nationality: "" })
    }
  }

  const deleteAuthor = (id: string) => {
    setAuthors(authors.filter((author) => author.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Authors</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Author name"
          value={newAuthor.name}
          onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
        />
        <Input
          placeholder="Author nationality"
          value={newAuthor.nationality}
          onChange={(e) => setNewAuthor({ ...newAuthor, nationality: e.target.value })}
        />
        <Button onClick={addAuthor}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Author
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Books Written</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.id}>
              <TableCell className="font-medium">{author.name}</TableCell>
              <TableCell>{author.nationality}</TableCell>
              <TableCell>{author.booksWritten}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteAuthor(author.id)}>
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

