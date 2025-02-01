"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Trash2 } from "lucide-react"

interface Tag {
  id: string
  name: string
  count: number
}

const initialTags: Tag[] = [
  { id: "1", name: "Hadith", count: 150 },
  { id: "2", name: "Fiqh", count: 120 },
  { id: "3", name: "Tafsir", count: 80 },
  { id: "4", name: "Aqeedah", count: 60 },
  { id: "5", name: "Seerah", count: 40 },
]

export default function AnnotationTagsPage() {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() !== "") {
      setTags([
        ...tags,
        {
          id: Date.now().toString(),
          name: newTag,
          count: 0,
        },
      ])
      setNewTag("")
    }
  }

  const deleteTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Annotation Tags</h1>
      <div className="flex space-x-4">
        <Input placeholder="New tag name" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
        <Button onClick={addTag}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Tag
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tag</TableHead>
            <TableHead>Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>
                <Badge variant="outline">{tag.name}</Badge>
              </TableCell>
              <TableCell>{tag.count}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteTag(tag.id)}>
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

