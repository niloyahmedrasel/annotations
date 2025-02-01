"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  fatwaCount: number
}

const initialCategories: Category[] = [
  { id: "1", name: "Worship", description: "Matters related to Islamic worship", fatwaCount: 25 },
  { id: "2", name: "Financial Transactions", description: "Islamic rulings on financial matters", fatwaCount: 18 },
  { id: "3", name: "Family", description: "Fatwas related to family issues", fatwaCount: 22 },
  { id: "4", name: "Medical Ethics", description: "Islamic perspective on medical issues", fatwaCount: 15 },
]

export default function FatwaCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })

  const addCategory = () => {
    if (newCategory.name.trim() !== "") {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory.name,
          description: newCategory.description,
          fatwaCount: 0,
        },
      ])
      setNewCategory({ name: "", description: "" })
    }
  }

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Fatwa Categories</h1>
      <div className="flex space-x-4">
        <Input
          placeholder="Category name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <Input
          placeholder="Category description"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <Button onClick={addCategory}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Fatwa Count</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.fatwaCount}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => deleteCategory(category.id)}>
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

