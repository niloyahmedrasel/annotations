"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface BookType {
  id: string
  name: string
  description: string
}

const initialBookTypes: BookType[] = [
  { id: "1", name: "Religious", description: "Books related to religious studies and practices" },
  { id: "2", name: "Legal", description: "Books focusing on Islamic law and jurisprudence" },
  { id: "3", name: "Scholarly", description: "Academic works and research in Islamic studies" },
]

export default function NewBookTypePage() {
  const [bookTypes, setBookTypes] = useState<BookType[]>(initialBookTypes)
  const [newType, setNewType] = useState({ name: "", description: "" })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [typeToDelete, setTypeToDelete] = useState<BookType | null>(null)

  const addBookType = () => {
    if (newType.name.trim() !== "" && newType.description.trim() !== "") {
      setBookTypes([
        ...bookTypes,
        {
          id: Date.now().toString(),
          name: newType.name,
          description: newType.description,
        },
      ])
      setNewType({ name: "", description: "" })
    }
  }

  const openDeleteDialog = (type: BookType) => {
    setTypeToDelete(type)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setTypeToDelete(null)
  }

  const confirmDelete = () => {
    if (typeToDelete) {
      setBookTypes(bookTypes.filter((type) => type.id !== typeToDelete.id))
      closeDeleteDialog()
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">New Book Type</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="type-name">Type Name</Label>
          <Input
            id="type-name"
            value={newType.name}
            onChange={(e) => setNewType({ ...newType, name: e.target.value })}
            placeholder="Enter new book type name"
          />
        </div>
        <div>
          <Label htmlFor="type-description">Description</Label>
          <Input
            id="type-description"
            value={newType.description}
            onChange={(e) => setNewType({ ...newType, description: e.target.value })}
            placeholder="Enter book type description"
          />
        </div>
      </div>
      <Button onClick={addBookType}>Add New Book Type</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell className="font-medium">{type.name}</TableCell>
              <TableCell>{type.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(type)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the book type "{typeToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

