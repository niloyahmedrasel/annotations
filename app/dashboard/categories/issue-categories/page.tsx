"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

interface IssueCategory {
  id: string
  name: string
  description: string
  issueCount: number
}

const initialIssueCategories: IssueCategory[] = [
  { id: "1", name: "Technical", description: "Technical issues and bugs", issueCount: 50 },
  { id: "2", name: "Content", description: "Issues related to book content", issueCount: 30 },
  { id: "3", name: "User Experience", description: "Issues affecting user experience", issueCount: 25 },
]

export default function IssueCategoriesPage() {
  const [issueCategories, setIssueCategories] = useState<IssueCategory[]>(initialIssueCategories)
  const [newIssueCategory, setNewIssueCategory] = useState({ name: "", description: "" })

  const addIssueCategory = () => {
    if (newIssueCategory.name.trim() !== "") {
      setIssueCategories([
        ...issueCategories,
        {
          id: Date.now().toString(),
          name: newIssueCategory.name,
          description: newIssueCategory.description,
          issueCount: 0,
        },
      ])
      setNewIssueCategory({ name: "", description: "" })
    }
  }

  const deleteIssueCategory = (id: string) => {
    setIssueCategories(issueCategories.filter((category) => category.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Issue Categories</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Category name"
          value={newIssueCategory.name}
          onChange={(e) => setNewIssueCategory({ ...newIssueCategory, name: e.target.value })}
        />
        <Input
          placeholder="Category description"
          value={newIssueCategory.description}
          onChange={(e) => setNewIssueCategory({ ...newIssueCategory, description: e.target.value })}
        />
        <Button onClick={addIssueCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Issue Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issueCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.issueCount}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteIssueCategory(category.id)}>
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

