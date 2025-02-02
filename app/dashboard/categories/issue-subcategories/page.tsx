"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IssueSubcategory {
  id: string
  name: string
  parentCategory: string
  description: string
  issueCount: number
}

const initialIssueSubcategories: IssueSubcategory[] = [
  {
    id: "1",
    name: "Login Issues",
    parentCategory: "Technical",
    description: "Issues related to user login",
    issueCount: 20,
  },
  {
    id: "2",
    name: "Typos",
    parentCategory: "Content",
    description: "Typographical errors in book content",
    issueCount: 15,
  },
  {
    id: "3",
    name: "UI Glitches",
    parentCategory: "User Experience",
    description: "Visual glitches in the user interface",
    issueCount: 10,
  },
]

const parentCategories = ["Technical", "Content", "User Experience"]

export default function IssueSubcategoriesPage() {
  const [issueSubcategories, setIssueSubcategories] = useState<IssueSubcategory[]>(initialIssueSubcategories)
  const [newIssueSubcategory, setNewIssueSubcategory] = useState({ name: "", parentCategory: "", description: "" })

  const addIssueSubcategory = () => {
    if (newIssueSubcategory.name.trim() !== "" && newIssueSubcategory.parentCategory !== "") {
      setIssueSubcategories([
        ...issueSubcategories,
        {
          id: Date.now().toString(),
          name: newIssueSubcategory.name,
          parentCategory: newIssueSubcategory.parentCategory,
          description: newIssueSubcategory.description,
          issueCount: 0,
        },
      ])
      setNewIssueSubcategory({ name: "", parentCategory: "", description: "" })
    }
  }

  const deleteIssueSubcategory = (id: string) => {
    setIssueSubcategories(issueSubcategories.filter((subcategory) => subcategory.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Issue Sub-categories</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Subcategory name"
          value={newIssueSubcategory.name}
          onChange={(e) => setNewIssueSubcategory({ ...newIssueSubcategory, name: e.target.value })}
        />
        <Select
          value={newIssueSubcategory.parentCategory}
          onValueChange={(value) => setNewIssueSubcategory({ ...newIssueSubcategory, parentCategory: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select parent category" />
          </SelectTrigger>
          <SelectContent>
            {parentCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Subcategory description"
          value={newIssueSubcategory.description}
          onChange={(e) => setNewIssueSubcategory({ ...newIssueSubcategory, description: e.target.value })}
        />
        <Button onClick={addIssueSubcategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subcategory
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Issue Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {issueSubcategories.map((subcategory) => (
            <TableRow key={subcategory.id}>
              <TableCell className="font-medium">{subcategory.name}</TableCell>
              <TableCell>{subcategory.parentCategory}</TableCell>
              <TableCell>{subcategory.description}</TableCell>
              <TableCell>{subcategory.issueCount}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteIssueSubcategory(subcategory.id)}>
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

