"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  parentCategory: string | null
  itemCount: number
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Islamic Jurisprudence",
    description: "Principles and rulings of Islamic law",
    parentCategory: null,
    itemCount: 150,
  },
  {
    id: "2",
    name: "Hadith Studies",
    description: "Collection and analysis of prophetic traditions",
    parentCategory: null,
    itemCount: 200,
  },
  {
    id: "3",
    name: "Fiqh of Worship",
    description: "Rulings related to acts of worship",
    parentCategory: "1",
    itemCount: 75,
  },
  {
    id: "4",
    name: "Fiqh of Transactions",
    description: "Rulings related to financial and social transactions",
    parentCategory: "1",
    itemCount: 60,
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/dashboard/categories/new">Add New Category</Link>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Item Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.parentCategory ? (
                    categories.find((c) => c.id === category.parentCategory)?.name
                  ) : (
                    <Badge variant="secondary">Root Category</Badge>
                  )}
                </TableCell>
                <TableCell>{category.itemCount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/categories/${category.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
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
    </div>
  )
}

