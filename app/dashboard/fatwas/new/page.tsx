"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const books = ["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"]
const tags = ["Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5", "Tag 6", "Tag 7", "Tag 8"]

export default function NewFatwaPage() {
  const router = useRouter()
  const [selectedBook, setSelectedBook] = useState("")
  const [title, setTitle] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ selectedBook, title, selectedTags, description })
    router.push("/dashboard/fatwas")
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left side: PDF Viewer */}
      <div className="w-1/2 sticky top-0 h-screen overflow-y-auto p-4">
        <Card className="h-full bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-gray-400">PDF Viewer Placeholder</p>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Fatwa Creation Form */}
      <div className="w-1/2 p-6 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6">Create New Fatwa</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="book">Book</Label>
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger id="book">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book} value={book}>
                    {book}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <MultiSelect options={tags} selected={selectedTags} onChange={setSelectedTags} placeholder="Select tags" />
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-sm">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-auto p-0"
                    onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] bg-gray-700 border-gray-600"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/fatwas")}>
              Cancel
            </Button>
            <Button type="submit">Submit Fatwa</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

