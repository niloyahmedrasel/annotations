"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

interface Publisher {
  id: string
  name: string
  location: string
  booksPublished: number
}

const initialPublishers: Publisher[] = [
  { id: "1", name: "Penguin Books", location: "New York, USA", booksPublished: 1000 },
  { id: "2", name: "HarperCollins", location: "London, UK", booksPublished: 850 },
  { id: "3", name: "Random House", location: "New York, USA", booksPublished: 1200 },
]

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>(initialPublishers)
  const [newPublisher, setNewPublisher] = useState({ name: "", location: "" })

  const addPublisher = () => {
    if (newPublisher.name.trim() !== "" && newPublisher.location.trim() !== "") {
      setPublishers([
        ...publishers,
        {
          id: Date.now().toString(),
          name: newPublisher.name,
          location: newPublisher.location,
          booksPublished: 0,
        },
      ])
      setNewPublisher({ name: "", location: "" })
    }
  }

  const deletePublisher = (id: string) => {
    setPublishers(publishers.filter((publisher) => publisher.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Publishers</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Publisher name"
          value={newPublisher.name}
          onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
        />
        <Input
          placeholder="Publisher location"
          value={newPublisher.location}
          onChange={(e) => setNewPublisher({ ...newPublisher, location: e.target.value })}
        />
        <Button onClick={addPublisher}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Publisher
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Books Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publishers.map((publisher) => (
            <TableRow key={publisher.id}>
              <TableCell className="font-medium">{publisher.name}</TableCell>
              <TableCell>{publisher.location}</TableCell>
              <TableCell>{publisher.booksPublished}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deletePublisher(publisher.id)}>
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

